import {OutputGetter, OutputInterface} from "../../decorators/output.decorator";
import {BoxrecProfilePromoterOutput} from "./boxrec.page.profile.constants";
import {BoxrecPageProfileEvents} from "./boxrec.page.profile.events";
import {BoxrecProfileTable} from "./boxrec.profile.constants";

@OutputGetter(["birthName", "birthPlace", "company", "events", "globalId", "name",
    "otherInfo", "picture", "residence", "role", "status"])
export class BoxrecPageProfilePromoter extends BoxrecPageProfileEvents implements OutputInterface {

    output: BoxrecProfilePromoterOutput;

    // found on promoter page
    get company(): string | null {
        const company: string | void = this.parseProfileTableData(BoxrecProfileTable.company);

        if (company) {
            return company;
        }

        return null;
    }

}
