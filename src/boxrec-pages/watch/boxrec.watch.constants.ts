export interface BoxrecWatchOutput {
    list: BoxrecPageWatchRowOutput[];
}

export interface BoxrecPageWatchRowOutput {
    alias: string | null;
    globalId: number;
    name: string;
    schedule: string | null; // date of their next bout
}
