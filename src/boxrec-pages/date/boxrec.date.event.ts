import {BoxrecRole} from "boxrec-requests";
import {BoxrecEvent} from "../event/boxrec.event";

/**
 * Used by the BoxRec Date page for event information
 */
export class BoxrecDateEvent extends BoxrecEvent {

    get id(): number {
        return parseInt(this.parseId(), 10);
    }

    protected parseLocation(): string {
        return this.$(".flag").parent().html() as string;
    }

    /**
     * Returns string format of matchmaker to be parsed by parent class
     * @returns {string}
     */
    protected parseMatchmakers(): string {
        return this.parseEventData(BoxrecRole.matchmaker);
    }

    /**
     * Returns string format of promoters to be parsed by parent class
     * @returns {string}
     */
    protected parsePromoters(): string {
        return this.parseEventData(BoxrecRole.promoter);
    }

    private parseId(): string {
        const wikiHref: string | null = this.$("h2").next().find(".eventP").parent().attr("href");
        if (wikiHref) {
            const wikiLink: RegExpMatchArray | null = wikiHref.match(/(\d+)$/);
            if (wikiLink && wikiLink[1]) {
                return wikiLink[1];
            }
        }

        throw new Error("Could not find Event ID");
    }

}
