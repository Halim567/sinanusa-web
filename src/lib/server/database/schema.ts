import { pgTable, unique, bigint, text, boolean, timestamp, foreignKey, date, integer, pgEnum, jsonb } from "drizzle-orm/pg-core"
import { relations, sql } from "drizzle-orm";

export const role = pgEnum("role", ["Tata Usaha", "Guru", "Siswa"]);
export const jenisKelamin = pgEnum("jenis_kelamin", ["Laki-Laki", "Perempuan"]);
export const agama = pgEnum("agama", ["Islam", "Kristen", "Katolik", "Hindu", "Budha", "Konghucu"]);
export const tipePenugasan = pgEnum("tipe_penugasan", ["Tugas", "Materi"]);

export const tbAkun = pgTable("tb_akun", {
	id: bigint("id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "tb_id_akun_seq", startWith: 1, increment: 1, minValue: 1, cache: 1 }),
	nomorInduk: text("nomor_induk").notNull().unique(),
	password: text("password").notNull(),
	role: role("role").notNull(),
	aktif: boolean("aktif").notNull().default(true),
	dibuatPada: timestamp("dibuat_pada", { withTimezone: true }).notNull().default(sql`(now() AT TIME ZONE 'utc'::text)`),
	diubahPada: timestamp("diubah_pada", { withTimezone: true }).notNull().default(sql`(now() AT TIME ZONE 'utc'::text)`)
});

export const tbTataUsaha = pgTable("tb_tata_usaha", {
	id: bigint("id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "tb_id_tata_usaha_seq", startWith: 1, increment: 1, minValue: 1, cache: 1 }),
	idAkun: bigint("id_akun", { mode: "bigint" }).references(() => tbAkun.id, { onDelete: "cascade" }).notNull(),
	nama: text("nama").notNull(),
	nuptk: text().notNull().unique(),
	jenisKelamin: jenisKelamin("jenis_kelamin").notNull(),
	tempatLahir: text("tempat_lahir").notNull(),
	tanggalLahir: date("tanggalLahir").notNull(),
	email: text("email").notNull().unique(),
	dibuatPada: timestamp("dibuat_pada", { withTimezone: true }).notNull().default(sql`(now() AT TIME ZONE 'utc'::text)`),
	diubahPada: timestamp("diubah_pada", { withTimezone: true }).notNull().default(sql`(now() AT TIME ZONE 'utc'::text)`)
});

export const tbGuru = pgTable("tb_guru", {
	id: bigint("id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "tb_id_guru_seq", startWith: 1, increment: 1, minValue: 1, cache: 1 }),
	idAkun: bigint("id_akun", { mode: "bigint" }).references(() => tbAkun.id, { onDelete: "cascade" }).notNull(),
	nama: text("nama").notNull(),
	nuptk: text().notNull().unique(),
	jenisKelamin: jenisKelamin("jenis_kelamin").notNull(),
	tempatLahir: text("tempat_lahir").notNull(),
	tanggalLahir: date("tanggalLahir").notNull(),
	email: text("email").notNull().unique(),
	dibuatPada: timestamp("dibuat_pada", { withTimezone: true }).notNull().default(sql`(now() AT TIME ZONE 'utc'::text)`),
	diubahPada: timestamp("diubah_pada", { withTimezone: true }).notNull().default(sql`(now() AT TIME ZONE 'utc'::text)`)
});

export const tbSiswa = pgTable("tb_siswa", {
	id: bigint("id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "tb_id_siswa_seq", startWith: 1, increment: 1, minValue: 1, cache: 1 }),
	idAkun: bigint("id_akun", { mode: "bigint" }).references(() => tbAkun.id, { onDelete: "cascade" }).notNull(),
	nama: text("nama").notNull(),
	nipd: text("nipd").notNull().unique(),
	jenisKelamin: jenisKelamin("jenis_kelamin").notNull(),
	nisn: text("nisn").notNull().unique(),
	tempatLahir: text("tempat_lahir").notNull(),
	tanggalLahir: date("tanggal_lahir").notNull(),
	nik: text("nik").notNull().unique(),
	agama: agama("agama").notNull(),
	kelas: text("kelas").notNull(),
	dibuatPada: timestamp("dibuat_pada", { withTimezone: true }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
	diubahPada: timestamp("diubah_pada", { withTimezone: true }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
});

export const tbKelas = pgTable("tb_kelas", {
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "tb_id_kelas_seq", startWith: 1, increment: 1, minValue: 1, cache: 1 }),
	idGuru: bigint("id_guru", { mode: "number" }).notNull().references(() => tbGuru.id, { onDelete: "cascade" }),
	namaKelas: text("nama_kelas").notNull(),
	kode: text("kode").notNull().unique(),
	mataPelajaran: text("mata_pelajaran").notNull(),
	kelas: text("kelas").notNull(),
	dibuatPada: timestamp("dibuat_pada", { withTimezone: true }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
	diubahPada: timestamp("diubah_pada", { withTimezone: true }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
});

export const tbPenugasan = pgTable("tb_penugasan", {
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "tb_id_penugasan_seq", startWith: 1, increment: 1, minValue: 1, cache: 1 }),
	idKelas: bigint("id_kelas", { mode: "number" }).notNull().references(() => tbKelas.id, { onDelete: "cascade" }),
	judul: text("judul").notNull(),
	deskripsi: text("deskripsi"),
	batasPengumpulan: timestamp("batas_pengumpulan", { withTimezone: true }),
	tipePenugasan: tipePenugasan("tipe_penugasan").notNull(),
	fileLampiran: jsonb("file_lampiran").array().$type<{ url: string, nama: string, key: string, ukuran: number }[]>(),
	dibuatPada: timestamp("dibuat_pada", { withTimezone: true }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
	diubahPada: timestamp("diubah_pada", { withTimezone: true }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
});

export const tbKelasSiswa = pgTable("tb_kelas_siswa", {
	id: bigint("id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "tb_kelas_siswa_id_seq", startWith: 1, increment: 1, minValue: 1, cache: 1 }),
	idKelas: bigint("id_kelas", { mode: "number" }).notNull().unique().references(() => tbKelas.id, { onDelete: "cascade" }),
	idSiswa: bigint("id_siswa", { mode: "number" }).notNull().references(() => tbSiswa.id, { onDelete: "cascade" }),
	dibuatPada: timestamp("dibuat_pada", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
	diubahPada: timestamp("diubah_pada", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
});

export const tbPengumpulan = pgTable("tb_pengumpulan", {
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "tb_id_pengumpulan_seq", startWith: 1, increment: 1, minValue: 1, cache: 1 }),
	idKelas: bigint("id_kelas", { mode: "number" }).notNull().references(() => tbKelas.id, { onDelete: "cascade" }),
	idSiswa: bigint("id_siswa", { mode: "number" }).notNull().references(() => tbSiswa.id, { onDelete: "cascade" }),
	terlambat: boolean().default(false).notNull(),
	selesai: boolean().default(false).notNull(),
	filePengumpulan: jsonb("file_pengumpulan").notNull().array().$type<{ url: string, nama: string, key: string, ukuran: number }[]>(),
	idPenugasan: bigint("id_penugasan", { mode: "number" }).notNull().references(() => tbPenugasan.id),
	dibuatPada: timestamp("dibuat_pada", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
	diubahPada: timestamp("diubah_pada", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
});

/// ================ relasi tabel ================ ///

export const tbAkunRelations = relations(tbAkun, ({ many }) => ({
	tbTataUsaha: many(tbTataUsaha),
	tbGuru: many(tbGuru),
	tbSiswa: many(tbSiswa)
}));

export const tbTataUsahaRelations = relations(tbTataUsaha, ({ one }) => ({
	tbAkun: one(tbAkun, {
		fields: [tbTataUsaha.idAkun],
		references: [tbAkun.id]
	})
}));

export const tbGuruRelations = relations(tbGuru, ({ one, many }) => ({
	tbAkun: one(tbAkun, {
		fields: [tbGuru.idAkun],
		references: [tbAkun.id]
	}),
	tbKelas: many(tbKelas)
}));

export const tbSiswaRelations = relations(tbSiswa, ({ one }) => ({
	tbAkun: one(tbAkun, {
		fields: [tbSiswa.idAkun],
		references: [tbAkun.id]
	})
}));

export const tbKelasRelations = relations(tbKelas, ({ one, many }) => ({
	tbGuru: one(tbGuru, {
		fields: [tbKelas.idGuru],
		references: [tbGuru.id]
	}),
	tbPenugasans: many(tbPenugasan),
	tbKelasSiswa: many(tbKelasSiswa),
	tbPengumpulan: many(tbPengumpulan),
}));

export const tbPenugasanRelations = relations(tbPenugasan, ({ one, many }) => ({
	tbKelas: one(tbKelas, {
		fields: [tbPenugasan.idKelas],
		references: [tbKelas.id]
	}),
	tbPengumpulans: many(tbPengumpulan),
}));

export const tbKelasSiswaRelations = relations(tbKelasSiswa, ({ one }) => ({
	tbKelas: one(tbKelas, {
		fields: [tbKelasSiswa.idKelas],
		references: [tbKelas.id]
	}),
	tbSiswa: one(tbSiswa, {
		fields: [tbKelasSiswa.idSiswa],
		references: [tbSiswa.id]
	}),
}));

export const tbPengumpulanRelations = relations(tbPengumpulan, ({ one }) => ({
	tbPenugasan: one(tbPenugasan, {
		fields: [tbPengumpulan.idPenugasan],
		references: [tbPenugasan.id]
	}),
	tbKelas: one(tbKelas, {
		fields: [tbPengumpulan.idKelas],
		references: [tbKelas.id]
	}),
	tbSiswa: one(tbSiswa, {
		fields: [tbPengumpulan.idSiswa],
		references: [tbSiswa.id]
	}),
}));
