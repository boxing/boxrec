import {BoxrecPageProfileBout} from "./boxrec.page.profile.bout";
import {WinLossDraw} from "./boxrec.constants";

const fs = require("fs");
const mockBoutGGGCanelo = fs.readFileSync("./src/boxrec-pages/mocks/mockBoutCaneloGGG.html", "utf8");
const mockBoutGGGCaneloAdditionalData = fs.readFileSync("./src/boxrec-pages/mocks/mockBoutCaneloGGGAdditionalData.html", "utf8");

describe("class BoxrecPageProfileBout", () => {

    let bout: BoxrecPageProfileBout;

    beforeAll(() => {
        bout = new BoxrecPageProfileBout(mockBoutGGGCanelo);
    });

    describe("getter date", () => {

        it("should return the date", () => {
            expect(bout.date).toBe("2017-09-16");
        });

    });

    describe("getter primaryBoxerWeight", () => {

        it("should return the boxer's weight", () => {
            expect(bout.firstBoxerWeight).toBe(160);
        });

        it("should return null if empty", () => {
            const bout = new BoxrecPageProfileBout(mockBoutGGGCanelo.replace(/160/g, ""));
            expect(bout.firstBoxerWeight).toBeNull();
        });

        it("should be able to properly parse fractional weight", () => {
            let bout = new BoxrecPageProfileBout(mockBoutGGGCanelo.replace(/160/g, "160&#189;"));
            expect(bout.firstBoxerWeight).toBe(160.5);

            bout = new BoxrecPageProfileBout(mockBoutGGGCanelo.replace(/160/g, "160&#188;"));
            expect(bout.firstBoxerWeight).toBe(160.25);

            bout = new BoxrecPageProfileBout(mockBoutGGGCanelo.replace(/160/g, "160&#190;"));
            expect(bout.firstBoxerWeight).toBe(160.75);
        })

    });

    describe("getter referee", () => {

        it("should return the referee object with id", () => {
            const bout = new BoxrecPageProfileBout(mockBoutGGGCanelo, mockBoutGGGCaneloAdditionalData);
            expect(bout.referee.id).toBe(400853);
        });

        it("should return the referee object with name", () => {
            const bout = new BoxrecPageProfileBout(mockBoutGGGCanelo, mockBoutGGGCaneloAdditionalData);
            expect(bout.referee.name).toBe("Kenny Bayless");
        });

        it("should return null values if it cannot find it", () => {
            const bout = new BoxrecPageProfileBout(mockBoutGGGCanelo, mockBoutGGGCaneloAdditionalData.replace("referee/400853", ""));
            expect(bout.referee.id).toBeNull();
            expect(bout.referee.name).toBeNull();
        });

    });

    describe("getter judges", () => {

        describe("where 3 judges given", () => {

            it("should include an array", () => {
                const bout = new BoxrecPageProfileBout(mockBoutGGGCanelo, mockBoutGGGCaneloAdditionalData);
                expect(bout.judges.length).toBe(3);
            });

            it("should include the id of the judges", () => {
                const bout = new BoxrecPageProfileBout(mockBoutGGGCanelo, mockBoutGGGCaneloAdditionalData);
                expect(bout.judges[0].id).toBe(401967);
            });

            it("should include the name of the judges", () => {
                const bout = new BoxrecPageProfileBout(mockBoutGGGCanelo, mockBoutGGGCaneloAdditionalData);
                expect(bout.judges[0].name).toBe("Adalaide Byrd");
            });

            it("should include the scorecard of the judges", () => {
                const bout = new BoxrecPageProfileBout(mockBoutGGGCanelo, mockBoutGGGCaneloAdditionalData);
                expect(bout.judges[0].scorecard).toEqual([110, 118]);
            });

        });

        it("if no scorecards are given, an empty array should be given for the scorecard value", () => {
            const bout = new BoxrecPageProfileBout(mockBoutGGGCanelo, mockBoutGGGCaneloAdditionalData.replace(/\d{1,3}-\d{1,3}\s|/g, ""));
            expect(bout.judges[0].scorecard).toEqual([]);
        });

        describe("where less than 3 judge are given", () => {

            it("should include a smaller array if not all 3 judges are included", () => {
                const bout = new BoxrecPageProfileBout(mockBoutGGGCanelo, mockBoutGGGCaneloAdditionalData.replace("/judge/402265", ""));
                expect(bout.judges.length).toBe(2);
            });

        });

    });

    describe("getter opponent", () => {

        it("should include the name of the boxer", () => {
            expect(bout.opponent.name).toBe("Saul Alvarez");
        });

        it("should have an id to the other boxer's profile", () => {
            expect(bout.opponent.id).toBe(348759);
        });

        // this is assuming that all boxers in boxrec are given a profile/link
        it("should return null if could not find the link to the boxer", () => {
            const caneloString: string = `<a href="/en/boxer/348759" class="personLink">Saul Alvarez</a>`;
            const bout = new BoxrecPageProfileBout(mockBoutGGGCanelo.replace(caneloString, ""));
            expect(bout.opponent.id).toBeNull();
        });

        it("should return null if it could not find a numeric id for the opponent", () => {
            const bout = new BoxrecPageProfileBout(mockBoutGGGCanelo.replace(/348759/g, "CANELO"));
            expect(bout.opponent.id).toBeNull();
        });

    });

    describe("getter secondBoxerWeight", () => {

        it("should return the boxer's weight", () => {
            expect(bout.secondBoxerWeight).toBe(160);
        });

        it("should return null if empty", () => {
            const bout = new BoxrecPageProfileBout(mockBoutGGGCanelo.replace(/160/g, ""));
            expect(bout.secondBoxerWeight).toBeNull();
        });

        it("should be able to properly parse fractional weight", () => {
            let bout = new BoxrecPageProfileBout(mockBoutGGGCanelo.replace(/160/g, "160&#189;"));
            expect(bout.secondBoxerWeight).toBe(160.5);

            bout = new BoxrecPageProfileBout(mockBoutGGGCanelo.replace(/160/g, "160&#188;"));
            expect(bout.secondBoxerWeight).toBe(160.25);

            bout = new BoxrecPageProfileBout(mockBoutGGGCanelo.replace(/160/g, "160&#190;"));
            expect(bout.secondBoxerWeight).toBe(160.75);
        });

    });

    describe("getter titles", () => {

        it("should return the id of the titles", () => {
            const bout = new BoxrecPageProfileBout(mockBoutGGGCanelo, mockBoutGGGCaneloAdditionalData);
            expect(bout.titles[0].id).toBe("75/Middleweight");
        });

        it("should return the name of the title", () => {
            const bout = new BoxrecPageProfileBout(mockBoutGGGCanelo, mockBoutGGGCaneloAdditionalData);
            expect(bout.titles[0].name).toBe("International Boxing Federation World Middleweight Title");
        });

        it("should return an empty array if no titles were on the line", () => {
            const bout = new BoxrecPageProfileBout(mockBoutGGGCanelo);
            expect(bout.titles.length).toBe(0);
        });

    });

    describe("getter opponentLast6", () => {

        const str: string = `<div class="last6 bgW"></div>`;

        const changeLast6 = (html: string, outcome: string) => html.replace(str, `<div class="last6 bg${outcome}"></div>`);

        it("should include the stats for the other boxer's last 6 bouts", () => {
            expect(bout.opponentLast6).toEqual(Array(6).fill(WinLossDraw.win));
        });

        it("should return a loss if the boxer has had one", () => {
            const bout = new BoxrecPageProfileBout(changeLast6(mockBoutGGGCanelo, "L"));
            expect(bout.opponentLast6[0]).toBe(WinLossDraw.loss);
        });

        it("should return a draw if the boxer has had one", () => {
            const bout = new BoxrecPageProfileBout(changeLast6(mockBoutGGGCanelo, "D"));
            expect(bout.opponentLast6[0]).toBe(WinLossDraw.draw);
        });

        it("should return unknown if we can't figure out the outcome of this bout", () => {
            const bout = new BoxrecPageProfileBout(changeLast6(mockBoutGGGCanelo, "Z"));
            expect(bout.opponentLast6[0]).toBe(WinLossDraw.unknown);
        });

        it("should return a smaller array if the boxer hasn't had 6 fights", () => {
            const html: string = mockBoutGGGCanelo.replace(str, "");
            const bout = new BoxrecPageProfileBout(html);
            expect(bout.opponentLast6.length).toBe(5);
        });

    });

    describe("getter opponentRecord", () => {

        it("should include the wins of the other boxer", () => {
            expect(bout.opponentRecord.win).toBe(49);
        });

        it("should include the losses of the other boxer", () => {
            expect(bout.opponentRecord.loss).toBe(1);
        });

        it("should include the draws of the other boxer", () => {
            expect(bout.opponentRecord.draw).toBe(1);
        });

    });

    describe("getter location", () => {

        describe("venue", () => {

            const venueName: string = "T-Mobile Arena";

            it("should include the venue name", () => {
                expect(bout.location.venue.name).toBe("T-Mobile Arena");
            });

            it("should return null if cannot find the venue name", () => {
                const bout = new BoxrecPageProfileBout(mockBoutGGGCanelo.replace(venueName, ""));
                expect(bout.location.venue.name).toBeNull();
            });

            it("should include the id of the venue", () => {
                expect(bout.location.venue.id).toBe(246559);
            });

            it("should return null if cannot find the venue id", () => {
                const bout = new BoxrecPageProfileBout(mockBoutGGGCanelo.replace(246559, ""));
                expect(bout.location.venue.id).toBeNull();
            });

        });

        describe("location", () => {

            it("should include the region where the bout took place", () => {
                expect(bout.location.location.region).toBe("NV");
            });

            it("should include the city where the bout took place", () => {
                expect(bout.location.location.town).toBe("Las Vegas");
            });

            it("should include the country where the bout took place", () => {
                expect(bout.location.location.country).toBe("US");
            });

            it("should return null for city if cannot find it", () => {
                const bout = new BoxrecPageProfileBout(mockBoutGGGCanelo.replace("Las", "").replace("Vegas", ""));
                expect(bout.location.location.town).toBeNull();
            });

            it("should return null for region, id, country if could not parse link", () => {
                const locationString: string = "/locations/event?country=US&region=NV&town=20388";
                const bout = new BoxrecPageProfileBout(mockBoutGGGCanelo.replace(locationString, ""));
                expect(bout.location.location.id).toBeNull();
                expect(bout.location.location.region).toBeNull();
                expect(bout.location.location.country).toBeNull();
            });

        });

    });

    describe("getter numberOfRounds", () => {

        it("should return an array of length 2 if the fight has finished", () => {
            expect(bout.numberOfRounds[0]).toBe(12);
            expect(bout.numberOfRounds[1]).toBe(12);
        });

        it("should return an array of length 2 if the fight is scheduled but has not taken place", () => {
            const bout = new BoxrecPageProfileBout(mockBoutGGGCanelo.replace(/12\/12/g, "12"));
            expect(bout.numberOfRounds[0]).toBeNull();
            expect(bout.numberOfRounds[1]).toBe(12);
        });

        it("should return null values if cannot parse", () => {
            const bout = new BoxrecPageProfileBout(mockBoutGGGCanelo.replace(/12\/12/g, ""));
            expect(bout.numberOfRounds[0]).toBeNull();
            expect(bout.numberOfRounds[1]).toBeNull();
        });

    });

    describe("getter outcome", () => {

        const changeOutcome = (html: string, outcome: string) => {
            const match: string = `bgD" style="float:left;width:25px;">D`;
            const replace: string = `bg${outcome}" style="float:left;width:25px;">${outcome}`;
            return html.replace(match, replace);
        };

        it("should return `win` for a win", () => {
            const bout = new BoxrecPageProfileBout(changeOutcome(mockBoutGGGCanelo, "W"));
            expect(bout.outcome).toBe(WinLossDraw.win);
        });

        it("should return `loss` for a loss", () => {
            const bout = new BoxrecPageProfileBout(changeOutcome(mockBoutGGGCanelo, "L"));
            expect(bout.outcome).toBe(WinLossDraw.loss);
        });

        it("should return `draw` for a draw", () => {
            const bout = new BoxrecPageProfileBout(changeOutcome(mockBoutGGGCanelo, "D"));
            expect(bout.outcome).toBe(WinLossDraw.draw);
        });

        it("should return `scheduled` if the fight is scheduled", () => {
            const bout = new BoxrecPageProfileBout(changeOutcome(mockBoutGGGCanelo, "S"));
            expect(bout.outcome).toBe(WinLossDraw.scheduled);
        });

        it("should return `unknown` if we don't know what the status is", () => {
            const bout = new BoxrecPageProfileBout(changeOutcome(mockBoutGGGCanelo, "Z"));
            expect(bout.outcome).toBe(WinLossDraw.unknown);
        });

    });

    describe("getter result", () => {

        it("should include the outcome of the bout", () => {
            expect(bout.result[0]).toBe("draw");
        });

        it("should include how the bout ended", () => {
            expect(bout.result[1]).toBe("SD");
        });

        it("should include how the bout ended - full text", () => {
            expect(bout.result[2]).toBe("split decision");
        });

    });

    describe("getter rating", () => {

        it("should include the boxrec rating of the bout", () => {
            expect(bout.rating).toBe(100);
        });

        it("should return null if class selector does not exist", () => {
            const bout = new BoxrecPageProfileBout(mockBoutGGGCanelo.replace("starRating", "blah"));
            expect(bout.rating).toBeNull();
        });

        it("should return null if the width doesn't make match our regex", () => {
            const bout = new BoxrecPageProfileBout(mockBoutGGGCanelo.replace(/width:\s100%;/g, "blah"));
            expect(bout.rating).toBeNull();
        });

    });

    describe("getter links", () => {

        it("should return links in an object", () => {
            expect(bout.links.show).toBe(751017);
            expect(bout.links.bout).toBe(2160855);
            expect(bout.links.bio_open).toBe(2160855);
        });

        it("should push any other links that don't end with numbers", () => {
            const bout = new BoxrecPageProfileBout(mockBoutGGGCanelo.replace(/\/en\/event\/751017/g, "/en/event/BLA"));
            expect(bout.links.other[0]).toBe("/en/event/BLA");
        });

    });

});
