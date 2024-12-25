import { superValidate } from 'sveltekit-superforms';
import type { LayoutServerLoad } from './$types';
import { valibot } from 'sveltekit-superforms/adapters';
import { classroomSchema } from '$lib/schema';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ url, locals }) => {
    if (!locals.user) throw redirect(303, "/login");

    return { 
        path: url.pathname, 
        params: url.searchParams.get("id"), 
        user: locals.user, 
        form: await superValidate(valibot(classroomSchema)) 
    };
};