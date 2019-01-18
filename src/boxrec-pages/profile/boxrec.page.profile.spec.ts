import * as fs from "fs";
import {boxRecMocksModulePath, WinLossDraw} from "../boxrec.constants";
import {Country} from "../location/people/boxrec.location.people.constants";
import {BoxrecRole} from "../search/boxrec.search.constants";
import {BoxrecPageProfileBoxer} from "./boxrec.page.profile.boxer";
import {BoxrecPageProfileBoxerBoutRow} from "./boxrec.page.profile.boxer.bout.row";
import {BoxrecPageProfileEventRow} from "./boxrec.page.profile.event.row";
import {BoxrecPageProfileEvents} from "./boxrec.page.profile.events";
import {BoxrecPageProfileManager} from "./boxrec.page.profile.manager";
import {BoxrecPageProfileManagerBoxerRow} from "./boxrec.page.profile.manager.boxer.row";
import {BoxrecPageProfileOtherCommon} from "./boxrec.page.profile.other.common";
import {BoxrecPageProfileOtherCommonBoutRow} from "./boxrec.page.profile.other.common.bout.row";
import {BoxrecPageProfilePromoter} from "./boxrec.page.profile.promoter";
import {BoxrecProfileTable} from "./boxrec.profile.constants";

// todo this is a mess.  This file needs to be broken up better
const mockProfileBoxerRJJ: string = fs.readFileSync(`${boxRecMocksModulePath}/profile/mockProfileBoxerRJJ.html`, "utf8");
const mockProfileBoxerGGG: string = fs.readFileSync(`${boxRecMocksModulePath}/profile/mockProfileBoxerGGG.html`, "utf8");
const mockProfileJudgeDaveMoretti: string = fs.readFileSync(`${boxRecMocksModulePath}/profile/mockProfileJudgeDaveMoretti.html`, "utf8");
const mockProfileDoctorAnthonyRuggeroli: string = fs.readFileSync(`${boxRecMocksModulePath}/profile/mockProfileDoctorAnthonyRuggeroli.html`, "utf8");
const mockProfilePromoterLeonardEllerbe: string = fs.readFileSync(`${boxRecMocksModulePath}/profile/mockProfilePromoterLeonardEllerbe.html`, "utf8");
const mockProfileRefereeRobertByrd: string = fs.readFileSync(`${boxRecMocksModulePath}/profile/mockProfileRefereeRobertByrd.html`, "utf8");
const mockProfileInspectorMichaelBuchato: string = fs.readFileSync(`${boxRecMocksModulePath}/profile/mockProfileInspectorMichaelBuchato.html`, "utf8");
const mockProfileManagerMichaelMcSorleyJr: string = fs.readFileSync(`${boxRecMocksModulePath}/profile/mockProfileManagerMichaelMcSorleyJr.html`, "utf8");
const mockProfileMatchmakerVeliPekkaMaeki: string = fs.readFileSync(`${boxRecMocksModulePath}/profile/mockProfileMatchmakerVeliPekkaMaeki.html`, "utf8");
const mockProfileSupervisorSammyMacias: string = fs.readFileSync(`${boxRecMocksModulePath}/profile/mockProfileSupervisorSammyMacias.html`, "utf8");

describe("class BoxrecPageProfile", () => {

    let boxerRJJ: BoxrecPageProfileBoxer;
    let boxerGGG: BoxrecPageProfileBoxer;
    let judgeDaveMoretti: BoxrecPageProfileOtherCommon;
    let doctorAnthonyRuggeroli: BoxrecPageProfileEvents;
    let promoterLeonardEllerbe: BoxrecPageProfilePromoter;
    let refereeRobertByrd: BoxrecPageProfileOtherCommon;
    let inspectorMichaelBuchato: BoxrecPageProfileEvents;
    let managerMichaelMcSorleyJr: BoxrecPageProfileManager;
    let matchmakerVeliPekkaMaeki: BoxrecPageProfileEvents;
    let supervisorSammyMacias: BoxrecPageProfileOtherCommon;

    beforeAll(() => {
        boxerRJJ = new BoxrecPageProfileBoxer(mockProfileBoxerRJJ);
        boxerGGG = new BoxrecPageProfileBoxer(mockProfileBoxerGGG);
        judgeDaveMoretti = new BoxrecPageProfileOtherCommon(mockProfileJudgeDaveMoretti);
        doctorAnthonyRuggeroli = new BoxrecPageProfileEvents(mockProfileDoctorAnthonyRuggeroli);
        promoterLeonardEllerbe = new BoxrecPageProfilePromoter(mockProfilePromoterLeonardEllerbe);
        refereeRobertByrd = new BoxrecPageProfileOtherCommon(mockProfileRefereeRobertByrd);
        inspectorMichaelBuchato = new BoxrecPageProfileEvents(mockProfileInspectorMichaelBuchato);
        managerMichaelMcSorleyJr = new BoxrecPageProfileManager(mockProfileManagerMichaelMcSorleyJr);
        matchmakerVeliPekkaMaeki = new BoxrecPageProfileEvents(mockProfileMatchmakerVeliPekkaMaeki);
        supervisorSammyMacias = new BoxrecPageProfileOtherCommon(mockProfileSupervisorSammyMacias);
    });

    describe("getter name", () => {

        it("should return the name", () => {
            expect(boxerRJJ.name).toBe("Roy Jones Jr");
        });

    });

    describe("getter company", () => {

        it("should return the company name as a string", () => {
            expect(promoterLeonardEllerbe.company).toBe("Mayweather Promotions");
        });

    });

    describe("getter globalId", () => {

        it("should return the boxer globalId", () => {
            expect(boxerRJJ.globalId).toBe(774820);
            expect(boxerGGG.globalId).toBe(356831);
        });

        it("should return the judge globalId", () => {
            expect(judgeDaveMoretti.globalId).toBe(401002);
        });

    });

    describe("getter rating", () => {

        it("should return the boxer's star rating", () => {
            expect(boxerGGG.rating).toEqual(jasmine.any(Number));
        });

    });

    describe("getter picture", () => {

        it("should return the URL of the person's profile picture", () => {
            expect(boxerRJJ.picture).toBe("https://static.boxrec.com/thumb/1/12/RoyJonesJrPP.jpg/200px-RoyJonesJrPP.jpg");
        });

    });

    describe("getter numberOfBouts", () => {

        it("should return the number of bouts this boxer has been in, not including scheduled bouts", () => {
            expect(boxerRJJ.numberOfBouts).toBeGreaterThanOrEqual(75);
        });

    });

    describe("getter role", () => {

        it("should return an object of the person's roles", () => {
            expect(boxerRJJ.role).toEqual([{
                id: 774820,
                name: BoxrecRole.boxer,
            }, {
                id: 774820,
                name: BoxrecRole.promoter,
            }]);
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
            expect(boxerRJJ.residence).toEqual({
                country: Country.USA,
                id: 18374,
                region: "FL",
                town: "Pensacola",
            });
        });

        it("should return the residence for other roles", () => {
            expect(judgeDaveMoretti.residence).toEqual({
                country: Country.USA,
                id: 20388,
                region: "NV",
                town: "Las Vegas",
            });
        });

    });

    describe("getter vadacbp", () => {

        it("should return boolean if VADA is on profile", () => {
            expect(boxerGGG.vadacbp).toBe(true);
        });

        it("should return false if VADA is not on profile", () => {
            expect(boxerRJJ.vadacbp).toBe(false);
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

    describe("getter titlesHeld", () => {

        it("should return the currently held titles", () => {
            expect(boxerGGG.titlesHeld).toEqual(jasmine.any(Array));
        });

    });

    describe("getter birthPlace", () => {

        it("should return the birth place of the person", () => {
            expect(boxerRJJ.birthPlace).toEqual({
                country: Country.USA,
                id: 18374,
                region: "FL",
                town: "Pensacola",
            });
        });

        it("should return the birth place of other roles", () => {
            expect(judgeDaveMoretti.birthPlace).toEqual({
                country: null,
                id: null,
                region: null,
                town: null,
            });
        });

    });

    describe("getter stance", () => {

        it("should return the stance", () => {
            expect(boxerGGG.stance).toBe("orthodox");
        });

    });

    describe("getter boxers", () => {

        let boxer: BoxrecPageProfileManagerBoxerRow;

        beforeAll(() => {
            boxer = managerMichaelMcSorleyJr.boxers[0];
        });

        describe("getter name", () => {

            it("should return the name", () => {
                expect(boxer.name).toBeDefined();
            });

        });

        describe("getter division", () => {

            it("should return the division as a string", () => {
                expect(boxer.division).toContain(boxer.division);
            });

        });

        describe("getter record", () => {

            it("should return the person's record", () => {
                const keys: string[] = Object.keys(boxer.record);
                expect(keys).toContain(WinLossDraw.win);
                expect(keys).toContain(WinLossDraw.draw);
                expect(keys).toContain(WinLossDraw.loss);
            });

        });

    });

    // these tests are to see if the columns still match up between different `roles`
    describe("getter events", () => {

        let doctorAnthonyRuggeroliEvent: BoxrecPageProfileEventRow;
        let leonardEllerbeEvent: BoxrecPageProfileEventRow;
        let inspectorMichaelBuchatoEvent: BoxrecPageProfileEventRow;
        let matchmakerVeliPekkaMaekiEvent: BoxrecPageProfileEventRow;

        beforeAll(() => {
            doctorAnthonyRuggeroliEvent = doctorAnthonyRuggeroli.events[0];
            leonardEllerbeEvent = promoterLeonardEllerbe.events[0];
            inspectorMichaelBuchatoEvent = inspectorMichaelBuchato.events[0];
            matchmakerVeliPekkaMaekiEvent = matchmakerVeliPekkaMaeki.events[0];
        });

        it("should have the date", () => {
            const dateRegex: RegExp = /^\d{4}-\d{2}-\d{2}$/;
            expect(doctorAnthonyRuggeroliEvent.date).toMatch(dateRegex);
            expect(leonardEllerbeEvent.date).toMatch(dateRegex);
            expect(inspectorMichaelBuchatoEvent.date).toMatch(dateRegex);
            expect(matchmakerVeliPekkaMaekiEvent.date).toMatch(dateRegex);
        });

        describe("getter venue", () => {

            it("should have the id of the venue", () => {
                expect(doctorAnthonyRuggeroliEvent.venue.id).toBeGreaterThanOrEqual(0);
                expect(leonardEllerbeEvent.venue.id).toBeGreaterThanOrEqual(0);
                expect(inspectorMichaelBuchatoEvent.venue.id).toBeGreaterThanOrEqual(0);
                expect(matchmakerVeliPekkaMaekiEvent.venue.id).toBeGreaterThanOrEqual(0);
            });

            it("should have the name of the venue", () => {
                expect(doctorAnthonyRuggeroliEvent.venue.name).toEqual(jasmine.any(String));
                expect(leonardEllerbeEvent.venue.name).toEqual(jasmine.any(String));
                expect(inspectorMichaelBuchatoEvent.venue.name).toEqual(jasmine.any(String));
                expect(matchmakerVeliPekkaMaekiEvent.venue.name).toEqual(jasmine.any(String));
            });

        });

        describe("getter links", () => {

            it("should return an object with `event` in it", () => {
                expect(leonardEllerbeEvent.links).toEqual(
                    {
                        event: 778241,
                    }
                );
            });

        });

    });

    describe("getter bouts", () => {

        let gggCanelo: BoxrecPageProfileBoxerBoutRow;
        let judgeDaveMorettiLatestBout: BoxrecPageProfileOtherCommonBoutRow;
        let refereeRobertByrdLatestBout: BoxrecPageProfileOtherCommonBoutRow;
        let supervisorSammyMaciasLatestBout: BoxrecPageProfileOtherCommonBoutRow;

        beforeAll(() => {
            gggCanelo = boxerGGG.bouts[37];
            judgeDaveMorettiLatestBout = judgeDaveMoretti.bouts[0];
            refereeRobertByrdLatestBout = refereeRobertByrd.bouts[0];
            supervisorSammyMaciasLatestBout = supervisorSammyMacias.bouts[0];
        });

        it("should have all bouts to offset the ad that BoxRec has in the list of profile bouts", () => {
            expect(boxerGGG.bouts.length).toBeGreaterThanOrEqual(40);
        });

        it("should have bouts for people other than boxers", () => {
            expect(judgeDaveMoretti.bouts.length).toBeGreaterThan(0);
        });

        describe("getter links", () => {

            it("should return an object of links", () => {
                expect(supervisorSammyMaciasLatestBout.links).toEqual({
                    bio: 2056855,
                    bout: 2056855,
                    event: 726555,
                    other: [],
                });
            });

        });

        describe("getter rating", () => {

            it("should return the rating of the bout", () => {
                expect(gggCanelo.rating).toBe(100);
            });

        });

        describe("getter date", () => {

            it("should return the date if it is known", () => {
                expect(gggCanelo.date).toBe("2017-09-16");
            });

            it("should return the date of the judged/refereed bout", () => {
                expect(judgeDaveMorettiLatestBout.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
                expect(refereeRobertByrdLatestBout.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
            });

        });

        describe("getter firstBoxerWeight", () => {

            it("should return the first boxer's weight", () => {
                expect(gggCanelo.firstBoxerWeight).toBe(160);
            });

        });

        describe("getter secondBoxer", () => {

            it("should return name", () => {
                expect(gggCanelo.secondBoxer.name).toBe("Saul Alvarez");
            });

        });

        describe("getter secondBoxerWeight", () => {

            it("should return the second boxer's weight", () => {
                expect(gggCanelo.secondBoxerWeight).toBe(160);
            });

        });

        describe("getter secondBoxerRecord", () => {

            it("should return the second boxer's record at that time", () => {
                expect(gggCanelo.secondBoxerRecord.win).toBe(49);
            });

        });

        describe("getter secondBoxerLast6", () => {

            it("should return the second boxer's last 6", () => {
                expect(gggCanelo.secondBoxerLast6).toEqual([WinLossDraw.win, WinLossDraw.win, WinLossDraw.win, WinLossDraw.win, WinLossDraw.win, WinLossDraw.win]);
            });

        });

        describe("getter bouts", () => {

            it("should have an equal length or greater of bouts/scheduled bouts compared against bouts they've completed", () => {
                expect(boxerGGG.bouts.length).toBeGreaterThanOrEqual(boxerGGG.numberOfBouts);
            });

        });

        describe("getter location", () => {

            it("should give the venue information", () => {
                expect(gggCanelo.location.venue).toBe("T-Mobile Arena");
            });

        });

        describe("getter links", () => {

            it("should return links in an array", () => {
                expect(gggCanelo.links).toEqual({
                    bio: 2160855,
                    bout: 2160855,
                    event: 751017,
                    other: [],
                });
            });

            it("should return the event id", () => {
                expect(gggCanelo.links.event).toBe(751017);
            });

        });

        describe("getter judges", () => {

            it("should list the judges names", () => {
                expect(gggCanelo.judges[0].name).toBe("Adalaide Byrd");
            });

        });

        describe("getter referee", () => {

            it("should list the referee", () => {
                expect(gggCanelo.referee.name).toBe("Kenny Bayless");
            });

        });

        describe("getter numberOfRounds", () => {

            it("should return the number of rounds the bout was", () => {
                expect(gggCanelo.numberOfRounds).toEqual([12, 12]);
            });

        });

        describe("getter outcome", () => {

            it("should return the outcome of the bout", () => {
                expect(gggCanelo.outcome).toEqual(WinLossDraw.draw);
            });

        });

        describe("getter result", () => {

            it("should return how the bout ended", () => {
                expect(gggCanelo.result).toEqual(["draw", "SD", "split decision"]);
            });

        });

        describe("getter titles", () => {

            it("should return what titles were on the line", () => {
                expect(gggCanelo.titles).toEqual([{
                    id: "75/Middleweight",
                    name: "International Boxing Federation World Middleweight Title"
                }, {
                    id: "189/Middleweight",
                    name: "International Boxing Organization World Middleweight Title",
                    supervisor: {
                        id: 403048,
                        name: "Ed Levine",
                    },
                }, {
                    id: "43/Middleweight",
                    name: "World Boxing Association Super World Middleweight Title"
                }, {
                    id: "6/Middleweight",
                    name: "World Boxing Council World Middleweight Title"
                }
                ]);
            });

        });

        describe("getter firstBoxerRating", () => {

            it("should return the rating of the first boxer before and after the fight", () => {
                expect(gggCanelo.firstBoxerRating).toEqual([jasmine.any(Number), jasmine.any(Number)]);
            });

        });

        describe("secondBoxerRating", () => {

            it("should return the rating of the second boxer before and after the fight", () => {
                expect(gggCanelo.secondBoxerRating).toEqual([jasmine.any(Number), jasmine.any(Number)]);
            });

        });

    });

    describe("getter otherInfo", () => {

        it("should return an array", () => {
            expect(boxerGGG.otherInfo.length).toEqual(jasmine.any(Number));
        });

        it("should not contain known profile values like global id", () => {
            const globalId: string[] | undefined = boxerGGG.otherInfo.find(key => key[0] === BoxrecProfileTable.globalId);
            expect(globalId).toBeUndefined();
        });

    });

    describe("getter hasBoutScheduled", () => {

        it("should return true/false if the boxer has a bout scheduled", () => {
            expect(boxerGGG.hasBoutScheduled).toEqual(jasmine.any(Boolean));
        });

    });

});
