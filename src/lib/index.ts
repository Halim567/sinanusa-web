// place files you want to import through the `$lib` alias in this folder.
export function catchError<T, E extends Error = Error>(fn: () => T): [T, null] | [null, E] {
    try { return [fn(), null] } catch (error) { return [null, error as E] }
}

export async function catchReject<T, E extends Error = Error>(fn: () => Promise<T>): Promise<[T, null] | [null, E]> {
    try { return [await fn(), null] } catch (error) { return [null, error as E] }
}