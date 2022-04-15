import {BoxrecBasic} from "boxrec-requests";
import {WinLossDraw} from "../boxrec-pages/boxrec.constants";
import {BoxrecPageEventBout} from "../boxrec-pages/event/bout/boxrec.page.event.bout";
import {BoxingBoutOutcome} from "../boxrec-pages/event/boxrec.event.constants";
import {Boxrec} from "../boxrec.class";
import {expectId, logIn, wait} from "./helpers";

jest.setTimeout(200000);

describe("method getBoutById", () => {

    let loggedInCookie: string;

    beforeAll(async () => {
        const logInResponse: { madeRequest: boolean, cookieString: string} = await logIn();
        loggedInCookie = logInResponse.cookieString;
    });

    let caneloKhanBout: BoxrecPageEventBout;

    beforeAll(async () => {
        caneloKhanBout = await Boxrec.getBoutById(loggedInCookie, "726555/2037455");
        await wait();
    });

    describe("getter rating", () => {

        it("should give a rating of 100 if 5 stars", () => {
            expect(caneloKhanBout.rating).toBe(100);
        });

    });

    describe("getter date", () => {

        it("should return a date", () => {
            expect(caneloKhanBout.date).toBe("2016-05-07");
        });

    });

    describe("getter location", () => {

        it("should return the venue", () => {
            const {id, name} = caneloKhanBout.location.venue;
            expect(id).toBe(246559);
            expect(name).toBe("T-Mobile Arena");
        });

        it("should return the location", () => {
            const {town, region, country} = caneloKhanBout.location.location;
            expect(town.name).toBe("Las Vegas");
            expect(region.name).toBe("Nevada");
            expect(country.id).toBe("US");
        });

    });

    describe("getter belts", () => {

        it("should return the belts for this bout", () => {
            const {id, name, supervisor} = caneloKhanBout.titles[0];
            expect(id).toBe("6/Middleweight");
            expect(name).toBe("World Boxing Council World Middleweight Title");
            if (supervisor) {
                expect(supervisor.name).toBe("Charles Giles");
                expectId(supervisor.id, 418474);
            } else {
                throw new Error("Supervisor missing");
            }
        });

    });

    describe("getter referee", () => {

        it("should give the id and name of the referee", () => {
            expect(caneloKhanBout.referee).toEqual({
                id: 400853,
                name: "Kenny Bayless",
            });
        });

    });

    describe("getter judges", () => {

        it("should include an array of judges", () => {
            expect(caneloKhanBout.judges).toEqual(jasmine.any(Array));
        });

        it("should include the scorecards", () => {
            expect(caneloKhanBout.judges[0].scorecard).toEqual([47, 48]);
        });

        it("should include the name of the judge", () => {
            expect(caneloKhanBout.judges[0].name).toBe("Adalaide Byrd");
        });

    });

    describe("getter firstBoxerRanking", () => {

        it("should return the ranking", () => {
            expect(caneloKhanBout.firstBoxerRanking).toBe(1);
        });

    });

    describe("getter secondBoxerRating", () => {

        it("should return the ranking", () => {
            expect(caneloKhanBout.secondBoxerRanking).toEqual(jasmine.any(Number));
        });

    });

    describe("getter firstBoxerAge", () => {

        it("should return the age", () => {
            expect(caneloKhanBout.firstBoxerAge).toBe(25);
        });

    });

    describe("getter secondBoxerAge", () => {

        it("should return the age", () => {
            expect(caneloKhanBout.secondBoxerAge).toBe(29);
        });

    });

    describe("getter firstBoxerStance", () => {

        it("should return the stance", () => {
            expect(caneloKhanBout.firstBoxerStance).toBe("orthodox");
        });

    });

    describe("getter secondBoxerStance", () => {

        it("should return the stance", () => {
            expect(caneloKhanBout.secondBoxerStance).toBe("orthodox");
        });

    });

    describe("getter firstBoxerHeight", () => {

        it("should return the height", () => {
            expect(caneloKhanBout.firstBoxerHeight).toEqual([5, 8, 173]);
        });

    });

    describe("getter secondBoxerHeight", () => {

        it("should return the height", () => {
            expect(caneloKhanBout.secondBoxerHeight).toEqual([5, 8.5, 174]);
        });

    });

    describe("getter firstBoxerReach", () => {

        it("should return the reach", () => {
            expect(caneloKhanBout.firstBoxerReach).toEqual([70.5, 179]);
        });

    });

    describe("getter secondBoxerReach", () => {

        it("should return the reach", () => {
            expect(caneloKhanBout.secondBoxerReach).toEqual([71, 180]);
        });

    });

    describe("getter firstBoxerRecord", () => {

        it("should return record", () => {
            expect(caneloKhanBout.firstBoxerRecord).toEqual({
                draw: 1,
                loss: 1,
                win: 46,
            });
        });

    });

    describe("getter secondBoxerRecord", () => {

        it("should return record", () => {
            expect(caneloKhanBout.secondBoxerRecord).toEqual({
                draw: 0,
                loss: 3,
                win: 31,
            });
        });

    });

    describe("getter firstBoxerLast6", () => {

        it("should return an array of the last 6 boxer's they were in the ring with", () => {
            const [cotto, , , angulo, mayweather] = caneloKhanBout.firstBoxerLast6;
            expect(cotto.name).toBe("Miguel Cotto");
            expect(cotto.outcome).toBe(WinLossDraw.win);
            expect(cotto.outcomeByWayOf).toBe(BoxingBoutOutcome.UD);
            expect(angulo.outcomeByWayOf).toBe(BoxingBoutOutcome.TKO);
            expect(mayweather.outcome).toBe(WinLossDraw.loss);
            expect(mayweather.outcomeByWayOf).toBe(BoxingBoutOutcome.MD);
        });

    });

    describe("getter secondBoxerLast6", () => {

        it("should return an array of the last 6 boxer's they were in the ring with", () => {
            const [, , , , molina, garcia] = caneloKhanBout.secondBoxerLast6;
            expect(molina.outcomeByWayOf).toBe(BoxingBoutOutcome.RTD);
            expect(garcia.outcomeByWayOf).toBe(BoxingBoutOutcome.TKO);
        });

    });

    describe("getter promoter", () => {

        it("should return the array of promoters", () => {
            expect(caneloKhanBout.promoters[0].name).toBe("Oscar De La Hoya");
            expect(caneloKhanBout.promoters[0].id).toBe("8253");
        });

    });

    describe("getter matchmaker", () => {

        it("should return the array of matchmakers", () => {
            expectId(caneloKhanBout.matchmakers[0].id, 500179);
        });

    });

    describe("getter outcome", () => {

        it("should return the outcome", () => {
            expect(caneloKhanBout.outcome.boxer.name).toBe("Saul Alvarez");
            expect(caneloKhanBout.outcome.outcomeByWayOf).toBe(BoxingBoutOutcome.KO);
        });

    });

    describe("getter doctors", () => {

        it("should return the array of doctors", () => {
            const id: number = 468696;
            const doctor: BoxrecBasic = caneloKhanBout.doctors.find(item => item.id === id) as BoxrecBasic;
            expect(doctor.id).toBe(id);
        });

    });

});
