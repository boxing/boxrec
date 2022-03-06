import {BoxrecBasic} from "../boxrec-pages/boxrec.constants";

export interface BoxrecTitles {
    id: string;
    name: string;
    supervisor?: BoxrecBasic;
}

// although bio and bout will probably be the same.  The bio lets people know there is a wiki link if it is not null
export interface BoxrecGeneralLinks {
    bio?: number | null;  // this is the wiki link
    bout?: string | null;
    event?: number | null;
    other?: string[];
}
