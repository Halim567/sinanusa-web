<script lang="ts">
    import * as Popover from "$lib/components/ui/popover";
    import { Edit, EllipsisVertical, Trash2 } from "lucide-svelte";
    import * as AlertDialog from "$lib/components/ui/alert-dialog";
    import { Button } from "$lib/components/ui/button";
    import { enhance } from "$app/forms";
    import { toast } from "svelte-sonner";
    import Loading from "$lib/components/ui/loading/loading.svelte";
    import { page } from "$app/state";

    const { nama_penugasan, id, tipe_penugasan }: { nama_penugasan: string, id: number, tipe_penugasan: string } = $props();

    let open = $state(false);
    let loading = $state(false);
</script>

<Popover.Root open={open} onOpenChange={v => open = v}>
    <Popover.Trigger>
        <EllipsisVertical/>
    </Popover.Trigger>
    <Popover.Content class="grid gap-2 justify-start w-fit p-1">
        <Button href="/elearning/{nama_penugasan}/edit?id={page.data.params}&id_penugasan={id}&tipe={tipe_penugasan}" variant="ghost" class="flex items-center justify-start gap-2"><Edit/> Perbaharui</Button>
        <AlertDialog.Root>
            <AlertDialog.Trigger>
                <Button variant="ghost" class="flex items-center justify-start text-red-500 gap-2 w-full"><Trash2/> Hapus</Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content>
                <AlertDialog.Header>
                    <AlertDialog.Title>
                        Apakah Anda yakin ingin menghapus Penugasan ini?
                    </AlertDialog.Title>
                    <AlertDialog.Description>
                        Menghapus penugasan ini akan menghapus semua data yang terkait dengan penugasan ini, termasuk data pengumpulan tugas siswa
                    </AlertDialog.Description>
                </AlertDialog.Header>
                <AlertDialog.Footer>
                    <AlertDialog.Cancel onclick={() => open = false}>
                        Batal
                    </AlertDialog.Cancel>
                        <form action="/elearning/{nama_penugasan}?/hapus-penugasan&id={id}" method="POST" use:enhance={() => {
                            loading = true;

                            return async ({ update, result }) => {
                                if (result.type === "success") {
                                    toast.success("Penugasan berhasil dihapus");
                                } else if (result.type === "error" || result.type === "failure") {
                                    toast.error("Penugasan gagal dihapus");
                                }

                                loading = false;
                                await update();
                            };
                        }}>
                            <Button type="submit" class="bg-red-500 text-white hover:bg-red-700"><Trash2/> Hapus</Button>
                        </form>
                </AlertDialog.Footer>
            </AlertDialog.Content>
        </AlertDialog.Root>
    </Popover.Content>
</Popover.Root>

<AlertDialog.Root open={loading}>
    <AlertDialog.Content class="w-80 rounded-md p-4 lg:w-fit">
        <AlertDialog.Header class="grid place-items-center gap-2">
            <AlertDialog.Title >
                <Loading/>
            </AlertDialog.Title>
            <AlertDialog.Description class="text-start">
                Sedang menghapus penugasan...
            </AlertDialog.Description>
        </AlertDialog.Header>
    </AlertDialog.Content>
</AlertDialog.Root>