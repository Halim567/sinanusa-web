<script lang="ts">
    import * as Form from '$lib/components/ui/form';
    import { Input } from '$lib/components/ui/input';
    import * as Card from '$lib/components/ui/card';
    import Loading from '$lib/components/ui/loading/loading.svelte';
    import { Background, Logo } from '$lib/images';

    import { loginSchema } from '$lib/schema';
    import { valibotClient } from 'sveltekit-superforms/adapters';
    import type { PageData } from './$types';
    import { superForm } from 'sveltekit-superforms';

    const { data }: { data: PageData } = $props();

    const form = superForm(data.form, { 
        validators: valibotClient(loginSchema),
    });

    const { form: formData, enhance, message, delayed } = form;
</script>

<div class="w-full h-screen grid place-items-center bg-cover bg-center" style="background-image: url({Background});">
    <div class="grid gap-6">
        <div class="grid place-content-center justify-items-center">
            <img src={Logo} alt="Logo" class="w-16" />
            <h1 class="font-bold text-lg">SMP Nusa Putra Tangerang</h1>
        </div>
        <Card.Root class="max-w-[28rem]">
            <Card.Header class="grid gap-3">
                <Card.Title class="font-bold">Login</Card.Title>
                <Card.Description>Masukan Nomor Induk dan Password. Jika Tidak Punya Akun Silakan Hubungi Staff TU</Card.Description>
            </Card.Header>
            <Card.Content>
                <form method="POST" use:enhance class="grid gap-4">
                    <Form.Field {form} name="nomorInduk">
                        <Form.Control>
                            {#snippet children({ props })}
                                <Form.Label>Nomor Induk</Form.Label>
                                <Input {...props} bind:value={$formData.nomorInduk} />
                            {/snippet}
                        </Form.Control>
                        <Form.FieldErrors />
                    </Form.Field>
                    <Form.Field {form} name="password">
                        <Form.Control>
                            {#snippet children({ props })}
                                <Form.Label>Password</Form.Label>
                                <Input {...props} bind:value={$formData.password} type="password" />
                            {/snippet}
                        </Form.Control>
                        <Form.FieldErrors />
                    </Form.Field>
                    <div class="grid gap-2">
                        {#if $message && !$message.success}<span class="text-red-500">{ $message.text }</span>{/if}
                        <Form.Button class="w-full" disabled={$delayed}>
                            {#if $delayed}<Loading/>{:else}Login{/if}
                        </Form.Button>
                    </div>
                </form>
            </Card.Content>
        </Card.Root>
    </div>
</div>