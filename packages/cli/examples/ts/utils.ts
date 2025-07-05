export function add(a: number, b: number): number {
    return a + b;
}

export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}