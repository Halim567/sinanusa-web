<script lang="ts">
    import * as Form from '../ui/form';
    import { Input } from '../ui/input';
    import * as Select from '../ui/select';

    import { classroomSchema } from '$lib/schema';
    import { valibotClient } from 'sveltekit-superforms/adapters';
    import { superForm, type SuperValidated, type Infer } from 'sveltekit-superforms';
    import Loading from '../ui/loading/loading.svelte';
    
    const { data, action, onSuccess, onRedirect }: { 
        data: SuperValidated<Infer<typeof classroomSchema>>, 
        action: string,
        onSuccess?: () => void,
        onRedirect?: () => void
    } = $props();
    
    let isChanged = $state(false);
    
    const form = superForm(data, { 
        onUpdated({ form: { message } }) { 
            if (onSuccess && message && message.success) {
                isChanged = false;
                onSuccess(); 
            }
        },
        onChange: () => isChanged = true,
        onResult: ev => {
            if (ev.result.type === "redirect") {
                isChanged = false;
                if (onRedirect) onRedirect();
            }
        },
        validators: valibotClient(classroomSchema),
    });

    const { form: formData, enhance, message, delayed } = form;
</script>

<form method="POST" use:enhance class="grid gap-4" action="{action}">
	<Form.Field {form} name="namaKelas">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Nama Kelas</Form.Label>
                <Input {...props} bind:value={$formData.namaKelas} placeholder="Sistem Pernapasan Manusia"/>
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="kelas">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Kelas</Form.Label>
                <Select.Root type="single" {...props} bind:value={$formData.kelas}>
                    <Select.Trigger placeholder="Pilih kelas">{$formData.kelas}</Select.Trigger>
                    <Select.Content>
                        {#each ["7A", "7B", "8A", "8B", "9A", "9B"] as kelas}
                            <Select.Item value={kelas}>{kelas}</Select.Item>
                        {/each}
                    </Select.Content>
                </Select.Root>
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="mataPelajaran">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Mata Pelajaran</Form.Label>
                <Select.Root type="single" {...props} bind:value={$formData.mataPelajaran}>
                    <Select.Trigger placeholder="Pilih mata pelajaran">{$formData.mataPelajaran}</Select.Trigger>
                    <Select.Content>
                        {#each ["IPA", "IPS", "Matematika", "Bahasa Indonesia", "Bahasa Inggris", "Pendidikan Agama Islam", "Pendidikan Kewarganegaraan", "Pendidikan Jasmani", "Seni Budaya", "Prakarya"] as mataPelajaran}
                            <Select.Item value={mataPelajaran}>{mataPelajaran}</Select.Item>
                        {/each}
                    </Select.Content>
                </Select.Root>
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <div class="grid gap-2">
        {#if $message && !$message.success}<span class="text-red-500 text-sm">{ $message.text }</span>{/if}
        <Form.Button class="w-full bg-blue-500 hover:bg-blue-700" disabled={$delayed || !isChanged}>
            {#if $delayed}<Loading/>{:else}Simpan{/if}
        </Form.Button>
    </div>
</form>
