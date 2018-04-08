import {BoxrecPageProfile as Boxrec} from "./boxrec.page.profile";
import {BoxrecBout, boxRecMocksModulePath} from "../boxrec.constants";

const BoxrecPageProfile = require("./boxrec.page.profile.ts");
const fs = require("fs");
const mockProfileRJJ = fs.readFileSync(`${boxRecMocksModulePath}/profile/mockProfileRJJ.html`, "utf8");
const mockProfileGGG = fs.readFileSync(`${boxRecMocksModulePath}/profile/mockProfileGGG.html`, "utf8");

// todo break into method testing
describe("class BoxrecPageProfile", () => {

    let boxer: Boxrec;

    describe("profile table", () => {

        const prefix: string = "should have the boxer's";

        describe("Roy Jones Jr", () => {

            beforeAll(() => {
                boxer = new BoxrecPageProfile(mockProfileRJJ);
            });

            it(`${prefix} name`, () => expect(boxer.name).toBe("Roy Jones Jr"));

            it(`${prefix} bouts`, () => expect(boxer.numberOfBouts).toBe(75));

            it(`${prefix} globalID`, () => expect(boxer.globalId).toBe(774820));

            it(`${prefix} role`, () => expect(boxer.role).toBe("boxer promoter"));

            it(`${prefix} rounds`, () => expect(boxer.rounds).toBe(495));

            it(`${prefix} KOs`, () => expect(boxer.KOs).toBe(63));

            it(`${prefix} status`, () => expect(boxer.status).toBe("inactive"));

            it(`${prefix} birth name`, () => expect(boxer.birthName).toBe("Roy Levesta Jones"));

            it(`${prefix} alias`, () => expect(boxer.alias).toBe("Junior"));

            it(`${prefix} date of birth`, () => expect(boxer.born).toBe("1969-01-16"));

            it(`${prefix} nationality`, () => expect(boxer.nationality).toBe("USA"));

            it(`${prefix} debut`, () => expect(boxer.debut).toBe("1989-05-06"));

            it(`${prefix} division`, () => expect(boxer.division).toBe("light heavyweight"));

            it(`${prefix} height`, () => expect(boxer.height).toEqual([5, 11, 180]));

            it(`${prefix} reach`, () => expect(boxer.reach).toEqual([74, 188]));

            it(`${prefix} residence`, () => expect(boxer.residence).toBe("Pensacola, Florida, USA"));

            it(`${prefix} birth place`, () => expect(boxer.birthPlace).toBe("Pensacola, Florida, USA"));

            it(`${prefix} suspensions`, () => expect(boxer.suspensions.length).toBe(5));

        });

        describe("Gennady Golovkin", () => {

            beforeAll(() => {
                boxer = new BoxrecPageProfile(mockProfileGGG);
            });

            it(`${prefix} boxrec rating`, () => expect(boxer.rating).toBe(98));

            it(`${prefix} ranking`, () => expect(boxer.ranking).toEqual([
                [2, 1512],
                [1, 9],
            ]));

            it(`${prefix} VADA CBP`, () => expect(boxer.vadacbp).toBe("enrolled"));

            it(`${prefix} titles held`, () => expect(boxer.titlesHeld).toEqual([
                    "International Boxing Organization World Middleweight Title",
                    "World Boxing Association Super World Middleweight Title",
                    "World Boxing Council World Middleweight Title",
                    "International Boxing Federation World Middleweight Title",
                ]
            ));

            it(`${prefix} date of birth`, () => {
                expect(boxer.born).toBe("1982-04-08");
            });

            it(`${prefix} birth name`, () => expect(boxer.birthName).toBe("&#x413;&#x435;&#x43D;&#x43D;&#x430;&#x434;&#x438;&#x439; &#x413;&#x435;&#x43D;&#x43D;&#x430;&#x434;&#x44C;&#x435;&#x432;&#x438;&#x447; &#x413;&#x43E;&#x43B;&#x43E;&#x432;&#x43A;&#x438;&#x43D;"));

            it(`${prefix} stance`, () => expect(boxer.stance).toBe("orthodox"));

            it(`${prefix} height`, () => expect(boxer.height).toEqual([5, 10.5, 179]));

            it("should have a list of bouts", () => {
                expect(boxer.bouts).not.toBeNull();
                const latestFight: BoxrecBout = boxer.bouts[0];
                if (latestFight && latestFight.opponent) {
                    expect(latestFight.opponent.name).toBe("Saul Alvarez");
                } else {
                    throw new Error("Could not get opponent name");
                }
            });

            it("should have an equal length or greater of bouts/scheduled bouts compared against bouts they've completed", () => {
                expect(boxer.bouts.length).toBeGreaterThanOrEqual(boxer.numberOfBouts);
            });
        });

        describe("should push it to `otherInfo` if it is unknown data", () => {

            it("should push `foo bar`, `774820` in to the `otherInfo` property", () => {
                boxer = new BoxrecPageProfile(mockProfileRJJ.replace("global ID", "foo bar"));
                expect(boxer.otherInfo).toEqual([["foo bar", "774820"]]);
            });

        });

        it("should return `null` (or other specified) for any profile stats it cannot find", () => {
            boxer = new BoxrecPageProfile("");
            expect(boxer.name).toBeNull();
            expect(boxer.globalId).toBeNull();
            expect(boxer.role).toBeNull();
            expect(boxer.rating).toBeNull();
            expect(boxer.ranking).toBeNull();
            expect(boxer.vadacbp).toBeNull();
            expect(boxer.numberOfBouts).toBe(0);
            expect(boxer.rounds).toBeNull();
            expect(boxer.KOs).toBeNull();
            expect(boxer.status).toBeNull();
            expect(boxer.titlesHeld).toBeNull();
            expect(boxer.birthName).toBeNull();
            expect(boxer.alias).toBeNull();
            expect(boxer.born).toBeNull();
            expect(boxer.nationality).toBeNull();
            expect(boxer.debut).toBeNull();
            expect(boxer.division).toBeNull();
            expect(boxer.height).toBeNull();
            expect(boxer.reach).toBeNull();
            expect(boxer.residence).toBeNull();
            expect(boxer.birthPlace).toBeNull();
            expect(boxer.stance).toBeNull();
        });

        describe("rating", () => {

            it("should be null if could not match the regex", () => {
                boxer = new BoxrecPageProfile(mockProfileGGG.replace("width:98px;", ""));
                expect(boxer.rating).toBeNull();
            });

        });

        describe("born", () => {

            it("should be null if could not match the regex", () => {
                boxer = new BoxrecPageProfile(mockProfileGGG.replace(/1982-04-08/g, ""));
                expect(boxer.born).toBeNull();
            });

        });

        describe("suspensions", () => {

            it("should return an array of suspensions", () => {
                expect(boxer.suspensions.length).toBe(2);
            });

        });

        describe("height", () => {

            it("should be null if could not match the regex", () => {
                boxer = new BoxrecPageProfile(mockProfileGGG.replace(/5&prime; 10/g, ""));
                expect(boxer.height).toBeNull();
            });

        });

        describe("reach", () => {

            it("should be null if could not match the regex", () => {
                boxer = new BoxrecPageProfile(mockProfileGGG.replace(/70&Prime;/g, ""));
                expect(boxer.reach).toBeNull();
            });

        });

        describe("hasBoutScheduled", () => {

            it("should return true/false if the fighter has a fight scheduled", () => {
                boxer = new BoxrecPageProfile(mockProfileGGG);
                expect(boxer.hasBoutScheduled).toBe(true);
            });

        });

        describe("height with fraction characters", () => {

            const heightError = () => {
                throw new Error("height was null");
            };

            it("should return .25 for ¼ symbol", () => {
                boxer = new BoxrecPageProfile(mockProfileGGG.replace("&#189;", "&#188;"));
                if (boxer.height) {
                    expect(boxer.height[1]).toBe(10.25);
                } else {
                    heightError();
                }
            });

            it("should return .5 for ½", () => {
                boxer = new BoxrecPageProfile(mockProfileGGG);
                if (boxer.height) {
                    expect(boxer.height[1]).toBe(10.5);
                } else {
                    heightError();
                }

            });

            it("should return .75 for ¾", () => {
                boxer = new BoxrecPageProfile(mockProfileGGG.replace("&#189;", "&#190;"));
                if (boxer.height) {
                    expect(boxer.height[1]).toBe(10.75);
                } else {
                    heightError();
                }
            });

        });

    });

});

