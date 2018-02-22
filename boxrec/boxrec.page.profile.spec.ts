const fs = require("fs");
const BoxrecPageProfile = require("./boxrec.page.profile");

const mockProfile = fs.readFileSync("./boxrec/mockProfile.html", "utf8");

describe("class BoxrecPageProfile", () => {

    let boxer;

    beforeAll(() => {
        boxer = new BoxrecPageProfile(mockProfile);
    });

    describe("attributes", () => {

        const prefix: string = "should have the boxer's";

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

});
