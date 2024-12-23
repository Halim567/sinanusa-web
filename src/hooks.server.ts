import { verifyJwtSession } from "$lib/server/auth";
import { redirect, type Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    const chipsAhoy = event.cookies.get("_sinanusa.session.token");

    if (chipsAhoy === undefined) {
        if (event.url.pathname !== "/login") {
            throw redirect(303, "/login");
        }

        return await resolve(event);
    }

    const result = await verifyJwtSession(chipsAhoy);
    if (!result.success) {
        event.cookies.delete("_sinanusa.session.token", { path: "/" });

        if (event.url.pathname !== "/login") {
            throw redirect(303, "/login");
        }

        return await resolve(event);
    }

    event.locals.user = result.payload;
    
    if (event.url.pathname === "/login") {
        throw redirect(303, "/elearning");
    }

    return await resolve(event);
};