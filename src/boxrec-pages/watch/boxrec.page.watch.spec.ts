import {mockWatched} from "boxrec-mocks";
import {WinLossDraw} from "../boxrec.constants";
import {WeightDivision} from "../champions/boxrec.champions.constants";
import {BoxrecPageWatch} from "./boxrec.page.watch";
import {BoxrecPageWatchRow} from "./boxrec.page.watch.row";

const findBoxerByName: (listArr: BoxrecPageWatchRow[], globalId: number) => BoxrecPageWatchRow | undefined
    = (listArr: BoxrecPageWatchRow[], globalId: number): BoxrecPageWatchRow | undefined => {
    return listArr.find(item => item.globalId === globalId);
};

describe("class BoxrecPageWatch", () => {

    let boxrecWatch: BoxrecPageWatch;

    beforeAll(() => {
        boxrecWatch = new BoxrecPageWatch(mockWatched);
    });

    describe("method checkForBoxerInList", () => {

        it("should return true if boxer does appear on page", () => {
            expect(boxrecWatch.checkForBoxerInList(618866)).toBe(true);
        });

        it("should return false if boxer does not appear on page", () => {
            expect(boxrecWatch.checkForBoxerInList(-1)).toBe(false);
        });

    });

    describe("method list", () => {

        let boxer: BoxrecPageWatchRow;

        beforeAll(() => {
            boxer = findBoxerByName(boxrecWatch.list(), 618866) as BoxrecPageWatchRow;

            if (!boxer) {
                throw new Error("Could not find boxer in list");
            }
        });

        it("should return the global id of the boxer", () => {
            expect(boxer.globalId).toBe(618866);
        });

        it("should return the name", () => {
            expect(boxer.name).toBe("Heather Hardy");
        });

        it("should return the division", () => {
            expect(boxer.division).toBe(WeightDivision.featherweight);
        });

        it("should return the alias", () => {
            expect(boxer.alias).toBe("The Heat");
        });

        it("should return the last 6", () => {
            expect(boxer.last6).toContain(WinLossDraw.win);
        });

        it("should return the record but the values should be `null` because nothing appears on the page", () => {
            expect(boxer.record.win).toBeNull();
            expect(boxer.record.draw).toBeNull();
            expect(boxer.record.loss).toBeNull();
        });

        describe("getter schedule", () => {

            it("should return the date of their next bout if they have one or return null", () => {
                if (boxer.schedule) {
                    expect(boxer.schedule).toMatch(/\d{4}-\d{2}-\d{2}/);
                } else {
                    expect(boxer.schedule).toBeNull();
                }
            });

        });

    });

});
