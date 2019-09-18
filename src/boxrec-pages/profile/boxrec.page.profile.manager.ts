import {BoxrecPageProfile} from "./boxrec.page.profile";
import {BoxrecProfileManagerOutput} from "./boxrec.page.profile.constants";
import {BoxrecPageProfileManagerBoxerRow} from "./boxrec.page.profile.manager.boxer.row";

export class BoxrecPageProfileManager extends BoxrecPageProfile {

    get boxers(): BoxrecPageProfileManagerBoxerRow[] {
        return this.$(".dataTable tbody tr")
            .map((i: number, elem: CheerioElement) => this.$(elem).html())
            .get()
            .map(item => new BoxrecPageProfileManagerBoxerRow(item));
    }

    get output(): BoxrecProfileManagerOutput {
        return {
            birthName: this.birthName,
            birthPlace: this.birthPlace,
            boxers: this.boxers,
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
