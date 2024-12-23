import { redirect, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
    default: ({ cookies }) => {
        cookies.delete("_sinanusa.session.token", { path: "/" });
        throw redirect(303, "/login");
    }
};