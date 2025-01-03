import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { catchReject, parseQueryURL } from '$lib';
import { sql } from '$lib/server/database';

export const load: PageServerLoad = async ({ locals, url }) => {
    if (!locals.user) throw redirect(303, '/login');
	
	const { id } = parseQueryURL(url.searchParams, { id: 0 });
	
    const result = async () => {
        const [result, error] = await catchReject(async () => {
            return await sql`
                select
                    tb_penugasan.id,
                    tb_penugasan.id_kelas,
                    tb_penugasan.judul as nama_penugasan,
                    tb_penugasan.deskripsi,
                    tb_penugasan.batas_pengumpulan,
                    tb_penugasan.dibuat_pada,
                    tb_penugasan.tipe_penugasan,
                    tb_penugasan.file_lampiran,

                    tb_pengumpulan.selesai,
                    tb_pengumpulan.id as id_pengumpulan,
                    tb_pengumpulan.terlambat,
                    tb_pengumpulan.file_pengumpulan,
                    tb_pengumpulan.id_siswa
                from tb_penugasan
                left join tb_pengumpulan on tb_penugasan.id = tb_pengumpulan.id_penugasan
                where tb_penugasan.id_kelas in (
                    select id from tb_kelas where id = ${id} and telah_dihapus = false limit 1
                ) and tb_penugasan.telah_dihapus = false
                order by tb_penugasan.dibuat_pada desc`;
        });

        if (error !== null) {
            console.error("[LOAD ASSIGNMENT] ERROR : ", error.message);
            throw new Error("Terdapat kesalahan yang tidak terduga, coba lagi nanti");
        }

        return result;
	}; 

    return { penugasan: result() };
};

export const actions: Actions = {
    ['hapus-penugasan']: async ({ locals, url }) => {
        if (!locals.user) throw redirect(303, '/login');

        if (locals.user.role !== "Guru") {
            return fail(403, { success: false, text: "Anda tidak memiliki akses untuk menghapus penugasan" });
        }

        const { id } = parseQueryURL(url.searchParams, { id: 0 });

        const [result, error] = await catchReject(async () => {
            return await sql`
                update tb_penugasan
                set telah_dihapus = true
                where id = ${id} and telah_dihapus = false
                returning id`;
        });

        if (error !== null || result.length === 0) {
            console.error("[DELETE ASSIGNMENT] ERROR : ", error?.message);
            return fail(500, { success: false, text: "Terjadi kesalahan yang tidak terduga, coba lagi nanti" });
        }

        return { success: true, text: "Penugasan berhasil dihapus" };
    },
};