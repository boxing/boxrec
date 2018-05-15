export const boxrec = require("./boxrec.class.ts");
export const {BOXREC_USERNAME, BOXREC_PASSWORD} = process.env;

if (!BOXREC_USERNAME) {
    throw new Error("missing required env var BOXREC_USERNAME");
}

if (!BOXREC_PASSWORD) {
    throw new Error("missing required env var BOXREC_PASSWORD");
}

// ignores __mocks__ and makes real requests
jest.unmock("request-promise");

describe("class Boxrec (E2E)", () => {

    describe("method login", () => {

        it("should return nothing if was successful", async () => {
            const response = await boxrec.login(BOXREC_USERNAME, BOXREC_PASSWORD);
            expect(response).toBeUndefined();
        });

    });

    describe("method getBoxerById", () => {

        it("should return Boxer information", async () => {
            const boxer = await boxrec.getBoxerById(352);
            expect(boxer.name).toBe("Floyd Mayweather Jr");
        });

        it("should include the number of bouts they were in", async () => {
            const boxer = await boxrec.getBoxerById(9625); // Sugar Ray Robinson
            expect(boxer.bouts.length).toBe(201);
        });

    });

    describe("method getBoxersByName", () => {

        it("should return Floyd Sr. and then Floyd Jr.", async () => {
            const results = await boxrec.getBoxersByName("Floyd", "Mayweather");
            let boxer = await results.next();
            expect(boxer.value.birthName).toContain("Floyd");
            boxer = await results.next();
            expect(boxer.value.birthName).toContain("Floyd");
        });

    });

    describe("method getEventById", () => {

        it("should return the venue name", async () => {
            const results = await boxrec.getEventById(765205);
            expect(results.location.venue.name).toBe("Madison Square Garden");
        });

        it("should return a list of bouts", async () => {
            const results = await boxrec.getEventById(555);
            expect(results.bouts[0].firstBoxer.name).toBe("Cornelius Drane");
        });

        it("should return 0 wins/loss/draw for a boxer on his debut fight", async () => {
            const results = await boxrec.getEventById(752960);
            expect(results.bouts[2].secondBoxerRecord.win).toBe(0);
            expect(results.bouts[2].secondBoxerRecord.loss).toBe(0);
            expect(results.bouts[2].secondBoxerRecord.draw).toBe(0);
        });

    });

    describe("method getChampions", () => {

        describe("object champions", () => {

            it("should return an array of champions by weight class", async () => {
                const results = await boxrec.getChampions();
                expect(results.champions[0].weightClass).toBe("heavyweight");
            });

            it("should return the ABC belts", async () => {
                const results = await boxrec.getChampions();
                expect(results.champions[0].beltHolders.IBF).toBeDefined();
            });

        });

    });

});
