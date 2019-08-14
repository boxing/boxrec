export function applyMixins(derivedCtor: any, baseCtors: any[]): void {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            Object.defineProperty(derivedCtor.prototype, name,
                (Object as any).getOwnPropertyDescriptor(baseCtor.prototype, name));
        });
    });
}
