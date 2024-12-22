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
	}

    interface User {
        id: number;
        nama: string;
        role: "Admin" | "Guru" | "Siswa" | "Tata Usaha";
    }
}

export {};
