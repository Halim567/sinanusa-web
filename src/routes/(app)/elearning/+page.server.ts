import { catchReject } from '$lib';
import { classroomSchema } from '$lib/schema';
import { and, count, db, desc, eq, sql, tbClassroom, tbClassroomSiswa, tbGuru, tbSiswa } from '$lib/server/database';
import { redirect, type Actions } from '@sveltejs/kit';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import crypto from "crypto";
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) throw redirect(303, '/login');

    const { user } = locals;
    const [result, error] = await catchReject(async () => {
        return await db.select({
                classroom_id: tbClassroom.id,
                nama_pengajar: tbGuru.nama,
                judul_classroom: tbClassroom.namaKelas,
                mata_pelajaran: tbClassroom.mataPelajaran,
                kelas: tbClassroom.kelas,
                kode: tbClassroom.kode,
                dibuat_pada: tbClassroom.dibuatPada,
                jumlah_siswa: count(tbClassroomSiswa.siswaId)
            })
            .from(tbClassroom)
            .fullJoin(tbGuru, eq(tbClassroom.guruId, tbGuru.id))
            .leftJoin(tbClassroomSiswa, eq(tbClassroom.id, tbClassroomSiswa.classroomId))
            .leftJoin(tbSiswa, eq(tbSiswa.id, tbClassroomSiswa.siswaId))
            .where(and(sql`
                case
                    when ${user.role} = 'Guru' then tb_classroom.guru_id = ${user.id}
                    when ${user.role} = 'Siswa' then tb_classroom.id in (select classroom_id from tb_classroom_siswa where siswa_id = ${user.id})
                    else 1 = 1
                end`,
                eq(tbClassroom.deleted, false)
            ))
            .groupBy(tbClassroom.id, tbGuru.nama, tbClassroom.namaKelas, tbClassroom.kode)
            .orderBy(desc(tbClassroom.dibuatPada))
    });

    if (error !== null) {
        console.error(error);
        return { error: "Gagal mengambil data kelas" };
    }

    return { classroomData: result, userRole: user.role };
};

export const actions: Actions = {
    ['create-classroom']: async ({ request, locals }) => {
        if (!locals.user) throw redirect(303, '/login');

        const form = await superValidate(request, valibot(classroomSchema));

        if (locals.user.role !== "Guru") 
            return message(form, { success: false, text: "Gagal membuat kelas, anda tidak memiliki akses untuk membuat kelas" }, { status: 403 });

        if (!form.valid) return fail(422, { form });

        const [result, error] = await catchReject(async () => {
            return await db.insert(tbClassroom)
                .values({
                    guruId: locals.user!.id,
                    namaKelas: form.data.namaKelas,
                    mataPelajaran: form.data.mataPelajaran,
                    kelas: form.data.kelas,
                    kode: crypto.randomBytes(4).toString("hex").toUpperCase()
                })
                .returning({ id: tbClassroom.id });
        });

        if (error != null || result.length === 0) {
            console.error(error);
            return message(form, { success: false, text: "Gagal membuat kelas" }, { status: 500 });
        }

        return message(form, { success: true, text: "Kelas berhasil dibuat" });
    }
};