import {BoxrecPageRatingsHelpersRow} from "./boxrec.page.ratings.helpers.row";
import {BoxrecPageRatingsRow} from "./boxrec.page.ratings.row";
import {BoxrecPageRatingsActiveDivisionRowOutput} from "./boxrec.ratings.constants";

// ratings page where both active boxers are selected and specific division
export class BoxrecPageRatingsActiveDivisionRow extends BoxrecPageRatingsRow {

    protected readonly columns: string[] = [
        "id",
        "name",
        "points",
        "rating",
        "age",
        "record",
        "last 6",
        "stance",
        "residence",
    ];

    get age(): number {
        return BoxrecPageRatingsHelpersRow.getAge(this.$, this.getColumnByType("age"));
    }

    get output(): BoxrecPageRatingsActiveDivisionRowOutput {
        return {
            age: this.age,
            hasBoutScheduled: this.hasBoutScheduled,
            id: this.id,
            last6: this.last6,
            name: this.name,
            points: this.points,
            rating: this.rating,
            record: this.record,
            residence: this.residence,
            stance: this.stance,
        };
    }

    /**
     * Rating of the boxer between 0 and 100
     */
    get rating(): number | null {
        return BoxrecPageRatingsHelpersRow.getRating(this.$, this.getColumnByType("rating"));
    }

}
