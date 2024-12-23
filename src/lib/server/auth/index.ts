import { env } from "$env/dynamic/private";
import { catchReject } from "$lib";
import type { Cookies } from "@sveltejs/kit";
import { jwtVerify, SignJWT, type JWTPayload } from "jose";

export const createJwtSession = async (cookies: Cookies, { id, nama, role }: User) => {
    const token = await new SignJWT({ id, nama, role })
        .setProtectedHeader({ alg: "HS512"})
        .setIssuedAt()
        .setExpirationTime("3d")
        .setProtectedHeader({ alg: "HS512"})
        .sign(new TextEncoder().encode(env.AUTH_SECRET));

    cookies.set("_sinanusa.session.token", token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
        maxAge: 60 * 60 * 24 * 3,
    });
};

export const verifyJwtSession = async (token: string): Promise<{ success: false } | { success: true, payload: JWTPayload & User }> => {
    const [result, error] = await catchReject(async () => {
        return await jwtVerify(token, new TextEncoder().encode(env.AUTH_SECRET), {
            algorithms: ["HS512"]
        });
    });

    if (error !== null) return { success: false };

    return { success: true, payload: result.payload as JWTPayload & User };
};