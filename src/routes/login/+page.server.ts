import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { loginSchema } from '$lib/schema';
import { fail, type Actions } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ }) => {
    return {
        form: await superValidate(valibot(loginSchema))
    };
};

export const actions: Actions = {
    default: async ({ request }) => {
        const form = await superValidate(request, valibot(loginSchema));
        if (!form.valid) return fail(422, { form });

        
    }
}