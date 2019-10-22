import {mockWatched} from "boxrec-mocks";
import {BoxrecPageWatch} from "./boxrec.page.watch";
import {BoxrecPageWatchRow} from "./boxrec.page.watch.row";
import {BoxrecPageWatchRowOutput} from "./boxrec.watch.constants";

const findBoxerByName: (listArr: BoxrecPageWatchRowOutput[], globalId: number) => BoxrecPageWatchRowOutput | undefined
    = (listArr: BoxrecPageWatchRowOutput[], globalId: number): BoxrecPageWatchRowOutput | undefined => {
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

    describe("getter output", () => {

        describe("list value", () => {

            let boxer: BoxrecPageWatchRow;

            beforeAll(() => {
                boxer = findBoxerByName(boxrecWatch.output.list, 618866) as BoxrecPageWatchRow;

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

            it("should return the alias", () => {
                expect(boxer.alias).toBe("The Heat");
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
});
