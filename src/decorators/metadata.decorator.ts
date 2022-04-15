/**
 * Adds a getter to the class that returns the metadata for a table row (usually the row after)
 * @constructor
 */
export function MetadataGetter():
    (target: any) => void {
    return (target: any) => {
        Object.defineProperty(target.prototype, 'metadata', {
            get(): string | null {
                return this.$('tr:nth-child(2) td:nth-child(1)').html();
            },
        });
    };
}

export interface MetadataInterface {
    readonly metadata: string | null;
}
