import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { penugasanSchema } from '$lib/schema';
import { valibot } from "sveltekit-superforms/adapters";
import type { Actions } from '@sveltejs/kit';
import { utapi } from '$lib/server/uploadthing';
import { catchReject, parseQueryURL } from '$lib';
import { sql } from '$lib/server/database';

export const load: PageServerLoad = async ({ locals, url }) => {
    if (!locals.user) throw redirect(303, "/login");

    const { id: classroomId, tipe: tipePenugasan } = parseQueryURL(url.searchParams, { id: 0, tipe: "" });
    if (classroomId === 0 || (tipePenugasan !== "Tugas" && tipePenugasan !== "Materi")) {
		return { error: true };
	}

    const [result, error] = await catchReject(async () => {
        return await sql`
            select tb_kelas.id from tb_kelas 
            where tb_kelas.id = ${classroomId} and tb_kelas.telah_dihapus = false limit 1`;
    });

    if (error !== null || result.length === 0) {
        return { error: true };
    }

    return {
        tipePenugasan,
        form: await superValidate(valibot(penugasanSchema))
    };
};

export const actions: Actions = {
    ['create-penugasan']: async ({ locals, request, url }) => {
        if (!locals.user) throw redirect(303, "/login");

        const form = await superValidate(request, valibot(penugasanSchema));
        if (locals.user.role !== "Guru") { 
            return message(form, { success: false, text: "Gagal membuat penugasan, Anda tidak memiliki izin untuk membuat penugasan" }, { status: 403 });
        }

        const { tipe: tipePenugasan, classroomId } = parseQueryURL(url.searchParams, { tipe: "", classroomId: 0 });
        if (!form.valid || tipePenugasan !== "Tugas" && tipePenugasan !== "Ujian" && tipePenugasan !== "Materi") {
            return fail(422, { form });
        }

        let deadline: string | null = null;
        if (form.data.batasPengumpulan !== undefined) {
            const newDate = new Date(form.data.batasPengumpulan);
            if (isNaN(newDate.getTime())) {
                return setError(form, "batasPengumpulan", "Tanggal batas pengumpulan tidak valid");
			}

			deadline = newDate.toISOString();
        }
        
        let fileLampiran: { url: string; name: string, key: string, size: number }[] = [];
        if (form.data.files !== undefined) {
            const result = await utapi.uploadFiles(form.data.files);

            for (const res of result) {
                if (res.error !== null) {
                    console.error("[BUAT ASSIGNMENT] Gagal mengupload file", res.error);
                    return message(form, { success: false, text: "Gagal mengupload file" }, { status: 500 });
                }

                const data = res.data;
                fileLampiran.push({ ...data });
            }
        }

        const [result, error] = await catchReject(async () => {
            return await sql`
                insert into tb_penugasan (
                    id_kelas,
                    judul,
                    deskripsi,
                    batas_pengumpulan,
                    tipe_penugasan,
                    file_lampiran
                ) values (
                    (select id from tb_kelas where id = ${classroomId} and telah_dihapus = false limit 1),
                    ${form.data.namaPenugasan},
                    ${form.data.deskripsi},
                    ${deadline},
                    ${tipePenugasan},
                    ${fileLampiran}
                )
                returning id, (select nama_kelas from tb_kelas where id = ${classroomId} limit 1) as nama_kelas`;
        });

        if (error !== null || result.length === 0) {
            console.error("[CREATE ASSIGNMENT] ERROR : ", error?.message);
            return message(form, { success: false, text: "Gagal membuat penugasan" }, { status: 500 });
        }
		
        console.log(result);
        throw redirect(303, `/elearning/${result[0].nama_kelas}?id=${classroomId}`);
    }
};
