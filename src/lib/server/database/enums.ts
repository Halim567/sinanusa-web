import { pgEnum } from "drizzle-orm/pg-core";

export const agama = pgEnum("agama", ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Budha', 'Konghucu']);
export const jenisKelamin = pgEnum("jenis_kelamin", ['Laki-Laki', 'Perempuan']);
export const role = pgEnum("role", ['Guru', 'Siswa', 'Admin', 'Tata Usaha']);
export const statusPengumpulan = pgEnum("status_pengumpulan", ['Belum', 'Sudah']);
export const tipeAssignment = pgEnum("tipe_assignment", ['Ujian', 'Tugas', 'Materi']);