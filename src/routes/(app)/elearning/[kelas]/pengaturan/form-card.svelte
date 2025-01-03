<script lang="ts">
    import FormClassroom from '$lib/components/not-reuseable/form-classroom.svelte';
    import * as Card from '$lib/components/ui/card';

    import { page } from '$app/state';
    import { toast } from 'svelte-sonner';
</script>

<Card.Root>
    <Card.Header>
        <Card.Title class="text-lg">Detail Ruang Kelas</Card.Title>
    </Card.Header>
    <Card.Content>
        <FormClassroom 
            data={page.data.form} 
            action="/elearning?/update-classroom&id={page.data.classroomData.id}&url={page.url.pathname}"
            onRedirect={() => toast.success('Kelas berhasil diperbarui')}
        />
    </Card.Content>
</Card.Root>
