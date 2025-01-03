import { catchReject, parseQueryURL } from '$lib';
import { classroomSchema, joinClassroomSchema } from '$lib/schema';
import { redirect, type Actions } from '@sveltejs/kit';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import crypto from "crypto";
import type { PageServerLoad } from './$types';
import { sql } from '$lib/server/database';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) throw redirect(303, '/login');
	
	const value = async () => {
        const [result, error] = await catchReject(async () => {
            return await sql`
                select
                    tb_kelas.id,
                    tb_guru.nama as namaPengajar,
                    tb_kelas.nama_kelas as namaKelas,
                    tb_kelas.mata_pelajaran as mataPelajaran,
                    tb_kelas.kelas,
                    tb_kelas.kode,
                    tb_kelas.dibuat_pada as dibuatPada,
                    count(tb_kelas_siswa.id_siswa) as jumlahSiswa
                from tb_kelas
                full join tb_guru on tb_kelas.id_guru = tb_guru.id
                left join tb_kelas_siswa on tb_kelas.id = tb_kelas_siswa.id_kelas
                left join tb_siswa on tb_siswa.id = tb_kelas_siswa.id_siswa
                where
                    case
                        when ${locals.user!.role} = 'Guru' then tb_kelas.id_guru = ${locals.user!.id}
                        when ${locals.user!.role} = 'Siswa' then tb_kelas.id in (select id_kelas from tb_kelas_siswa where id_siswa = ${locals.user!.id})
                        else 1 = 1
                    end
                    and tb_kelas.telah_dihapus = false
                group by tb_kelas.id, tb_guru.nama, tb_kelas.nama_kelas, tb_kelas.kode, tb_kelas.dibuat_pada
                order by tb_kelas.dibuat_pada desc`;
        });

        if (error !== null) {
            console.error("[LOAD CLASSROOM] ERROR : ", error.message);
            throw new Error("Terdapat kesalahan yang tidak terduga, coba lagi nanti");
        }

        return result;
    };

    return { dataKelas: value() };
};

export const actions: Actions = {
    ['create-classroom']: async ({ request, locals }) => {
        if (!locals.user) throw redirect(303, '/login');

        const form = await superValidate(request, valibot(classroomSchema));

        if (locals.user.role !== "Guru") {
            return message(form, { success: false, text: "Gagal membuat kelas, anda tidak memiliki akses untuk membuat kelas" }, { status: 403 });
        }

        if (!form.valid) return fail(422, { form });

        const [result, error] = await catchReject(async () => {
            return await sql`
                insert into tb_kelas (id_guru, nama_kelas, mata_pelajaran, kelas, kode)
                values (
                    ${locals.user!.id},
                    ${form.data.namaKelas},
                    ${form.data.mataPelajaran},
                    ${form.data.kelas},
                    ${crypto.randomBytes(4).toString("hex").toUpperCase()}
                )
                returning id`;
        });

        if (error !== null || result.length === 0) {
            console.error("[CREATE CLASSROOM] ERROR : ", error?.message);
            return message(form, { success: false, text: "Gagal membuat kelas" }, { status: 500 });
        }

        return message(form, { success: true, text: "Kelas berhasil dibuat" });
    },
    ['update-classroom']: async ({ request, locals, url }) => {
        if (!locals.user) throw redirect(303, '/login');

        const form = await superValidate(request, valibot(classroomSchema));
        const { id } = parseQueryURL(url.searchParams, { id: 0 });

        if (locals.user.role !== "Guru") {
           return message(form, { success: false, text: "Gagal mengubah kelas, anda tidak memiliki akses untuk mengubah kelas" }, { status: 403 });
        }

        if (!form.valid) return fail(422, { form });

        const [result, error] = await catchReject(async () => {
            return await sql`
                update tb_kelas
                set
                    nama_kelas = ${form.data.namaKelas},
                    mata_pelajaran = ${form.data.mataPelajaran},
                    kelas = ${form.data.kelas}
                where id = ${id} and id_guru = ${locals.user!.id} and telah_dihapus = false
                returning id, nama_kelas`;
        });

        if (error !== null || result.length === 0) {
           console.error("[UPDATE CLASSROOM] ERROR : ", error?.message);
           return message(form, { success: false, text: "Gagal mengubah kelas" }, { status: 500 });
        }

        throw redirect(303, `/elearning/${result[0].nama_kelas}/pengaturan?id=${result[0].id}`);
    },
    ['delete-classroom']: async ({ locals, url }) => {
        if (!locals.user) throw redirect(303, '/login');

        const { id: classroomId } = parseQueryURL(url.searchParams, { id: 0 });

        if (locals.user.role !== "Guru") {
            return fail(403, { success: false, text: "Anda tidak memiliki akses untuk menghapus kelas" });
        }

        const [result, error] = await catchReject(async () => {
            return await sql`
                update tb_kelas
                set telah_dihapus = true
                where id = ${classroomId} and id_guru = ${locals.user!.id} and telah_dihapus = false
                returning id`;
        });

        if (error !== null || result.length === 0) {
            console.error("[DELETE CLASSROOM] ERROR : ", error?.message);
            return fail(500, { success: false, text: "Gagal menghapus kelas, coba lagi nanti" });
        }

        throw redirect(303, "/elearning");
    },
	['join-classroom']: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, "/login");

		const form = await superValidate(request, valibot(joinClassroomSchema));

		if (locals.user.role !== "Siswa") {
			return message(form, { success: false, text: "Hanya siswa yang dapat join ke kelas" }, { status: 403 });
		}

		if (!form.valid) {
			return fail(422, { form });
		}

        const [result, error] = await catchReject(async () => {
            return await sql`
                insert into tb_kelas_siswa (id_kelas, id_siswa)
                select tb_kelas.id, ${locals.user!.id}
                from tb_kelas
                where tb_kelas.kode = ${form.data.kodeKelas} and tb_kelas.telah_dihapus = false
                returning id_kelas`;
        });

        if (error !== null) {
            if (error.message === 'duplicate key value violates unique constraint "tb_kelas_siswa_id_kelas_unique"') {
                return message(form, { success: false, text: "Anda sudah mengikuti kelas tersebut" }, { status: 400 });
            }

            console.error(error.message);
            return message(form, { success: false, text: "Terdapat Kesalahan yang tidak terduga, coba lagi nanti" }, { status: 500 });
        }

        console.log(result);

        if (result.length === 0) {
            return message(form, { success: false, text: `Kelas untuk kode "${form.data.kodeKelas}" tidak ditemukan atau mungkin sudah dihapus` }, { status: 404 });
        }

		return message(form, { success: true, text: "Berhasil join kelas" });
	}
};
