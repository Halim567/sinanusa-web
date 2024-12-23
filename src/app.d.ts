// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
            user: User | null;
        }
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}

        namespace Superforms {
            type Message = {
                success: boolean;
                text: string;
            }
        }
	}

    interface User {
        id: number;
        nama: string;
        role: "Admin" | "Guru" | "Siswa" | "Tata Usaha";
    }
}

export {};
