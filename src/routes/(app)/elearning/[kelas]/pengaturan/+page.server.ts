import { classroomSchema } from '$lib/schema';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { catchReject, parseQueryURL } from '$lib';
import { redirect } from '@sveltejs/kit';
import { sql } from '$lib/server/database';

export const load: PageServerLoad = async ({ url, locals }) => {
    if (!locals.user) throw redirect(303, "/login");

    const { id: classroomId } = parseQueryURL(url.searchParams, { id: 0 });

    const [result, error] = await catchReject(async () => {
        return await sql`
            select
                tb_kelas.id,
                tb_guru.nama,
                tb_kelas.nama_kelas,
                tb_kelas.mata_pelajaran,
                tb_kelas.kelas,
                tb_kelas.kode,
                tb_kelas.dibuat_pada,
                count(tb_kelas_siswa.id_siswa) as jumlah_siswa
            from tb_kelas
            full join tb_guru on tb_kelas.id_guru = tb_guru.id
            left join tb_kelas_siswa on tb_kelas.id = tb_kelas_siswa.id_kelas
            left join tb_siswa on tb_siswa.id = tb_kelas_siswa.id_siswa
            where tb_kelas.id = ${classroomId} and tb_kelas.telah_dihapus = false
            group by tb_kelas.id, tb_guru.nama, tb_kelas.nama_kelas, tb_kelas.kode, tb_kelas.dibuat_pada
            limit 1`;
    });

    if (error !== null || result.length === 0) {
        console.error("[LOAD CLASSROOM] ERROR : ", error?.message);
        return { error: true };
    }

    const classroomData = result[0];

    return {
        form: await superValidate({
            namaKelas: classroomData.nama_kelas,
            mataPelajaran: classroomData.mata_pelajaran,
            kelas: classroomData.kelas,
        }, valibot(classroomSchema)),
        classroomData
    };
};
