import {BoxrecBasic} from "../boxrec.constants";
import {BoxrecPageTitleRow} from "./boxrec.page.title.row";

export interface BoxrecTitleOutput {
    bouts: BoxrecPageTitleRow[];
    champion: BoxrecBasic;
    name: string;
    numberOfBouts: number;
}
