import {OutputGetter, OutputInterface} from "../../decorators/output.decorator";
import {getHeaderColumnText} from "../../helpers";
import {BoxrecPageProfile} from "./boxrec.page.profile";
import {BoxrecProfileManagerOutput} from "./boxrec.page.profile.constants";
import {BoxrecPageProfileManagerBoxerRow} from "./boxrec.page.profile.manager.boxer.row";

@OutputGetter(["birthName", "birthPlace", "boxers", "globalId", "name", "otherInfo", "picture",
    "residence", "role", "status",
])
export class BoxrecPageProfileManager extends BoxrecPageProfile implements OutputInterface {

    output: BoxrecProfileManagerOutput;

    get boxers(): BoxrecPageProfileManagerBoxerRow[] {
        const headerColumns: string[] = getHeaderColumnText(this.$(".dataTable"));

        return this.$(".dataTable tbody tr")
            .map((i: number, elem: CheerioElement) => this.$(elem).html())
            .get()
            .map(item => new BoxrecPageProfileManagerBoxerRow(headerColumns, item));
    }

}
