import * as cheerio from "cheerio";
import {BoxrecPageLists} from "../../boxrec-common-tables/boxrec-page-lists";
import {trimRemoveLineBreaks} from "../../helpers";
import {BoxrecPageRatingsActiveAllDivisionsRow} from "./boxrec.page.ratings.active-all-divisions.row";
import {BoxrecPageRatingsActiveDivisionRow} from "./boxrec.page.ratings.active-division.row";
import {BoxrecPageRatingsActiveInactiveAllDivisionsRow} from "./boxrec.page.ratings.active-inactive-all-divisions.row";
import {BoxrecPageRatingsActiveInactiveDivisionRow} from "./boxrec.page.ratings.active-inactive-division.row";
import {BoxrecRatingsOutput, RatingsColumns} from "./boxrec.ratings.constants";

enum BoxrecRatingsType {
    activeAllDivisions,
    activeWeightDivision,
    activeInactiveAllDivisions,
    activeInactiveWeightDivision,
}

const ratingsTableEl: string = "#ratingsResults";

/**
 * parse a BoxRec Ratings Page
 * <pre>ex. http://boxrec.com/en/ratings</pre>
 */
export class BoxrecPageRatings extends BoxrecPageLists {

    protected readonly $: CheerioStatic;
    private headerColumns: RatingsColumns[] = [];

    constructor(boxrecBodyString: string) {
        super(boxrecBodyString);
        this.$ = cheerio.load(boxrecBodyString);
    }

    get boxers(): Array<BoxrecPageRatingsActiveDivisionRow | BoxrecPageRatingsActiveInactiveAllDivisionsRow |
        BoxrecPageRatingsActiveAllDivisionsRow | BoxrecPageRatingsActiveInactiveDivisionRow> {
        // todo iterates too many times through this, set variable?
        return this.parseRatingsTableContent().map(item => {
            switch (this.getRatingsType()) {
                case BoxrecRatingsType.activeWeightDivision:
                    return new BoxrecPageRatingsActiveDivisionRow(this.parseRatingsTableHeaderText(), item);
                case BoxrecRatingsType.activeInactiveAllDivisions:
                    return new BoxrecPageRatingsActiveInactiveAllDivisionsRow(this.parseRatingsTableHeaderText(), item);
                case BoxrecRatingsType.activeAllDivisions:
                    return new BoxrecPageRatingsActiveAllDivisionsRow(this.parseRatingsTableHeaderText(), item);
                case BoxrecRatingsType.activeInactiveWeightDivision:
                    return new BoxrecPageRatingsActiveInactiveDivisionRow(this.parseRatingsTableHeaderText(), item);
            }
        });
    }

    get output(): BoxrecRatingsOutput {
        return {
            boxers: this.boxers.map(boxerRow => boxerRow.output),
            numberOfPages: this.numberOfPages,
        };
    }

    /**
     * Returns an array of the table header column text
     */
    private parseRatingsTableHeaderText(): RatingsColumns[] {
        if (this.headerColumns.length !== 0) {
            return this.headerColumns;
        } else {
            this.$(ratingsTableEl).find("thead th")
                .each((i: number, elem: CheerioElement) => {
                    let text: string = trimRemoveLineBreaks(this.$(elem).text());

                    // some of the columns do not have table header text
                    // therefore try to figure out what the column is
                    if (text.length === 0) {
                        // get the tbody column element for further analysing
                        const tbodyColumn: Cheerio = this.$(ratingsTableEl)
                            .find(`tbody tr:nth-child(1) td:nth-child(${i + 1})`);

                        // check if rating column
                        if (!!tbodyColumn.find(".starRating").length) {
                            text = "rating";
                        }
                    }

                    this.headerColumns.push(text as RatingsColumns);
                })
                .get();

        }

        return this.headerColumns;
    }

    /**
     * Returns the HTML content of table rows
     */
    private parseRatingsTableContent(): string[] {
        return this.$(ratingsTableEl).find("tbody tr")
            .filter((index: number, tableRow: CheerioElement) => {
                // being safe, we'll return true for anything greater than 6 columns
                // in case the ads rows get additional columns.  Currently the "bad" rows either have 0-1 columns
                return this.$(tableRow).find("td").length > 6;
            }).map((i: number, elem: CheerioElement) => this.$(elem).html())
            .get();
    }

    // returns whether these are ratings for just active boxers, the columns are different for active/inactive
    private getRatingsType(): BoxrecRatingsType {
        const numberOfColumns: number = this.$(ratingsTableEl).find("tbody tr:nth-child(1) td").length;

        // in order in what I think is probability of being called
        if (numberOfColumns === 9) {
            // this can be `activeWeightDivision` or `activeInactiveAllDivisions`
            const headerText: string = trimRemoveLineBreaks(this.$(ratingsTableEl)
                .find("thead th:nth-child(6)").text());
            if (headerText === "career") {
                return BoxrecRatingsType.activeInactiveAllDivisions;
            } else {
                return BoxrecRatingsType.activeWeightDivision;
            }
        } else if (numberOfColumns === 10) {
            return BoxrecRatingsType.activeAllDivisions;
        } else if (numberOfColumns === 8) {
            return BoxrecRatingsType.activeInactiveWeightDivision;
        }

        throw new Error(`Unknown number of columns,
 has something changed on BoxRec ratings? numberOfColumns: ${numberOfColumns}`);
    }

}
