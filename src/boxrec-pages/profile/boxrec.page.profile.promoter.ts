import {BoxrecProfilePromoterOutput} from "@boxrec-pages/profile/boxrec.page.profile.constants";
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

    get output(): BoxrecProfilePromoterOutput {
        return {
            birthName: this.birthName,
            birthPlace: this.birthPlace,
            company: this.company,
            events: this.events,
            globalId: this.globalId,
            name: this.name,
            otherInfo: this.otherInfo,
            picture: this.picture,
            residence: this.residence,
            role: this.role,
            status: this.status,
        };
    }
}
