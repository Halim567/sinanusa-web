import * as v from "valibot";

export const loginSchema = v.object({
    nomorInduk: v.pipe(
        v.string(),
        v.trim(),
        v.regex(/^\d+$/, "Nomor induk harus berupa angka"),
        v.nonEmpty("Nomor Induk tidak boleh kosong"),
    ),
    password: v.pipe(
        v.string(),
        v.trim(),
        v.nonEmpty("Password tidak boleh kosong"),
    ),
});

export type LoginSchemaType = v.InferOutput<typeof loginSchema>;

export const classroomSchema = v.object({
    namaKelas: v.pipe(
        v.string(),
        v.trim(),
        v.nonEmpty("Nama Classroom tidak boleh kosong"),
    ),
    kelas: v.picklist(
        ["7A", "7B", "8A", "8B", "9A", "9B"],
        "Harap pilih kelas yang tersedia",
    ),
    mataPelajaran: v.picklist([
        "IPA",
        "IPS",
        "Matematika",
        "Bahasa Indonesia",
        "Bahasa Inggris",
        "Pendidikan Agama Islam",
        "Pendidikan Kewarganegaraan",
        "Pendidikan Jasmani",
        "Seni Budaya",
        "Prakarya",
    ], "Harap pilih mata pelajaran yang tersedia"),
});

export type ClassroomSchemaType = v.InferOutput<typeof classroomSchema>;

const fileUpload = v.pipe(
    v.file(),
    v.mimeType([
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "text/csv",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "text/plain",
        "application/zip",
        "application/x-rar-compressed",
        "application/x-7z-compressed",
    ]),
    v.maxSize(10 * 1024 * 1024, "Ukuran file maksimal 10 MB"),
);

export const penugasanSchema = v.object({
    namaPenugasan: v.pipe(
        v.string(),
        v.nonEmpty("Nama Penugasan tidak boleh kosong"),
    ),
    batasPengumpulan: v.optional(
        v.pipe(
            v.string(),
            v.isoDateTime(),
            v.minValue(new Date().toISOString(), "Deadline tidak boleh kurang dari hari ini"),
        ),
    ),
    files: v.optional(v.pipe(v.array(fileUpload), v.maxLength(3, "Anda hanya bisa mengupload maksimal 3 file"))),
    deskripsi: v.optional(v.string())
});

export type PenugasanSchemaType = v.InferOutput<typeof penugasanSchema>