const BoxrecPageProfile = require("./boxrec.page.profile");
const htmlRJJ = require('./mockProfile.html');

console.log('test')
describe("class BoxrecPageProfile", () => {

    it("should defined", () => {
        expect(BoxrecPageProfile).toBeDefined()
    });

    it("constructor should parse HTML string and set properties that can be accessed", () =>{
        const test = new BoxrecPageProfile(htmlRJJ);


        console.log(test);

    })

});
