import {BoxrecPageProfileEvents} from "./boxrec.page.profile.events";
import {BoxrecProfileTable} from "./boxrec.profile.constants";

export class BoxrecPageProfilePromoter extends BoxrecPageProfileEvents {

    // found on promoter page
    get company(): string | null {
        const company: string | void = this.parseProfileTableData(BoxrecProfileTable.company);

        if (company) {
            return company;
        }

        return null;
    }

}