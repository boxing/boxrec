import {BoxrecBasic} from "@boxrec-constants";
import {BoxrecPageTitleRow} from "@boxrec-pages/title/boxrec.page.title.row";

export interface BoxrecTitleOutput {
    bouts: BoxrecPageTitleRow[];
    champion: BoxrecBasic;
    name: string;
    numberOfBouts: number;
}