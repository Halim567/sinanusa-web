import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { catchReject, parseQueryURL } from '$lib';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { sql } from '$lib/server/database';
import { valibot } from 'sveltekit-superforms/adapters';
import { penugasanSchema } from '$lib/schema';
import { utapi } from '$lib/server/uploadthing';

export const load: PageServerLoad = async ({ locals, url }) => {
    if (!locals.user) throw redirect(303, "/login");

    const { id: classroomId, tipe: tipePenugasan, id_penugasan } = parseQueryURL(url.searchParams, { id: 0, tipe: "", id_penugasan: 0 });
    if (classroomId === 0 || (tipePenugasan !== "Tugas" && tipePenugasan !== "Materi")) {
        return { error: true };
    }

    const [result, error] = await catchReject(async () => {
        return await sql`
            select
                tb_penugasan.judul as nama_penugasan,
                tb_penugasan.deskripsi,
                tb_penugasan.batas_pengumpulan,
                tb_penugasan.tipe_penugasan
            from tb_penugasan
            where tb_penugasan.id = ${id_penugasan} and tb_penugasan.id_kelas = ${classroomId} and tb_penugasan.telah_dihapus = false 
            limit 1`;
    });

    if (error !== null || result.length === 0) {
        console.error("[LOAD ASSIGNMENT] ERROR : ", error?.message);
        return { error: true };
    }

    const batasPengumpulan = new Date(result[0].batas_pengumpulan);
    const formattedBatasPengumpulan = batasPengumpulan.toISOString().slice(0, 16);

    return {
        form: await superValidate({
            namaPenugasan: result[0].nama_penugasan,
            deskripsi: result[0].deskripsi ?? "",
            batasPengumpulan: formattedBatasPengumpulan,
        }, valibot(penugasanSchema)),
        tipePenugasan,
        id_penugasan,
    };
};

export const actions: Actions = {
    ['update-penugasan']: async ({ request, locals, url }) => {
        if (!locals.user) throw redirect(303, "/login");

        const form = await superValidate(request, valibot(penugasanSchema));
        const { classroomId, tipe: tipePenugasan, id_penugasan } = parseQueryURL(url.searchParams, { classroomId: 0, tipe: "", id_penugasan: 0 });
        if (classroomId === 0 || (tipePenugasan !== "Tugas" && tipePenugasan !== "Materi") || id_penugasan === 0) {
            console.error("[UPDATE ASSIGNMENT] Invalid URL", { classroomId, tipePenugasan, id_penugasan });
            return message(form, { success: false, text: "Tidak dapat memperbarui penugasan" }, { status: 400 });
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

        const [value, err] = await catchReject(async () => {
            return await sql`
                select 
                    file_lampiran 
                from tb_penugasan 
                where id = ${id_penugasan} and id_kelas = (
                    select id from tb_kelas where id = ${classroomId} and telah_dihapus = false limit 1
                ) and telah_dihapus = false 
                limit 1`;
        });

        if (err !== null || value.length === 0) {
            console.error("[UPDATE ASSIGNMENT] ERROR : ", err?.message);
            return message(form, { success: false, text: "Gagal memperbarui penugasan" }, { status: 500 });
        }

        if (fileLampiran.length > 0) {
            // @ts-ignore
            const res = await Promise.all(value[0].file_lampiran.map(async f => {
                const result = await utapi.deleteFiles(f.key);
                if (!result.success) {
                    console.error("[UPDATE ASSIGNMENT] Gagal menghapus file. key : ", f.key);
                } else {
                    console.log("[UPDATE ASSIGNMENT] Deleted file, key : ", f.key);
                }

                return result.deletedCount;
            }));

            console.log("[UPDATE ASSIGNMENT] Deleted old files, count : ", res);
        }

        const [result, error] = await catchReject(async () => {
            return await sql`
                update tb_penugasan set
                    judul = ${form.data.namaPenugasan},
                    deskripsi = ${form.data.deskripsi},
                    batas_pengumpulan = ${deadline},
                    file_lampiran = ${fileLampiran.length <= 0 ? value[0].file_lampiran : fileLampiran}
                where id = ${id_penugasan} and id_kelas = (
                    select id from tb_kelas where id = ${classroomId} and telah_dihapus = false limit 1
                ) and telah_dihapus = false
                returning id, judul, file_lampiran`;
        });

        if (error !== null || result.length === 0) {
            console.error("[UPDATE ASSIGNMENT] ERROR : ", error?.message);
            return message(form, { success: false, text: "Terjadi kesalahan tidak terduga, silahkan coba lagi nanti" }, { status: 500 });
        }

        console.log("[UPDATE ASSIGNMENT] Updated assignment : ", result[0]);

        throw redirect(303, `/elearning/${result[0].judul}?id=${classroomId}`);
    }
};