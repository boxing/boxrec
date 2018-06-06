import {BoxrecPageProfile} from "./boxrec.page.profile";
import {boxRecMocksModulePath, WinLossDraw} from "../boxrec.constants";
import * as fs from "fs";
import {BoxrecPageProfileBout} from "./boxrec.page.profile.bout.row";

const mockProfileRJJ: string = fs.readFileSync(`${boxRecMocksModulePath}/profile/mockProfileRJJ.html`, "utf8");
const mockProfileGGG: string = fs.readFileSync(`${boxRecMocksModulePath}/profile/mockProfileGGG.html`, "utf8");

describe("class BoxrecPageProfile", () => {

    let boxerRJJ: BoxrecPageProfile;
    let boxerGGG: BoxrecPageProfile;

    beforeAll(() => {
        boxerRJJ = new BoxrecPageProfile(mockProfileRJJ);
        boxerGGG = new BoxrecPageProfile(mockProfileGGG);
    });

    describe("getter name", () => {

        it("should return the name", () => {
            expect(boxerRJJ.name).toBe("Roy Jones Jr");
        });

    });

    describe("getter globalId", () => {

        it("should return the boxer globalId", () => {
            expect(boxerRJJ.globalId).toBe(774820);
        });

    });

    describe("getter bouts", () => {

        it("should return the number of bouts this boxer has been in, not including scheduled bouts", () => {
            expect(boxerRJJ.numberOfBouts).toBeGreaterThanOrEqual(75);
        });

    });

    describe("getter role", () => {

        it("should return a string of the person's roles", () => {
            expect(boxerRJJ.role).toBe("boxer promoter");
        });

    });

    describe("getter rounds", () => {

        it("should return the number of professionally fought rounds this boxer has been in", () => {
            expect(boxerRJJ.rounds).toBeGreaterThanOrEqual(495);
        });

    });

    describe("getter KOs", () => {

        it("should return the number of KOs/TKOs this boxer has dealt out", () => {
            expect(boxerRJJ.KOs).toBeGreaterThanOrEqual(63);
        });

    });

    describe("getter status", () => {

        it("should return the status of the person", () => {
            expect(boxerRJJ.status).toBe("inactive");
        });

    });

    describe("getter birthName", () => {

        it("should return the birth name of the person", () => {
            expect(boxerRJJ.birthName).toBe("Roy Levesta Jones");
        });

    });

    describe("getter alias", () => {

        it("should give the nickname or alias of the boxer", () => {
            expect(boxerRJJ.alias).toBe("Junior");
        });

    });

    describe("getter born", () => {

        it("should return the date this person was born", () => {
            expect(boxerRJJ.born).toBe("1969-01-16");
        });

    });

    describe("getter nationality", () => {

        it("should return the nationality of this person", () => {
            expect(boxerRJJ.nationality).toBe("USA");
        });

    });

    describe("getter debut", () => {

        it("should return the date of this person's debut into the sport of boxing", () => {
            expect(boxerRJJ.debut).toBe("1989-05-06");
        });

    });

    describe("getter division", () => {

        it("should return the division the last division this boxer fought in", () => {
            expect(boxerRJJ.division).toBe("light heavyweight");
        });

    });

    describe("getter height", () => {

        it("should return the height of the boxer", () => {
            expect(boxerRJJ.height).toEqual([5, 11, 180]);
        });

        it("should convert any heights with fractional numbers into decimals", () => {
            expect(boxerGGG.height).toEqual([5, 10.5, 179]);
        });

    });

    describe("getter reach", () => {

        it("should return the reach of the boxer", () => {
            expect(boxerRJJ.reach).toEqual([74, 188]);
        });

    });

    describe("getter residence", () => {

        it("should return the current residence of the person", () => {
            expect(boxerRJJ.residence).toBe("Pensacola, Florida, USA");
        });

    });

    // todo need to make this not change, GGG will retire some day and the rating will disappear I believe
    describe("getter rating", () => {

        it("should return a number", () => {
            expect(boxerGGG.rating).toEqual(jasmine.any(Number));
        });

    });

    describe("getter ranking", () => {

        it("should return the boxer's ranking", () => {
            expect(boxerGGG.ranking).toEqual([
                [jasmine.any(Number), jasmine.any(Number)],
                [jasmine.any(Number), jasmine.any(Number)],
            ]);
        });

        it("should return null if the boxer is not ranked", () => {
            expect(boxerRJJ.ranking).toBeNull();
        });

    });

    describe("getter vadacbp", () => {

        it("should return if they are enrolled in VADA or not", () => {
            expect(boxerGGG.vadacbp).toBe("enrolled"); // todo this will change eventually
        });

    });

    describe("getter titlesHeld", () => {

        it("should return the currently held titles", () => {
            expect(boxerGGG.titlesHeld).toEqual(jasmine.any(Array));
        });

    });

    describe("getter birthPlace", () => {

        it("should return the birth place of the person", () => {
            expect(boxerRJJ.birthPlace).toBe("Pensacola, Florida, USA");
        });

    });

    describe("getter stance", () => {

        it("should return the stance", () => {
            expect(boxerGGG.stance).toBe("orthodox");
        });

    });

    describe("getter bouts", () => {

        let bout: BoxrecPageProfileBout;

        beforeAll(() => {
            bout = boxerGGG.bouts[37];
        });

        it("should return the date if it is know", () => {
            expect(bout.date).toBe("2017-09-16");
        });

        it("should return the first boxer's weight", () => {
            expect(bout.firstBoxerWeight).toBe(160);
        });

        it("should return an array of bouts", () => {
            expect(bout.secondBoxer.name).toBe("Saul Alvarez");
        });

        it("should return the second boxer's weight", () => {
            expect(bout.secondBoxerWeight).toBe(160);
        });

        it("should return the second boxer's record at that time", () => {
            expect(bout.secondBoxerRecord.win).toBe(49);
        });

        it("should return the second boxer's last 6", () => {
            expect(bout.secondBoxerLast6).toEqual([WinLossDraw.win, WinLossDraw.win, WinLossDraw.win, WinLossDraw.win, WinLossDraw.win, WinLossDraw.win]);
        });

        it("should have an equal length or greater of bouts/scheduled bouts compared against bouts they've completed", () => {
            expect(boxerGGG.bouts.length).toBeGreaterThanOrEqual(boxerGGG.numberOfBouts);
        });

        it("should give the venue information", () => {
            expect(bout.location.venue).toBe("T-Mobile Arena");
        });

        it("should return links in an array", () => {
            expect(bout.links).toEqual({
                "bio_open": 2160855,
                "bout": 2160855,
                "event": 751017,
                "other": [],
            });
        });

        it("should return the event id", () => {
            expect(bout.links.event).toBe(751017);
        });

        it("should list the judges", () => {
            expect(bout.judges[0].name).toBe("Adalaide Byrd");
        });

        it("should list the referee", () => {
            expect(bout.referee.name).toBe("Kenny Bayless");
        });

        it("should return the number of rounds the bout was", () => {
            expect(bout.numberOfRounds).toEqual([12, 12]);
        });

        it("should return the outcome of the bout", () => {
            expect(bout.outcome).toEqual(WinLossDraw.draw);
        });

        it("should return how the bout ended", () => {
            expect(bout.result).toEqual(["draw", "SD", "split decision"]);
        });

        it("should return what titles were on the line", () => {
            expect(bout.titles).toEqual([{
                "id": "75/Middleweight",
                "name": "International Boxing Federation World Middleweight Title"
            }, {
                "id": "189/Middleweight",
                "name": "International Boxing Organization World Middleweight Title"
            }, {
                "id": "43/Middleweight",
                "name": "World Boxing Association Super World Middleweight Title"
            }, {"id": "6/Middleweight", "name": "World Boxing Council World Middleweight Title"}]);
        });

    });

    describe("getter otherInfo", () => {

        it("should return an array", () => {
            expect(boxerGGG.otherInfo.length).toEqual(jasmine.any(Number));
        });

    });

    describe("getter hasBoutScheduled", () => {

        it("should return true/false if the fighter has a fight scheduled", () => {
            expect(boxerGGG.hasBoutScheduled).toEqual(jasmine.any(Boolean));
        });

    });

});

