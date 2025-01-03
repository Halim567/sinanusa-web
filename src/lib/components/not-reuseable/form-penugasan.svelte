<script lang="ts">
    import * as Form from '../ui/form';
    import { Input } from '../ui/input';
    import { FileIcon, Upload, X } from 'lucide-svelte';
    import { Textarea } from '../ui/textarea';
    import { Button } from '../ui/button';
    import Loading from '../ui/loading/loading.svelte';
    import { toast } from 'svelte-sonner';

    import { valibotClient } from 'sveltekit-superforms/adapters';
    import { superForm, type SuperValidated, type Infer } from 'sveltekit-superforms';
    import { penugasanSchema } from '$lib/schema';

    const { data, action, onSuccess, onRedirect, tipePenugasan }: { 
        data: SuperValidated<Infer<typeof penugasanSchema>>, 
        tipePenugasan: "Tugas" | "Materi" | "Ujian",
        action: string,
        onSuccess?: () => void,
        onRedirect?: () => void
    } = $props();

    let uploadedFiles = $state<File[]>([]), 
        isChanged = $state(false);
    
    const form = superForm(data, {
        validators: valibotClient(penugasanSchema),
        onUpdated({ form: { message } }) { 
            if (onSuccess && message && message.success) {
                onSuccess();
                uploadedFiles = [];
            }
        },
        onResult(ev) {
            if (ev.result.type === "redirect") {
                if (onRedirect) onRedirect();
            }
        },
        onSubmit(input) {
            uploadedFiles.forEach(v => input.formData.append("files", v));
        },
        onChange: () => isChanged = true
    });
    
    const { form: formData, enhance, message, delayed } = form;

    $effect(() => { tipePenugasan; setTimeout(() => uploadedFiles = [], 0); });
</script>

<form method="POST" use:enhance class="grid gap-4" action="{action}" enctype="multipart/form-data">
    <Form.Field {form} name="namaPenugasan">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Nama Penugasan</Form.Label>
                <Input {...props} bind:value={$formData.namaPenugasan} placeholder="Materi ZAT MAKANAN"/>
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    {#if tipePenugasan === "Tugas"}
        <Form.Field {form} name="batasPengumpulan">
            <Form.Control>
                {#snippet children({ props })}
                    <Form.Label>Batas Pengumpulan (opsional)</Form.Label>
                    <Input {...props} bind:value={$formData.batasPengumpulan} type="datetime-local" />
                {/snippet}
            </Form.Control>
            <Form.FieldErrors />
        </Form.Field>
    {/if}
    <Form.Field {form} name="deskripsi">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Deskripsi (opsional)</Form.Label>
                <Textarea {...props} bind:value={$formData.deskripsi} class="resize-none h-36"/>
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="files">
        <Form.Control>
            {#snippet children()}
                <Form.Label>Lampiran (opsional)</Form.Label>
                {#each uploadedFiles as file}
                    <div class="flex items-center border rounded-lg px-2 py-1 justify-between">
                        <span class="flex items-center gap-2 text-sm"><FileIcon size={18}/> {file.name}</span>
                        <Button variant="ghost" class="rounded-full w-8 h-8" onclick={() => {
                            const index = uploadedFiles.indexOf(file);
                            if (index > -1) {
                                uploadedFiles.splice(index, 1);
                            }
                        }}><X/></Button>
                    </div>
                {/each}
                <label for="upload-file" class="flex items-center bg-transparent hover:bg-gray-100 justify-center py-2 px-4 text-sm w-fit transition-colors text-gray-700 border rounded-lg [&_svg]:size-5 cursor-pointer gap-2">
                    <Upload/> Upload
                </label>
                <Input
                    accept="
                        application/pdf,
                        application/msword,
                        application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                        application/vnd.ms-excel,
                        application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                        application/vnd.ms-powerpoint,
                        application/vnd.openxmlformats-officedocument.presentationml.presentation,
                        text/csv,
                        image/jpeg,
                        image/jpg,
                        image/png,
                        text/plain,
                        application/zip,
                        application/x-rar-compressed,
                        application/x-7z-compressed
                    "
                    oninput={e => {
                        const files = Array.from(e.currentTarget.files ?? []);

                        if (uploadedFiles.length + files.length > 3) {
                            toast.error(`Maksimal 3 file yang dapat diupload`);
                            e.currentTarget.value = '';
                            return;
                        }

                        for (let i = 0; i < files.length; i++) {
                            if (files[i].size > 10 * 1024 * 1024) {
                                toast.error(`File ${files[i].name} melebihi batas ukuran maksimal 10 MB`);
                                e.currentTarget.value = '';
                                return;
                            }

                            if (uploadedFiles.some(f => f.name === files[i].name)) {
                                toast.error(`File ${files[i].name} sudah ada dalam daftar`);
                                e.currentTarget.value = '';
                                return;
                            }
                        }

                        uploadedFiles = [...uploadedFiles, ...Array.from(e.currentTarget.files ?? [])];
                    }} 
                    type="file" multiple class="hidden" id="upload-file" />
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