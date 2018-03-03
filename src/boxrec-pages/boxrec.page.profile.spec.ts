import {BoxrecPageProfile} from "./boxrec.page.profile";
const BoxrecPageProfile = require("./boxrec.page.profile");
const fs = require("fs");
const mockProfileRJJ = fs.readFileSync("./src/boxrec-pages/mockProfileRJJ.html", "utf8");
const mockProfileGGG = fs.readFileSync("./src/boxrec-pages/mockProfileGGG.html", "utf8");

describe("class BoxrecPageProfile", () => {

    let boxer: BoxrecPageProfile;

    describe("loading a profile", () => {

        const prefix: string = "should have the boxer's";

        describe("Roy Jones Jr", () => {

            beforeAll(() => {
                boxer = new BoxrecPageProfile(mockProfileRJJ);
            });

            it(`${prefix} name`, () => expect(boxer.name).toBe("Roy Jones Jr"));

            it(`${prefix} bouts`, () => expect(boxer.bouts).toBe(75));

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

        });

        describe("Gennady Golovkin", () => {

            beforeAll(() => {
                boxer = new BoxrecPageProfile(mockProfileGGG);
            });

            it(`${prefix} rating`, () => expect(boxer.rating).toBe(98));

            it(`${prefix} ranking`, () => expect(boxer.ranking).toEqual([
                [2, 1053],
                [1, 8],
            ]));

            it(`${prefix} VADA CBP`, () => expect(boxer.vadacbp).toBe("enrolled"));

            it(`${prefix} titles held`, () => expect(boxer.titlesHeld).toEqual([
                    "International Boxing Organization World Middleweight Title",
                    "WBA Super World Middleweight Title",
                    "WBC World Middleweight Title",
                    "IBF World Middleweight Title",
                ]
            ));

            it(`${prefix} date of birth`, () => {
                expect(boxer.born).toBe("1982-04-08")
            });

            it(`${prefix} birth name`, () => expect(boxer.birthName).toBe("&#x413;&#x435;&#x43D;&#x43D;&#x430;&#x434;&#x438;&#x439; &#x413;&#x435;&#x43D;&#x43D;&#x430;&#x434;&#x44C;&#x435;&#x432;&#x438;&#x447; &#x413;&#x43E;&#x43B;&#x43E;&#x432;&#x43A;&#x438;&#x43D;"));

            it(`${prefix} stance`, () => expect(boxer.stance).toBe("orthodox"));

            it(`${prefix} height`, () => expect(boxer.height).toEqual([5, 10.5, 179]));

        });

        describe("should push it to `otherInfo` if it is unknown data", () => {

            it("should push `foo bar`, `774820` in to the `otherInfo` property", () => {
                boxer = new BoxrecPageProfile(mockProfileRJJ.replace("global ID", "foo bar"));
                expect(boxer.otherInfo).toEqual([["foo bar", "774820"]]);
            });

        });

        it("should return `undefined` for any profile stats it cannot find", () => {
            boxer = new BoxrecPageProfile("");
            expect(boxer.name).toBe(undefined);
            expect(boxer.globalId).toBe(undefined);
            expect(boxer.role).toBe(undefined);
            expect(boxer.rating).toBe(undefined);
            expect(boxer.ranking).toBe(undefined);
            expect(boxer.vadacbp).toBe(undefined);
            expect(boxer.bouts).toBe(undefined);
            expect(boxer.rounds).toBe(undefined);
            expect(boxer.KOs).toBe(undefined);
            expect(boxer.status).toBe(undefined);
            expect(boxer.titlesHeld).toBe(undefined);
            expect(boxer.birthName).toBe(undefined);
            expect(boxer.alias).toBe(undefined);
            expect(boxer.born).toBe(undefined);
            expect(boxer.nationality).toBe(undefined);
            expect(boxer.debut).toBe(undefined);
            expect(boxer.division).toBe(undefined);
            expect(boxer.height).toBe(undefined);
            expect(boxer.reach).toBe(undefined);
            expect(boxer.residence).toBe(undefined);
            expect(boxer.birthPlace).toBe(undefined);
            expect(boxer.stance).toBe(undefined);
        });


        describe("height with fraction characters", () => {

            it("should return .25 for ¼ symbol", () => {
                boxer = new BoxrecPageProfile(mockProfileGGG.replace("&#189;", "&#188;"));
                expect(boxer.height[1]).toBe(10.25);
            });

            it("should return .5 for ½", () => {
                boxer = new BoxrecPageProfile(mockProfileGGG);
                expect(boxer.height[1]).toBe(10.5);
            });

            it("should return .75 for ¾", () => {
                boxer = new BoxrecPageProfile(mockProfileGGG.replace("&#189;", "&#190;"));
                expect(boxer.height[1]).toBe(10.75);
            });

        });

    });

});

