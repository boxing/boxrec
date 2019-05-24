import * as cheerio from "cheerio";
import {BoxrecPageLists} from "../../boxrec-common-tables/boxrec-page-lists";
import {trimRemoveLineBreaks} from "../../helpers";
import {BoxrecPageRatingsActiveAllDivisionsRow} from "./boxrec.page.ratings.active-all-divisions.row";
import {BoxrecPageRatingsActiveDivisionRow} from "./boxrec.page.ratings.active-division.row";
import {BoxrecPageRatingsActiveInactiveAllDivisionsRow} from "./boxrec.page.ratings.active-inactive-all-divisions.row";
import {BoxrecPageRatingsActiveInactiveDivisionRow} from "./boxrec.page.ratings.active-inactive-division.row";
import {BoxrecRatingsOutput} from "./boxrec.ratings.constants";

enum BoxrecRatingsType {
    activeAllDivisions,
    activeWeightDivision,
    activeInactiveAllDivisions,
    activeInactiveWeightDivision,
}

/**
 * parse a BoxRec Ratings Page
 * <pre>ex. http://boxrec.com/en/ratings</pre>
 */
export class BoxrecPageRatings extends BoxrecPageLists {

    protected readonly $: CheerioStatic;

    constructor(boxrecBodyString: string) {
        super(boxrecBodyString);
        this.$ = cheerio.load(boxrecBodyString);
    }

    get boxers(): Array<BoxrecPageRatingsActiveDivisionRow | BoxrecPageRatingsActiveInactiveAllDivisionsRow | BoxrecPageRatingsActiveAllDivisionsRow | BoxrecPageRatingsActiveInactiveDivisionRow> {
        return this.parseRatings().map(item => {
            switch (this.getRatingsType()) {
                case BoxrecRatingsType.activeWeightDivision:
                    return new BoxrecPageRatingsActiveDivisionRow(item);
                case BoxrecRatingsType.activeInactiveAllDivisions:
                    return new BoxrecPageRatingsActiveInactiveAllDivisionsRow(item);
                case BoxrecRatingsType.activeAllDivisions:
                    return new BoxrecPageRatingsActiveAllDivisionsRow(item);
                case BoxrecRatingsType.activeInactiveWeightDivision:
                    return new BoxrecPageRatingsActiveInactiveDivisionRow(item);
            }
        });
    }

    get output(): BoxrecRatingsOutput {
        return {
            boxers: this.boxers.map(boxerRow => boxerRow.output),
            numberOfPages: this.numberOfPages,
        };
    }

    private parseRatings(): string[] {
        return this.$("#ratingsResults tbody tr.drawRowBorder")
            .map((i: number, elem: CheerioElement) => this.$(elem).html())
            .get();
    }

    // returns whether these are ratings for just active boxers, the columns are different for active/inactive
    private getRatingsType(): BoxrecRatingsType {
        const numberOfColumns: number = this.$("#ratingsResults tbody tr:nth-child(1) td").length;

        // in order in what I think is probability of being called
        if (numberOfColumns === 8) {
            // this can be `activeWeightDivision` or `activeInactiveAllDivisions`
            const headerText: string = trimRemoveLineBreaks(this.$("#ratingsResults thead th:nth-child(6)").text());
            if (headerText === "career") {
                return BoxrecRatingsType.activeInactiveAllDivisions;
            } else {
                return BoxrecRatingsType.activeWeightDivision;
            }
        } else if (numberOfColumns === 9) {
            return BoxrecRatingsType.activeAllDivisions;
        } else if (numberOfColumns === 7) {
            return BoxrecRatingsType.activeInactiveWeightDivision;
        }

        throw new Error(`Unknown number of columns, has something changed on BoxRec ratings? numberOfColumns: ${numberOfColumns}`);
    }

}
