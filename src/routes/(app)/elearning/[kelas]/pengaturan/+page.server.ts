import { classroomSchema } from '$lib/schema';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { catchReject } from '$lib';
import { and, count, db, eq, tbClassroom, tbClassroomSiswa, tbGuru, tbSiswa } from '$lib/server/database';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url, locals }) => {
    if (!locals.user) throw redirect(303, "/login");
    
    const classroomId = parseInt(url.searchParams.get('id')!);

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
            .where(and(eq(tbClassroom.id, classroomId), eq(tbClassroom.deleted, false)))
            .limit(1)
            .groupBy(tbClassroom.id, tbGuru.nama, tbClassroom.namaKelas, tbClassroom.kode);
    });

    if (error !== null || result.length === 0) {
        console.error(error);
        return { error: true };
    }

    const classroomData = result[0];

    return {
        classroomData,
        form: await superValidate({
            namaKelas: classroomData.judul_classroom!,
            mataPelajaran: classroomData.mata_pelajaran as any,
            kelas: classroomData.kelas as any
        }, valibot(classroomSchema)),
        pathname: url.pathname
    };
};