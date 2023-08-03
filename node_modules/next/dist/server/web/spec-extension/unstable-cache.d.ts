declare type Callback = (...args: any[]) => Promise<any>;
export declare function unstable_cache(cb: Callback, keyParts: string[], options: {
    revalidate: number | false;
    tags?: string[];
}): Callback;
export {};
