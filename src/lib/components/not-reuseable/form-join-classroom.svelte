<script lang="ts">
	import * as Form from '../ui/form';
    import { Input } from '../ui/input';

    import { valibotClient } from 'sveltekit-superforms/adapters';
    import { superForm, type SuperValidated, type Infer } from 'sveltekit-superforms';
    import Loading from '../ui/loading/loading.svelte';
    import { joinClassroomSchema } from '$lib/schema';
	
	const { data, action, onSuccess, onRedirect }: { 
        data: SuperValidated<Infer<typeof joinClassroomSchema>>, 
        action: string,
        onSuccess?: () => void,
        onRedirect?: () => void
    } = $props();

	const form = superForm(data, { 
        validators: valibotClient(joinClassroomSchema),
        onUpdated({ form: { message } }) { 
            if (onSuccess && message && message.success) {
                onSuccess(); 
            }
        },
        onResult(ev) {
            if (ev.result.type === "redirect") {
                if (onRedirect) onRedirect();
            }
        }
    });

    const { form: formData, enhance, message, delayed } = form;
</script>

<form {action} method="POST" class="grid gap-4" use:enhance>
	<Form.Field {form} name="kodeKelas">
		<Form.Control>
            {#snippet children({ props })}
                <Form.Label>Kode kelas</Form.Label>
                <Input {...props} bind:value={$formData.kodeKelas} placeholder="Kode kelas yang dishare oleh guru mu"/>
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
	</Form.Field>
	<div class="grid gap-2">
        {#if $message && !$message.success}<span class="text-red-500 text-sm">{ $message.text }</span>{/if}
        <Form.Button class="w-full bg-blue-500 hover:bg-blue-700" disabled={$delayed}>
            {#if $delayed}<Loading/>{:else}Join Kelas{/if}
        </Form.Button>
    </div>
</form>
