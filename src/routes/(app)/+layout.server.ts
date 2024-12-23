import { superValidate } from 'sveltekit-superforms';
import type { LayoutServerLoad } from './$types';
import { valibot } from 'sveltekit-superforms/adapters';
import { classroomSchema } from '$lib/schema';

export const load: LayoutServerLoad = async ({ url, locals }) => {
    return { 
        path: url.pathname, 
        params: url.searchParams.get("id"), 
        user: locals.user, 
        form: await superValidate(valibot(classroomSchema)) 
    };
};