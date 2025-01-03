<script lang="ts">
    import * as Card from '$lib/components/ui/card';
    import * as AlertDialog from '$lib/components/ui/alert-dialog';
    import { Trash2, TriangleAlert } from 'lucide-svelte';
    import { toast } from 'svelte-sonner';
    import { Button } from '$lib/components/ui/button';
    import Loading from '$lib/components/ui/loading/loading.svelte';
    
    import type { SubmitFunction } from '@sveltejs/kit';
    import { enhance } from '$app/forms';
    import { page } from '$app/state';

    let loading = $state(false);

    const onSubmit: SubmitFunction = () => {
        loading = true;

        return async ({ update, result }) => {
            if (result.type === "redirect") {
                toast.success('Kelas berhasil dihapus');
            } else if (result.type === "failure" || result.type === "error") {
                toast.error('Gagal menghapus kelas');
            }

            loading = false;
            await update();
        };
    };
</script>

<Card.Root>
    <Card.Header>
        <Card.Title class="text-lg">Aksi</Card.Title>
    </Card.Header>
    <Card.Content class="grid gap-4">
        <div class="w-full p-4 border-red-500 border rounded-lg flex items-center justify-between">
            <small class="flex items-center gap-2">
                <TriangleAlert color="red"/>
                <span class="text-red-500">
                    Hapus ruang kelas ini.<br/>
                    Semua data akan dihapus secara permanen.
                </span>
            </small>
            <AlertDialog.Root open={loading ? false : undefined}>
                <AlertDialog.Trigger>
                    <Button class="bg-red-500 hover:bg-red-700"><Trash2/> Hapus Kelas</Button>
                </AlertDialog.Trigger>
                <AlertDialog.Content class="w-80 rounded-md p-4 lg:w-fit">
                    <AlertDialog.Header>
                        <AlertDialog.Title class="flex items-center gap-2">
                            <TriangleAlert color="red"/>
                            <span class="text-red-500">Hapus Kelas</span>
                        </AlertDialog.Title>
                        <AlertDialog.Description class="text-start">
                            Apakah anda yakin ingin menghapus kelas ini? Semua data yang terkait dengan kelas ini akan dihapus secara permanen.
                        </AlertDialog.Description>
                    </AlertDialog.Header>
                    <AlertDialog.Footer>
                        <AlertDialog.Cancel>Batal</AlertDialog.Cancel>
                        <form action="/elearning?/delete-classroom&id={page.data.classroomData.id}" method="POST" use:enhance={onSubmit}>
                            <Button disabled={loading} type="submit" class="bg-red-500 hover:bg-red-700"><Trash2/> Hapus Kelas</Button>
                        </form>
                    </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog.Root>
            <AlertDialog.Root open={loading}>
                <AlertDialog.Content class="w-80 rounded-md p-4 lg:w-fit">
                    <AlertDialog.Header class="grid place-items-center gap-2">
                        <AlertDialog.Title >
                            <Loading/>
                        </AlertDialog.Title>
                        <AlertDialog.Description class="text-start">
                            Sedang menghapus kelas...
                        </AlertDialog.Description>
                    </AlertDialog.Header>
                </AlertDialog.Content>
            </AlertDialog.Root>
        </div>
    </Card.Content>
</Card.Root>
