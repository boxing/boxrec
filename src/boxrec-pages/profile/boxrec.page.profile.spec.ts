import {
    mockProfileBoxerFloydMayweatherJr,
    mockProfileBoxerGGG,
    mockProfileBoxerRJJ,
    mockProfileDoctorAnthonyRuggeroli,
    mockProfileInspectorMichaelBuchato,
    mockProfileJudgeDaveMoretti,
    mockProfileManagerMichaelMcSorleyJr,
    mockProfileMatchmakerVeliPekkaMaeki,
    mockProfilePromoterLeonardEllerbe,
    mockProfileRefereeRobertByrd,
    mockProfileSupervisorSammyMacias
} from "boxrec-mocks";
import {BoxrecRole} from "boxrec-requests/dist/boxrec-requests.constants";
import {WinLossDraw} from "../boxrec.constants";
import {BoxrecPageProfileBoxer} from "./boxrec.page.profile.boxer";
import {
    BoxrecProfileBoxerBoutOutput,
    BoxrecProfileBoxerOutput,
    BoxrecProfileManagerOutput,
    BoxrecProfileOtherOutput,
    BoxrecProfilePromoterOutput
} from "./boxrec.page.profile.constants";
import {BoxrecPageProfileEventRow} from "./boxrec.page.profile.event.row";
import {BoxrecPageProfileEvents} from "./boxrec.page.profile.events";
import {BoxrecPageProfileManager} from "./boxrec.page.profile.manager";
import {BoxrecPageProfileManagerBoxerRow} from "./boxrec.page.profile.manager.boxer.row";
import {BoxrecPageProfileOtherCommon} from "./boxrec.page.profile.other.common";
import {BoxrecPageProfileOtherCommonBoutRow} from "./boxrec.page.profile.other.common.bout.row";
import {BoxrecPageProfilePromoter} from "./boxrec.page.profile.promoter";
import {BoxrecProfileTable} from "./boxrec.profile.constants";

describe("class BoxrecPageProfile", () => {

    describe("class BoxrecPageProfile", () => {

        let boxerGGG: BoxrecPageProfileBoxer;
        let boxerFloydMayweatherJr: BoxrecPageProfileBoxer;
        let judgeDaveMoretti: BoxrecPageProfileOtherCommon;
        let doctorAnthonyRuggeroli: BoxrecPageProfileEvents;
        let promoterLeonardEllerbe: BoxrecPageProfilePromoter;
        let refereeRobertByrd: BoxrecPageProfileOtherCommon;
        let inspectorMichaelBuchato: BoxrecPageProfileEvents;
        let managerMichaelMcSorleyJr: BoxrecPageProfileManager;
        let matchmakerVeliPekkaMaeki: BoxrecPageProfileEvents;
        let supervisorSammyMacias: BoxrecPageProfileOtherCommon;

        beforeAll(() => {
            boxerGGG = new BoxrecPageProfileBoxer(mockProfileBoxerGGG);
            boxerFloydMayweatherJr = new BoxrecPageProfileBoxer(mockProfileBoxerFloydMayweatherJr);
            judgeDaveMoretti = new BoxrecPageProfileOtherCommon(mockProfileJudgeDaveMoretti);
            doctorAnthonyRuggeroli = new BoxrecPageProfileEvents(mockProfileDoctorAnthonyRuggeroli);
            promoterLeonardEllerbe = new BoxrecPageProfilePromoter(mockProfilePromoterLeonardEllerbe);
            refereeRobertByrd = new BoxrecPageProfileOtherCommon(mockProfileRefereeRobertByrd);
            inspectorMichaelBuchato = new BoxrecPageProfileEvents(mockProfileInspectorMichaelBuchato);
            managerMichaelMcSorleyJr = new BoxrecPageProfileManager(mockProfileManagerMichaelMcSorleyJr);
            matchmakerVeliPekkaMaeki = new BoxrecPageProfileEvents(mockProfileMatchmakerVeliPekkaMaeki);
            supervisorSammyMacias = new BoxrecPageProfileOtherCommon(mockProfileSupervisorSammyMacias);
        });

        describe("role boxer", () => {

            describe("getter output", () => {

                let outputRJJ: BoxrecProfileBoxerOutput;
                let outputGGG: BoxrecProfileBoxerOutput;

                beforeAll(() => {
                    outputRJJ = new BoxrecPageProfileBoxer(mockProfileBoxerRJJ).output;
                    outputGGG = new BoxrecPageProfileBoxer(mockProfileBoxerGGG).output;
                });

                it("should return the name", () => {
                    expect(outputRJJ.name).toBe("Roy Jones Jr");
                });

                it("should return null if they are not suspended", () => {
                    expect(outputRJJ.suspended).toBe(null);
                });

                it("should return the boxer globalId", () => {
                    expect(outputRJJ.globalId).toBe(774820);
                    expect(outputGGG.globalId).toBe(356831);
                });

                it("should return the boxer's star rating", () => {
                    expect(outputGGG.rating).toEqual(jasmine.any(Number));
                });

                it("should return boxer's record", () => {
                    expect(outputRJJ.record.win).toBeGreaterThanOrEqual(66);
                    expect(outputRJJ.record.draw).toBeGreaterThanOrEqual(0);
                    expect(outputRJJ.record.loss).toBeGreaterThanOrEqual(9);
                });

                it("should return the URL of the person's profile picture", () => {
                    // was previously "https://static.boxrec.com/thumb"
                    expect(outputRJJ.picture)
                        .toContain("https://boxrec.com/media/images");
                });

                it("should return the number of bouts this boxer has been in, not including scheduled bouts", () => {
                    expect(outputRJJ.numberOfBouts).toBeGreaterThanOrEqual(75);
                });

                describe("getter roles", () => {

                    it("should return an array of the person's roles if they have one role", () => {
                        // todo need a person with one role
                    });

                    it("should not include `All Sports`", () => {
                        // todo
                    });

                    it("should return an array of the person's roles (sorted by id, name ASC)", () => {
                        expect(outputRJJ.role).toEqual([{
                            id: 774820,
                            name: BoxrecRole.proBoxer,
                        }, {
                            id: 774820,
                            name: BoxrecRole.promoter,
                        }]);
                    });

                });

                it("should return the number of professionally fought rounds this boxer has been in", () => {
                    expect(outputRJJ.rounds).toBeGreaterThanOrEqual(495);
                });

                it("should return the number of KOs/TKOs this boxer has dealt out", () => {
                    expect(outputRJJ.KOs).toBeGreaterThanOrEqual(47);
                });

                it("should return the status of the person", () => {
                    expect(outputRJJ.status).toBe("inactive");
                });

                it("should return the birth name of the person", () => {
                    expect(outputRJJ.birthName).toBe("Roy Levesta Jones");
                });

                it("should give the nickname or alias of the boxer", () => {
                    expect(outputRJJ.alias).toBe(null);
                });

                it("should return the date this person was born", () => {
                    expect(outputRJJ.born).toBe("1969-01-16");
                });

                it("should return the date of this person's debut into the sport of boxing", () => {
                    expect(outputRJJ.debut).toBe("1989-05-06");
                });

                it("should return the nationality of this person", () => {
                    expect(outputRJJ.nationality).toBe("USA");
                });

                it("should return the division the last division this boxer fought in", () => {
                    expect(outputRJJ.division).toBe("light heavyweight");
                });

                describe("getter height", () => {

                    it("should return the height of the boxer", () => {
                        expect(outputRJJ.height).toEqual([5, 11, 180]);
                    });

                    it("should convert any heights with fractional numbers into decimals", () => {
                        expect(outputGGG.height).toEqual([5, 10.5, 179]);
                    });

                });

                it("should return the reach of the boxer", () => {
                    expect(outputRJJ.reach).toEqual([74, 188]);
                });

                it("should return the current residence of the person", () => {
                    expect(outputRJJ.residence).toBe("Pensacola, Florida, USA");
                });

                describe("getter vadacbp", () => {

                    it("should return boolean if VADA is on profile", () => {
                        expect(outputGGG.vadacbp).toEqual(jasmine.any(Boolean));
                    });

                    it("should return false if VADA is not on profile", () => {
                        expect(outputRJJ.vadacbp).toBe(false);
                    });

                });

                describe("getter ranking", () => {

                    it("should return the boxer's ranking", () => {
                        expect(outputGGG.ranking).toEqual([
                            [jasmine.any(Number), jasmine.any(Number)],
                            [jasmine.any(Number), jasmine.any(Number)],
                        ]);
                    });

                    it("should return null if the boxer is not ranked", () => {
                        expect(outputRJJ.ranking).toBeNull();
                    });

                });

                it("should return the currently held titles", () => {
                    expect(outputGGG.titlesHeld).toEqual(jasmine.any(Array));
                });

                it("should return the birth place of the person", () => {
                    expect(outputRJJ.birthPlace).toBe("Pensacola, Florida, USA");
                });

                describe("getter bouts", () => {

                    let gggCanelo: BoxrecProfileBoxerBoutOutput;
                    let rjjLacy: BoxrecProfileBoxerBoutOutput;
                    let judgeDaveMorettiLatestBout: BoxrecPageProfileOtherCommonBoutRow;
                    let refereeRobertByrdLatestBout: BoxrecPageProfileOtherCommonBoutRow;
                    let supervisorSammyMaciasLatestBout: BoxrecPageProfileOtherCommonBoutRow;

                    beforeAll(() => {
                        gggCanelo = outputGGG.bouts[37];
                        rjjLacy = outputRJJ.bouts[58];
                        judgeDaveMorettiLatestBout = judgeDaveMoretti.bouts[0];
                        refereeRobertByrdLatestBout = refereeRobertByrd.bouts[0];
                        supervisorSammyMaciasLatestBout = supervisorSammyMacias.bouts[0];
                    });

                    it("should have all bouts to offset the ad that BoxRec has in the list of profile bouts", () => {
                        expect(outputGGG.bouts.length).toBeGreaterThanOrEqual(40);
                    });

                    it("should have bouts for people other than boxers", () => {
                        expect(judgeDaveMoretti.bouts.length).toBeGreaterThan(0);
                    });

                    describe("getter links", () => {

                        it("should parse out `javascript` dropdown open links", () => {
                            supervisorSammyMaciasLatestBout.links.other.forEach(link => {
                                expect(link).not.toContain("javascript");
                            });
                        });

                        it("should return an object of links", () => {
                            expect(supervisorSammyMaciasLatestBout.links).toEqual({
                                bio: 2056855,
                                bout: "726555/2056855",
                                event: 726555,
                                other: [],
                            });
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

                    describe("getter location", () => {

                        it("should return the location", () => {
                            expect(refereeRobertByrdLatestBout.location).toEqual({
                                country: {id: "US", name: "USA"},
                                region: {id: "NV", name: "Nevada"},
                                town: {id: 20388, name: "Las Vegas"},
                            });
                        });

                    });

                    describe("getter firstBoxerWeight (other role)", () => {

                        it("should return the first boxer's weight", () => {
                            expect(refereeRobertByrdLatestBout.firstBoxerWeight).toBeGreaterThan(110);
                        });

                    });

                    describe("getter rating (other role)", () => {

                        it("should return the rating of the bout", () => {
                            expect(refereeRobertByrdLatestBout.rating).toBeGreaterThanOrEqual(0);
                        });

                    });

                    describe("getter secondBoxerWeight (other role)", () => {

                        it("should return the first boxer's weight", () => {
                            expect(refereeRobertByrdLatestBout.secondBoxerWeight).toBeGreaterThan(110);
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
                            expect(outputGGG.bouts.length).toBeGreaterThanOrEqual(outputGGG.numberOfBouts);
                        });

                    });

                    describe("getter location", () => {

                        it("should give the venue information", () => {
                            expect(gggCanelo.location).toBe("T-Mobile Arena, Las Vegas");
                        });

                        it("should be a string since there are no links in the locations", () => {
                            expect(rjjLacy.location).toBe("Coast Coliseum, Biloxi");
                        });

                    });

                    describe("getter links", () => {

                        it("should return links in an object", () => {
                            expect(gggCanelo.links).toEqual({
                                bio: 2160855,
                                bout: "751017/2160855",
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

                        it("should return what titles were on the line (in order by id)", () => {
                            expect(gggCanelo.titles).toEqual([
                                {
                                    id: "6/Middleweight",
                                    name: "World Boxing Council World Middleweight Title"
                                },
                                {
                                    id: "43/Middleweight",
                                    name: "World Boxing Association Super World Middleweight Title"
                                },
                                {
                                    id: "75/Middleweight",
                                    name: "International Boxing Federation World Middleweight Title"
                                },
                                {
                                    id: "189/Middleweight",
                                    name: "International Boxing Organization World Middleweight Title",
                                    supervisor: {
                                        id: 403048,
                                        name: "Ed Levine",
                                    },
                                },
                            ]);
                        });

                        it("should convert the short divisions to full division for consistency", () => {
                            expect(rjjLacy.titles[0].name)
                                .toBe("World Boxing Organisation NABO Light Heavyweight Title");
                        });

                        it("should be able to parse weight divisions with spaces (ex. Light%20Heavyweight)", () => {
                            expect(rjjLacy.titles).toEqual([{
                                id: "96/Light%20Heavyweight",
                                name: "World Boxing Organisation NABO Light Heavyweight Title",
                            }]);
                        });

                    });

                    it("should return the first fighter weight", () => {
                        expect(rjjLacy.firstBoxerWeight).toEqual(174);
                    });

                    it("should return the number of rounds", () => {
                        expect(rjjLacy.numberOfRounds).toEqual([10, 12]);
                    });

                    it("should return the second fighter weight", () => {
                        expect(rjjLacy.secondBoxerWeight).toEqual(172);
                    });

                    it("should return the bout date", () => {
                        expect(rjjLacy.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
                    });

                    it("should return the outcome/result of the fight", () => {
                        expect(rjjLacy.outcome).toBe(WinLossDraw.win);
                    });

                    it("should return the bout date", () => {
                        // todo
                    });

                    it("should return the second boxer", () => {
                        expect(rjjLacy.secondBoxer).toEqual({
                            id: 31593,
                            name: "Jeff Lacy"
                        });
                    });

                    it("should return the second boxer last 6", () => {
                        expect(rjjLacy.secondBoxerLast6).toEqual([WinLossDraw.loss,
                            WinLossDraw.win, WinLossDraw.win, WinLossDraw.win, WinLossDraw.loss, WinLossDraw.win]);
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

                    describe("getter otherInfo", () => {

                        it("should return an array", () => {
                            expect(outputGGG.otherInfo.length).toEqual(jasmine.any(Number));
                        });

                        it("should not contain known profile values like global id", () => {
                            const globalId: string[] | undefined = outputGGG.otherInfo.find((key: any) => key[0] === BoxrecProfileTable.globalId);
                            expect(globalId).toBeUndefined();
                        });

                    });

                    describe("getter hasBoutScheduled", () => {

                        it("should return true/false if the boxer has a bout scheduled", () => {
                            expect(outputGGG.hasBoutScheduled).toEqual(jasmine.any(Boolean));
                        });

                    });

                    describe("getter stance", () => {

                        it("should return the stance", () => {
                            expect(outputGGG.stance).toBe("orthodox");
                        });

                    });

                });
            });
        });

        describe("role promoter", () => {

            let output: BoxrecProfilePromoterOutput;

            beforeAll(() => {
                output = promoterLeonardEllerbe.output;
            });

            describe("getter company", () => {

                it("should return the company name as a string", () => {
                    expect(output.company).toBe("Mayweather Promotions");
                });

            });

        });

        describe("role judge", () => {

            describe("getter globalId", () => {

                it("should return the judge globalId", () => {
                    expect(judgeDaveMoretti.globalId).toBe(401002);
                });

            });

            describe("getter secondBoxerRecord", () => {

                // todo should this be undefined?
                xit("should be undefined", () => {
                    expect(judgeDaveMoretti.bouts[0].secondBoxerRecord).toBeUndefined();
                });

            });

            describe("getter residence", () => {

                it("should return the residence for other roles", () => {
                    expect(judgeDaveMoretti.residence).toBe("Las Vegas, Nevada, USA");
                });

            });

            describe("getter bouts", () => {

                // todo this shouldn't be under role judge
                it("should have an equal length or greater of bouts/scheduled bouts compared against bouts they've completed", () => {
                    expect(boxerGGG.bouts.length).toBeGreaterThanOrEqual(boxerGGG.numberOfBouts);
                });

                // todo this shouldn't be under role judge
                it("should give a boxer rating to boxers even if they lose of their first bout", () => {
                    expect(boxerFloydMayweatherJr.bouts[49].secondBoxerRating)
                        .toEqual([jasmine.any(Number), jasmine.any(Number)]);
                });

                describe("getter numberOfRounds", () => {

                    it("should return the number of rounds for bouts", () => {
                        expect(judgeDaveMoretti.bouts[0].numberOfRounds)
                            .toEqual([jasmine.any(Number), jasmine.any(Number)]);
                    });

                });

                describe("getter secondBoxerLast6", () => {

                    xit("should be undefined", () => {
                        // todo this fails, it should be undefined
                        expect(judgeDaveMoretti.bouts[0].secondBoxerLast6).toBeUndefined();
                    });

                });

            });

            describe("getter birthPlace", () => {

                let output: BoxrecProfileOtherOutput;

                beforeAll(() => {
                    output = judgeDaveMoretti.output;
                });

                it("should return the null if the birth place isn't set", () => {
                    expect(output.birthPlace).toBe(null);
                });
            });
        });

        describe("role manager", () => {

            let output: BoxrecProfileManagerOutput;

            beforeAll(() => {
                output = managerMichaelMcSorleyJr.output;
            });

            describe("getter boxers", () => {

                let boxer: BoxrecPageProfileManagerBoxerRow;

                beforeAll(() => {
                    boxer = output.boxers[0];
                });

                describe("getter name", () => {

                    it("should return the name", () => {
                        expect(boxer.name).toBeDefined();
                    });

                    it("should not be empty", () => {
                        expect(boxer.name).not.toBe("");
                    });

                });

                describe("getter stance", () => {

                    it("should return the stance", () => {
                        expect(boxer.stance === "orthodox" || boxer.stance === "southpaw").toBeTruthy();
                    });

                });

                describe("getter residence", () => {

                    it("should have the fighters residence", () => {
                        expect(boxer.residence).toEqual({
                            country: jasmine.anything(),
                            region: jasmine.anything(),
                            town: jasmine.anything(),
                        });
                    });

                });

                describe("getter division", () => {

                    it("should return the division as a string", () => {
                        expect(boxer.division).toContain(boxer.division);
                    });

                });

                describe("getter age", () => {

                    it("should return the age", () => {
                        expect(boxer.age).toBeGreaterThan(12);
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

                describe("getter last6", () => {

                    it("should return the last 6", () => {
                        expect(Object.values(WinLossDraw)).toContain(boxer.last6[0]);
                    });

                });

                describe("getter debut", () => {

                    it("should return the last 6", () => {
                        expect(boxer.debut).toMatch(/^\d{4}-\d{2}-\d{2}$/);
                    });

                });

            });

        });

        describe("roles with events", () => {

            let matchmakerVeliPekkaMaekiEvent: BoxrecPageProfileEventRow;
            let doctorAnthonyRuggeroliEvent: BoxrecPageProfileEventRow;
            let leonardEllerbeEvent: BoxrecPageProfileEventRow;
            let inspectorMichaelBuchatoEvent: BoxrecPageProfileEventRow;

            beforeAll(() => {
                matchmakerVeliPekkaMaekiEvent = matchmakerVeliPekkaMaeki.output.events[0];
                doctorAnthonyRuggeroliEvent = doctorAnthonyRuggeroli.output.events[0];
                leonardEllerbeEvent = promoterLeonardEllerbe.output.events[0];
                inspectorMichaelBuchatoEvent = inspectorMichaelBuchato.output.events[0];
            });

            // these tests are to see if the columns still match up between different `roles`
            describe("getter events", () => {

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
                                event: jasmine.any(Number),
                            }
                        );
                    });
                });
            });

        });

        describe("getter socialMedia", () => {

            it("should include social media links", () => {
                expect(boxerGGG.socialMedia).toBeDefined();
            });

        });
    });
});
