import {BoxrecPageSearch} from "./boxrec.page.search";
import {boxRecMocksModulePath} from "./boxrec.constants";

const fs = require("fs");
const mockSearchResults = fs.readFileSync(`${boxRecMocksModulePath}/search/mockSearchMayweather.html`, "utf8");

describe("class BoxrecPageSearch", () => {

    let searchResults: BoxrecPageSearch;

    beforeAll(() => {
        searchResults = new BoxrecPageSearch(mockSearchResults);
    });

    describe("getter get", () => {

        it("should return an array of search results", () => {
            expect(searchResults.get.length).not.toBe(0);
        });

    });

});
