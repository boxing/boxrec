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
import {WinLossDraw} from "../boxrec.constants";
import {Country} from "../location/people/boxrec.location.people.constants";
import {BoxrecRole} from "../search/boxrec.search.constants";
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

                it("should return the boxer globalId", () => {
                    expect(outputRJJ.globalId).toBe(774820);
                    expect(outputGGG.globalId).toBe(356831);
                });

                it("should return the boxer's star rating", () => {
                    expect(outputGGG.rating).toEqual(jasmine.any(Number));
                });

                it("should return the URL of the person's profile picture", () => {
                    expect(outputRJJ.picture).toBe("http://static.boxrec.com/thumb/1/12/RoyJonesJrPP.jpg/200px-RoyJonesJrPP.jpg");
                });

                it("should return the number of bouts this boxer has been in, not including scheduled bouts", () => {
                    expect(outputRJJ.numberOfBouts).toBeGreaterThanOrEqual(75);
                });

                it("should return an object of the person's roles", () => {
                    expect(outputRJJ.role).toEqual([{
                        id: 774820,
                        name: BoxrecRole.boxer,
                    }, {
                        id: 774820,
                        name: BoxrecRole.promoter,
                    }]);
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
                    expect(outputRJJ.alias).toBe("Junior");
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
                    expect(outputRJJ.residence).toEqual({
                        country: {
                            id: Country.USA,
                            name: "USA",
                        },
                        region: {
                            id: "FL",
                            name: "Florida",
                        },
                        town: {
                            id: 18374,
                            name: "Pensacola",
                        },
                    });
                });

                describe("getter vadacbp", () => {

                    it("should return boolean if VADA is on profile", () => {
                        expect(outputGGG.vadacbp).toBe(true);
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
                    expect(outputRJJ.birthPlace).toEqual({
                        country: {
                            id: Country.USA,
                            name: "USA",
                        },
                        region: {
                            id: "FL",
                            name: "Florida",
                        },
                        town: {
                            id: 18374,
                            name: "Pensacola",
                        },
                    });
                });

                describe("getter bouts", () => {

                    let gggCanelo: BoxrecProfileBoxerBoutOutput;
                    let judgeDaveMorettiLatestBout: BoxrecPageProfileOtherCommonBoutRow;
                    let refereeRobertByrdLatestBout: BoxrecPageProfileOtherCommonBoutRow;
                    let supervisorSammyMaciasLatestBout: BoxrecPageProfileOtherCommonBoutRow;

                    beforeAll(() => {
                        gggCanelo = outputGGG.bouts[37];
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

                        it("should return an object of links", () => {
                            expect(supervisorSammyMaciasLatestBout.links).toEqual({
                                bio: 2056855,
                                bout: "726555/2056855",
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
                            expect(outputGGG.bouts.length).toBeGreaterThanOrEqual(outputGGG.numberOfBouts);
                        });

                    });

                    describe("getter location", () => {

                        it("should give the venue information", () => {
                            expect(gggCanelo.location.venue).toBe("T-Mobile Arena");
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

            describe("getter residence", () => {

                it("should return the residence for other roles", () => {
                    expect(judgeDaveMoretti.residence).toEqual({
                        country: {
                            id: Country.USA,
                            name: "USA",
                        },
                        region: {
                            id: "NV",
                            name: "Nevada",
                        },
                        town: {
                            id: 20388,
                            name: "Las Vegas",
                        }
                    });
                });

            });

            describe("getter bouts", () => {

                it("should have an equal length or greater of bouts/scheduled bouts compared against bouts they've completed", () => {
                    expect(boxerGGG.bouts.length).toBeGreaterThanOrEqual(boxerGGG.numberOfBouts);
                });

                it("should give a boxer rating to boxers even if they lose of their first bout", () => {
                    expect(boxerFloydMayweatherJr.bouts[49].secondBoxerRating).toEqual([.05, .049]);
                });

            });

            describe("getter birthPlace", () => {

                let output: BoxrecProfileOtherOutput;

                beforeAll(() => {
                    output = judgeDaveMoretti.output;
                });

                it("should return the birth place of other roles", () => {
                    expect(output.birthPlace).toEqual({
                        country: {
                            id: null,
                            name: null,
                        },
                        region: {
                            id: null,
                            name: null,
                        },
                        town: {
                            id: null,
                            name: null,
                        },
                    });
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
    });
});
