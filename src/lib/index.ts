// place files you want to import through the `$lib` alias in this folder.
export function catchError<T, E extends Error = Error>(fn: () => T): [T, null] | [null, E] {
    try { return [fn(), null] } catch (error) { return [null, error as E] }
}

export async function catchReject<T, E extends Error = Error>(fn: () => Promise<T>): Promise<[T, null] | [null, E]> {
    try { return [await fn(), null] } catch (error) { return [null, error as E] }
}

export const isNumber = (value: unknown): value is number => 
    (typeof value === 'number' && value - value === 0) || 
    (typeof value === 'string' && value.trim() !== '' && Number.isFinite(+value) && +value <= Number.MAX_SAFE_INTEGER && +value >= Number.MIN_SAFE_INTEGER);

/**
 * Parse query URL to object data
 * 
 * If the key is not found in the query URL, the default value will be used
 * 
 * @example
 * ```ts
 * const url = new URLSearchParams('id=1&name=user&active=true');
 * const data = parseQueryURL(url, { id: 0, name: '', active: true });
 * 
 * console.log(data); // { id: 1, name: 'user', active: true }
 * 
 * // If the type of the key is incorrect, the default value will be used. except for the string type and boolean type
 * 
 * const url2 = new URLSearchParams('id=ab&name=user&active=bb');
 * const data2 = parseQueryURL(url2, { id: 0, name: '', active: true });
 * 
 * console.log(data2); // { id: 0, name: 'user', active: false }
 * 
 * ```
 */
export function parseQueryURL<T extends Record<string, string | number | boolean>>(
    queryUrl: URLSearchParams,
    data: T
): T {
    const result = { ...data };
    for (const key in result) {
        const value = queryUrl.get(key);

        if (value === null) continue;

        const typeResult = typeof result[key];
        switch (typeResult) {
            case "string":
                result[key] = value as T[Extract<keyof T, string>];
                break;
            case "number":
                if (isNumber(value)) {
                    result[key] = Number(value) as T[Extract<keyof T, string>];
                }
                break;
            case "boolean":
                result[key] = (value.toLowerCase() === 'true') as T[Extract<keyof T, string>];
                break;
        }
    }

    return result as T;
}
