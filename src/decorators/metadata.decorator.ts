export function MetadataGetter():
    (target: any) => void {
    return target => {
        Object.defineProperty(target.prototype, "metadata", {
            get(): string | null {
                return this.$(`tr:nth-child(2) td:nth-child(1)`).html();
            },
        });
    };
}

export interface MetadataInterface {
    readonly metadata: string | null;
}
