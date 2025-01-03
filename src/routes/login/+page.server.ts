import { message, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { loginSchema } from '$lib/schema';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { catchReject } from '$lib';
import bcrypt from 'bcryptjs';
import { createJwtSession } from '$lib/server/auth';
import { sql } from '$lib/server/database';

export const load: PageServerLoad = async () => {
    return {
        form: await superValidate(valibot(loginSchema))
    };
};

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const form = await superValidate(request, valibot(loginSchema));
        if (!form.valid) return fail(422, { form });

        const [result, error] = await catchReject(async () => {
            return await sql`
            select
                tb_akun.role,
                case
                    when tb_akun.role = 'Siswa' then tb_siswa.id
                    when tb_akun.role = 'Guru' then tb_guru.id
                    else tb_tata_usaha.id
                end as idPengguna,
                case
                    when tb_akun.role = 'Siswa' then tb_siswa.nama
                    when tb_akun.role = 'Guru' then tb_guru.nama
                    else tb_tata_usaha.nama
                end as namaPengguna,
                tb_akun.password
            from tb_akun
            left join tb_siswa on tb_akun.id = tb_siswa.id_akun
            left join tb_guru on tb_akun.id = tb_guru.id_akun
            left join tb_tata_usaha on tb_akun.id = tb_tata_usaha.id_akun
            where tb_akun.nomor_induk = ${form.data.nomorInduk} and tb_akun.aktif = true
            limit 1`;
        });

        if (error !== null) {
            console.error(error);
            return message(form, { success: false, text: "Terjadi kesalahan, silakan coba lagi nanti" }, { status: 500 });
        }

        if (result.length === 0) {
            return message(form, { success: false, text: "Nomor induk atau kata sandi salah" }, { status: 401 });
        }

        const userData = result[0];

        if (!await bcrypt.compare(form.data.password, userData.password)) {
            return message(form, { success: false, text: "Nomor induk atau kata sandi salah" }, { status: 401 });
        }

        await createJwtSession(cookies, { id: userData.idpengguna, role: userData.role, nama: userData.namapengguna });

        throw redirect(303, "/elearning");
    }
};