import { db, eq, tbClassroom } from ".";

export const getClassroomById = async (id: number) => {
    return await db
        .select({
            id: tbClassroom.id,
            namaKelas: tbClassroom.namaKelas
        })
        .from(tbClassroom)
        .where(eq(tbClassroom.id, id))
        .limit(1);
};