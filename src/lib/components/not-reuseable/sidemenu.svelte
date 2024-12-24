<script lang="ts">
    import { Logo } from "$lib/images";
    import ScrollArea from "../ui/scroll-area/scroll-area.svelte";
    import Separator from "../ui/separator/separator.svelte";
    import * as Sheet from "../ui/sheet";
    import { Book, Gauge, Menu } from "lucide-svelte";

    let open = $state(false);
</script>

<Sheet.Root {open} onOpenChange={e => open = e}>
    <Sheet.Trigger class="px-3 py-2 rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground"><Menu/></Sheet.Trigger>
    <Sheet.Content side="left" class="px-2 flex flex-col gap-4">
        <Sheet.Header>
            <Sheet.Title>
                <div class="flex items-center gap-2">
                    <img src={Logo} alt="Logo" width={50} height={50} />
                    <h1 class="font-bold text-base text-start">SMP Nusa Putra<br />Tangerang</h1>
                </div>
            </Sheet.Title>
        </Sheet.Header>
        <Separator/>
        <ScrollArea>
            <div class="grid gap-3 pl-2">
                <div class="grid gap-2">
                    <h1 class="text-sm text-gray-500">Navigasi Menu</h1>
                    <div class="grid gap-4 pl-3">
                        <a onclick="{() => open = false}" href="/" class="flex items-center gap-2"><Gauge size={20} /> Dashboard</a>
                        <a onclick="{() => open = false}" href="/elearning" class="flex items-center gap-2"><Book size={20} /> Elearning</a>
                    </div>
                </div>
            </div>
        </ScrollArea>
    </Sheet.Content>
</Sheet.Root>