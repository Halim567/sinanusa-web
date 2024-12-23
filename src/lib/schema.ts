import * as v from "valibot";

export const loginSchema = v.object({
    nomorInduk: v.pipe(v.string(), v.trim(), v.regex(/^\d+$/, "Nomor induk harus berupa angka"), v.nonEmpty("Nomor Induk tidak boleh kosong")),
    password: v.pipe(v.string(), v.trim(), v.nonEmpty("Password tidak boleh kosong")),
});

export type LoginSchemaType = v.InferOutput<typeof loginSchema>;

export const classroomSchema = v.object({
    namaKelas: v.pipe(v.string(), v.trim(), v.nonEmpty("Nama Classroom tidak boleh kosong")),
    kelas: v.picklist(['7A', '7B', '8A', '8B', '9A', '9B'], "Harap pilih kelas yang tersedia"),
    mataPelajaran: v.picklist(['IPA', 'IPS', 'Matematika', 'Bahasa Indonesia', 'Bahasa Inggris', 'Pendidikan Agama Islam', 'Pendidikan Kewarganegaraan', 'Pendidikan Jasmani', 'Seni Budaya', 'Prakarya'], "Harap pilih mata pelajaran yang tersedia")
});

export type ClassroomSchemaType = v.InferOutput<typeof classroomSchema>;

