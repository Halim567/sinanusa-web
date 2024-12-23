<script lang="ts">
    import * as Dialog from '../ui/dialog';
    import * as Form from '../ui/form';
    import { Plus } from 'lucide-svelte';
    import { Input } from '../ui/input';
    import * as Select from '../ui/select';
    import { toast } from "svelte-sonner";

    import { classroomSchema } from '$lib/schema';
    import { valibotClient } from 'sveltekit-superforms/adapters';
    import { superForm, type SuperValidated, type Infer } from 'sveltekit-superforms';
    import Loading from '../ui/loading/loading.svelte';
    
    const { data, action }: { data: SuperValidated<Infer<typeof classroomSchema>>, action: string } = $props();
    let open = $state(false);
    
    const form = superForm(data, { 
        validators: valibotClient(classroomSchema),
        onUpdate({ form }) {
            if (form.message && form.message.success) {
                open = false;
                toast.success("Berhasil membuat ruang kelas", {
                    description: "Ruang kelas berhasil dibuat. Share kode kelas anda ke siswa untuk bergabung.",
                });
            }
        },
    });
    
    const { form: formData, enhance, message, delayed } = form;
</script>

<Dialog.Root {open} onOpenChange={() => open = true}>
    <Dialog.Trigger aria-label="Create Classroom" class="fixed lg:relative rounded-full h-14 w-14 lg:w-10 grid place-content-center lg:h-10 lg:hover:bg-gray-200 lg:rounded-md right-4 bottom-4 lg:inset-0 [&_svg]:size-6 shadow-lg lg:shadow-none lg:bg-transparent lg:text-black">
        <Plus/>
    </Dialog.Trigger>
    <Dialog.Content>
        <Dialog.Header class="items-start text-start">
            <Dialog.Title>Tambah Classroom</Dialog.Title>
            <Dialog.Description>
                Masukan nama ruang kelas, pilih kelas, dan mata pelajaran yang akan diajarkan.
            </Dialog.Description>
        </Dialog.Header>
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
                <Form.Button class="w-full">
                    {#if $delayed}<Loading/>{:else}Simpan{/if}
                </Form.Button>
            </div>
        </form>
    </Dialog.Content>
</Dialog.Root>