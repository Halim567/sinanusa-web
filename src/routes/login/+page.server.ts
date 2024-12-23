import { message, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { loginSchema } from '$lib/schema';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { catchReject } from '$lib';
import { and, db, eq, sql, tbAccount, tbAdmin, tbGuru, tbSiswa } from '$lib/server/database';
import bcrypt from 'bcryptjs';
import { createJwtSession } from '$lib/server/auth';

export const load: PageServerLoad = async ({ }) => {
    return {
        form: await superValidate(valibot(loginSchema))
    };
};

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const form = await superValidate(request, valibot(loginSchema));
        if (!form.valid) return fail(422, { form });

        const [result, error] = await catchReject(async () => {
            return await db.select({
                idPengguna: sql<number>`
                    case
                        when ${tbAccount.role} = 'Siswa' then ${tbSiswa.id}
                        when ${tbAccount.role} = 'Guru' then ${tbGuru.id}
                        else ${tbAdmin.id}
                    end
                `,
                namaPengguna: sql<string>`
                    case
                        when ${tbAccount.role} = 'Siswa' then ${tbSiswa.nama}
                        when ${tbAccount.role} = 'Guru' then ${tbGuru.nama}
                        else ${tbAdmin.nama}
                    end`,
                role: tbAccount.role,
                password: tbAccount.password
            })
            .from(tbAccount)
            .leftJoin(tbSiswa, eq(tbAccount.id, tbSiswa.accountId))
            .leftJoin(tbGuru, eq(tbAccount.id, tbGuru.accountId))
            .leftJoin(tbAdmin, eq(tbAccount.id, tbAdmin.accountId))
            .where(and(eq(tbAccount.nomorInduk, form.data.nomorInduk), eq(tbAccount.aktif, true)))
            .limit(1);
        });

        if (error !== null) {
            console.error(error);
            return message(form, { success: false, text: "Terjadi kesalahan, silakan coba lagi nanti" }, { status: 500 });
        }

        if (result.length === 0) {
            console.log("No result");
            return message(form, { success: false, text: "Nomor induk atau kata sandi salah" }, { status: 401 });
        }

        const userData = result[0];

        if (!await bcrypt.compare(form.data.password, userData.password)) {
            return message(form, { success: false, text: "Nomor induk atau kata sandi salah" }, { status: 401 });
        }

        await createJwtSession(cookies, { id: userData.idPengguna, role: userData.role, nama: userData.namaPengguna });

        throw redirect(303, "/elearning");
    }
};