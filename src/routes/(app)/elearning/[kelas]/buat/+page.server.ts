import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { penugasanSchema } from '$lib/schema';
import { valibot } from "sveltekit-superforms/adapters";
import type { Actions } from '@sveltejs/kit';
import { utapi } from '$lib/server/uploadthing';
import { catchReject } from '$lib';
import { db, tbAssignment } from '$lib/server/database';
import { getClassroomById } from '$lib/server/database/fetch';

export const load: PageServerLoad = async ({ locals, url }) => {
    if (!locals.user) throw redirect(303, "/login");

    const tipePenugasan = url.searchParams.get("tipe");

    if (tipePenugasan === null) {
        console.error("[BUAT ASSIGNMENT] Tipe assignment tidak ditemukan di url query");
        return { error: true };
    }

    const idQuery = url.searchParams.get("id");
    if (idQuery === null) {
        console.error("[BUAT ASSIGNMENT] ID kelas tidak ditemukan di url query");
        return { error: true };
    }

    const classroomId = parseInt(idQuery);
    if (isNaN(classroomId)) {
        console.error("[BUAT ASSIGNMENT] ID kelas tidak valid");
        return { error: true };
    }

    const [result, error] = await catchReject(async () => await getClassroomById(classroomId));

    if (error !== null) {
        console.error(`[BUAT ASSIGNMENT] ${error}`);
        return { error: true };
    }

    if (result.length === 0) {
        return { errorNotFound: true };
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

        const idQuery = url.searchParams.get("classroomId");
        const tipePenugasan = url.searchParams.get("tipe");

        if (idQuery === null) {
            return message(form, { success: false, text: "Gagal membuat penugasan, ID kelas tidak ditemukan" }, { status: 400 });
        }

        if (tipePenugasan === null || tipePenugasan !== "Tugas" && tipePenugasan !== "Ujian" && tipePenugasan !== "Materi") {
            return message(form, { success: false, text: "Gagal membuat penugasan, tipe penugasan tidak valid" }, { status: 400 });
        }

        const classroomId = parseInt(idQuery);
        if (isNaN(classroomId)) {
            return message(form, { success: false, text: "Gagal membuat penugasan, ID kelas tidak valid" }, { status: 400 });
        }

        if (!form.valid) {
            return fail(422, { form });
        }

        let deadline: string | null = null;

        if (form.data.batasPengumpulan !== undefined) {
            const newDate = new Date(form.data.batasPengumpulan);
            if (!isNaN(newDate.getTime())) {
                deadline = newDate.toISOString();
            } else {
                return setError(form, "batasPengumpulan", "Tanggal batas pengumpulan tidak valid");
            }
        }
        
        let fileDatas: { url: string; name: string, key: string }[] = [];
        if (form.data.files !== undefined) {
            const result = await utapi.uploadFiles(form.data.files);

            for (let i = 0; i < result.length; i++) {
                if (result[i].error !== null) {
                    console.error("[BUAT ASSIGNMENT] Gagal mengupload file", result[i].error);
                    return message(form, { success: false, text: "Gagal mengupload file" }, { status: 500 });
                }
                
                fileDatas.push({ url: result[i].data!.url, name: result[i].data!.name, key: result[i].data!.key });
            }
        }

        const [result, error] = await catchReject(async () => {
            return await db
                .insert(tbAssignment)
                .values({
                    judul: form.data.namaPenugasan,
                    tipeAssignment: tipePenugasan,
                    classroomId,
                    batasPengumpulan: deadline,
                    deskripsi: form.data.deskripsi,
                    fileDatas: fileDatas.length > 0 ? fileDatas : null,
                })
                .returning({
                    id: tbAssignment.id,
                    classroomId: tbAssignment.classroomId,
                });
        });

        if (error !== null || result.length === 0) {
            console.error("[BUAT ASSIGNMENT] Gagal membuat penugasan", error);
            const result = await utapi.deleteFiles(fileDatas.map(file => file.key));

            if (!result.success) {
                console.error("[BUAT ASSIGNMENT] Gagal menghapus file yang sudah diupload");
            }

            return message(form, { success: false, text: "Gagal membuat penugasan, silakan coba lagi nanti" }, { status: 500 });
        }

        throw redirect(303, `/elearning/${url.pathname.split("/")[2]}?id=${classroomId}`);
    }
};