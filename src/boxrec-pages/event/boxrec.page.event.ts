import {BoxrecRole} from "boxrec-requests/dist/boxrec-requests.constants";
import {BoxrecCommonTablesColumnsClass} from "../../boxrec-common-tables/boxrec-common-tables-columns.class";
import {OutputGetter, OutputInterface} from "../../decorators/output.decorator";
import {trimRemoveLineBreaks} from "../../helpers";
import {BoxrecBasic, BoxrecBoutLocation} from "../boxrec.constants";
import {BoxrecEvent} from "./boxrec.event";
import {BoxrecEventOutput} from "./boxrec.event.constants";
import {emptyLocationObject} from "./boxrec.event.helpers";
import {BoxrecPageEventBoutRow} from "./boxrec.page.event.bout.row";

/**
 * Parse an Event page
 */
@OutputGetter([
    {
        function: (bouts: BoxrecPageEventBoutRow[]) => bouts.map(bout => bout.output),
        method: "bouts",
    },
    "commission", "date", "doctors", "id",
    "inspector", "location", "matchmakers", "media",
    "numberOfBouts", "promoters", "television"])
export class BoxrecPageEvent extends BoxrecEvent implements OutputInterface {

    output: BoxrecEventOutput;

    get commission(): string | null {
        const commission: string = this.parseEventData("commission");
        if (commission) {
            return commission.trim();
        }

        return null;
    }

    get date(): string | null {
        const date: string | null = this.parseDate();

        if (date) {
            return trimRemoveLineBreaks(date);
        }

        return date;
    }

    /**
     * The list is not sorted and therefore the order can change.  Up to the developer how they want to sort
     */
    get doctors(): BoxrecBasic[] {
        return this.$(`<div>${this.parseEventData(BoxrecRole.doctor)}</div>`)
            .find("a")
            .map((i: number, elem: CheerioElement) => this.$.html(elem))
            .get()
            .map(item => BoxrecCommonTablesColumnsClass.parseNameAndId(item));
    }

    get id(): number | null {
        // attempts to parse the link information
        const getLink: (href: string | null) => number | null = (href: string | null): number | null => {
            if (href) {
                const wikiLink: RegExpMatchArray | null = href.match(/(\d+)$/);
                if (wikiLink && wikiLink[1]) {
                    return parseInt(wikiLink[1], 10);
                }
            }

            return null;
        };

        const parent: Cheerio = this.$(this.parseEventResults()).find("h2").next();
        let wikiHref: string | null = parent.find(".bio_closedP").parent().attr("href");
        if (wikiHref) {
            return getLink(wikiHref);
        }

        wikiHref = parent.find(".bio_openP").parent().attr("href");
        return getLink(wikiHref);
    }

    get inspector(): BoxrecBasic {
        const html: Cheerio = this.$(`<div>${this.parseEventData(BoxrecRole.inspector)}</div>`);
        let inspector: BoxrecBasic = {
            id: null,
            name: null,
        };

        html.find("a").each((i: number, elem: CheerioElement) => {
            inspector = BoxrecCommonTablesColumnsClass.parseNameAndId(this.$(elem).text());
        });

        return inspector;
    }

    get location(): BoxrecBoutLocation {
        const locationObject: BoxrecBoutLocation = Object.assign({}, emptyLocationObject);
        let location: string | null = this.$(this.parseEventResults()).find("thead table > tbody tr:nth-child(2) b").html();

        if (location === null) {
            // this should be for bouts page
            // todo this is because one is for events, one if for bouts.  It's not the best approach and should be refactored
            const locationClone: Cheerio = this.$(".page a[href*='/locations/event']").parents("div").clone();
            locationClone.remove("h2");
            locationClone.find("a[href*='venue']").remove();
            location = locationClone.html();
        }

        if (location !== null) {
            const html: Cheerio = this.$(`<div>${trimRemoveLineBreaks(location)}</div>`);
            const links: Cheerio = html.find("a");

            locationObject.venue = BoxrecPageEvent.getVenueInformation(links);
            locationObject.location = BoxrecPageEvent.getLocationInformation(links);
        }

        return locationObject;
    }

    /**
     * Returns string format of matchmaker to be parsed by parent class
     * @returns {string}
     */
    protected parseMatchmakers(): string {
        return this.parseEventData(BoxrecRole.matchmaker);
    }

    /**
     * Was previously `television` but now is media
     * returns the same content as `television`
     */
    get media(): string[] {
        return this.television;
    }

    /**
     * @deprecated  should use `media` now
     */
    get television(): string[] {
        const television: string = this.parseEventData("media");

        if (television) {
            return television.split(",").map(item => {
                const text: string = this.$(`<span>${item}</span>`).text();
                return trimRemoveLineBreaks(text);
            });
        }

        return [];
    }

    protected parsePromoters(): string {
        return this.parseEventData(BoxrecRole.promoter);
    }

    private parseDate(): string | null {
        const eventResults: Cheerio = this.parseEventResults();
        const date: string = this.$(eventResults).find("h2").text(); // ex. Saturday 5, May 2018
        // if date hasn't been set, this will be an empty string, leave as null
        if (date) {
            return new Date(date).toISOString().slice(0, 10);
        }

        return null;
    }

    private parseEventResults(): Cheerio {
        return this.$("table");
    }

}
