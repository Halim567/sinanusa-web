import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { catchReject } from '$lib';
import { and, db, eq, tbAssignment, tbSubmission } from '$lib/server/database';

export const load: PageServerLoad = async ({ locals, url }) => {
    if (!locals.user) throw redirect(303, '/login');

    const classroomId = url.searchParams.get("id");
    if (classroomId === null) return { error: true };

    const id = parseInt(classroomId);
    if (isNaN(id)) return { error: true };

    const [result, error] = await catchReject(async () => {
        return await db
            .select({
                idPenugasan: tbAssignment.id,
                classroomId: tbAssignment.classroomId,
                namaPenugasan: tbAssignment.judul,
                deskripsi: tbAssignment.deskripsi,
                batasPengumpulan: tbAssignment.batasPengumpulan,
                dibuatPada: tbAssignment.dibuatPada,
                tipePenugasan: tbAssignment.tipeAssignment,
                fileDatas: tbAssignment.fileDatas,
                submissionSelesai: tbSubmission.selesai,
                submissionId: tbSubmission.id,
                submissionTerlambat: tbSubmission.terlambat,
                submissionFileUrls: tbSubmission.fileUrls,
                siswaId: tbSubmission.siswaId,
            })
            .from(tbAssignment)
            .leftJoin(tbSubmission, eq(tbSubmission.assignmentId, tbAssignment.id))
            .where(and(eq(tbAssignment.classroomId, id), eq(tbAssignment.deleted, false)))
    });

    if (error !== null) {
        console.error(`[Mengambil Penugasan] ${error}`);
        return { error: true };
    }

    return { penugasan: result };
};