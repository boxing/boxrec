import {BoxrecPageProfileSuspensionsRow} from "./boxrec.page.profile.suspensions.row";
import {boxRecMocksModulePath} from "./boxrec.constants";

const fs = require("fs");
const mockSuspensionGGG = fs.readFileSync(`${boxRecMocksModulePath}/profile/suspension/mockSuspensionGGG.html`, "utf8");

describe("class BoxrecPageProfileSuspensionsRow", () => {

    let suspension: BoxrecPageProfileSuspensionsRow;

    beforeAll(() => {
        suspension = new BoxrecPageProfileSuspensionsRow(mockSuspensionGGG);
    });

    describe("getter issuedBy", () => {

        it("should return who it was issued by", () => {
            expect(suspension.issuedBy).toEqual({
                id: "USCA",
                name: "California State Athletic Commission",
            });
        });
    });

    describe("getter type", () => {

        it("should describe the type of suspension", () => {
            expect(suspension.type).toBe("");
        });

    });

    describe("getter startDate", () => {

        it("should return the date the suspension started", () => {
            expect(suspension.startDate).toBe("2015-05-16");
        });

    });

    describe("getter endDate", () => {

        it("should return the date the suspension ended", () => {
            expect(suspension.endDate).toBe("2015-05-23");
        });

    });

    describe("getter lengthInDays", () => {

        it("should return the number of days of the suspension", () => {
            expect(suspension.lengthInDays).toBe(7);
        });

    });

    describe("getter eventId", () => {

        it("should return the event id associated with the suspension", () => {
            expect(suspension.eventId).toBe(711316);
        });

    });

});
