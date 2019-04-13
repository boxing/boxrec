# BoxRec
[![Build Status](https://travis-ci.org/boxing/boxrec.svg?branch=master)](https://travis-ci.org/boxing/boxrec) [![Coverage Status](https://coveralls.io/repos/github/boxing/boxrec/badge.svg?branch=master)](https://coveralls.io/github/boxing/boxrec?branch=master) [![dependencies Status](https://david-dm.org/boxing/boxrec/status.svg)](https://david-dm.org/boxing/boxrec) [![devDependencies Status](https://david-dm.org/boxing/boxrec/dev-status.svg)](https://david-dm.org/boxing/boxrec?type=dev) [![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/1643/badge)](https://bestpractices.coreinfrastructure.org/projects/1643) [![npm version](https://badge.fury.io/js/boxrec.svg)](https://badge.fury.io/js/boxrec)
[![Maintainability](https://api.codeclimate.com/v1/badges/a3581bdc38162e00c797/maintainability)](https://codeclimate.com/github/boxing/boxrec/maintainability)
[![Known Vulnerabilities](https://snyk.io/test/github/boxing/boxrec/badge.svg?targetFile=package.json)](https://snyk.io/test/github/boxing/boxrec?targetFile=package.json)

This project allows you to query information from [BoxRec](http://boxrec.com) and return it in JSON format.
The purpose of this project is to act as an API for BoxRec.

## Installation

This project is written in [Node](http://nodejs.org).  Currently this project supports Node 8-10.

```javascript
npm install boxrec --save
```
or 
```
yarn add boxrec
```

## Quick Start
```javascript
const boxrec = require("boxrec").default;
```
or 
```javascript
import boxrec from "boxrec";
```

use credentials to log into BoxRec and then use any of the [methods](https://github.com/boxing/boxrec#methods-how-to-use) below

example:

```javascript
await boxrec.login(BOXREC_USERNAME, BOXREC_PASSWORD);
await boxrec.getPersonById(352);
```

## How to contribute

[Details on how to help can be found here](https://github.com/boxing/boxrec/blob/master/CONTRIBUTING.md)

## Documentation

[Additional documentation](https://boxing.github.io/boxrec)

Note: At this time there may be some minor inconsistencies in the documentation compared to what's published to NPM.  
This is planned on being resolved.

## Methods (How to use)

### [login](https://boxing.github.io/boxrec/classes/boxrec.html#login)
##### logs the user into BoxRec
To use this properly, it requires a login to BoxRec.  BoxRec supplies additional information when logged in

⚠ BoxRec does not support HTTPS.  More can be read below in the [Security Requirements](https://github.com/boxing/boxrec/tree/README-updates#security-requirements) section

```javascript
try {
    // at this point in the project release the boxrec object only supports the one log in 
    await boxrec.login(BOXREC_USERNAME, BOXREC_PASSWORD);
    // successfully logged in
} catch (e) {
    // error occurred logging in
}
```

### [getPersonById](https://boxing.github.io/boxrec/classes/boxrec.html#getpersonbyid)
##### Get profile by BoxRec ID
Using the [BoxRec global ID](#globalId), retrieve all information about a person.

[Output:](https://boxing.github.io/boxrec/interfaces/boxrecprofile.html)
```javascript
const gennadyGolovkin = await boxrec.getPersonById(356831);
console.log(gennadyGolovkin.name); // Gennady Golovkin
console.log(gennadyGolovkin.division); // middleweight
console.log(gennadyGolovkin.titlesHeld); // currently held titles
console.log(gennadyGolovkin.otherInfo); // other info that couldn't be categorized
console.log(gennadyGolovkin.suspended); // will tell if boxer is currently suspended
console.log(gennadyGolovkin.bouts); // list of bouts
console.log(gennadyGolovkin.bouts[37].opponent.name); // Saul Alvarez

// other profiles
// we optionally specify the `role` as some people have multiple roles
boxrec.getPersonById(401615, BoxrecRole.judge); // judge CJ Ross
```

### [getPeopleByName](https://boxing.github.io/boxrec/classes/boxrec.html#getpeoplebyname)
##### Search people on BoxRec by name
Returns a generator which will makes individual calls, returns differ depending on the profile type 

[Output:](https://boxing.github.io/boxrec/interfaces/boxrecprofile.html)
```javascript
// by default it picks active/inactive boxers
const floyds = await boxrec.getPeopleByName("Floyd", "Mayweather");
let boxer = await floyds.next();
console.log(boxer.value); // is Floyd Mayweather Sr. object

boxer = await floyds.next();
console.log(boxer.value); // is Floyd Mayweather Jr. object
```

### [getPeopleByLocation](https://boxing.github.io/boxrec/classes/boxrec.html#getpeoplebylocation)
##### Search people by location

```javascript
await boxrec.getPeopleByLocation({
    country: Country.USA,
    role: BoxrecRole.boxer,
}, 20); // `20` is the search offset.  All endpoints that support `offset` on BoxRec should be supported in this package
```

### [getEventsByLocation](https://boxing.github.io/boxrec/classes/boxrec.html#geteventsbylocation)
##### Search events by location

```javascript
await boxrec.getEventsByLocation({
    country: Country.USA,
    year: 2017,
});
```

### [getSchedule](https://boxing.github.io/boxrec/classes/boxrec.html#getschedule)
##### Returns schedule information by country code, television, and/or division

```javascript
await boxrec.getSchedule({
    countryCode: Country.Canada,
});
```

### [getVenueById](https://boxing.github.io/boxrec/classes/boxrec.html#getvenuebyid)
##### Returns venue information and events that occurred there

```javascript
await boxrec.getVenueById(38555);
```

### [search](https://boxing.github.io/boxrec/classes/boxrec.html#search)
##### Search boxers by name
Following BoxRec's form format

```javascript
const searchResults = await boxrec.search({
    first_name: "Floyd",
    last_name: "Mayweather",
});
console.log(searchResults[1]);
```

[Output:](https://boxing.github.io/boxrec/interfaces/boxrecsearch.html)
```json
    {
        "id": 352,
        "name": "Floyd Mayweather Jr",
        "alias": "Money / Pretty Boy",
        "record": {
            "draw": 0,
            "loss": 0,
            "win": 50
        },
        "last6": ["win", "win", "win", "win", "win", "win"],
        "division": "welterweight",
        "career": [1996, 2017],
        "residence": {
            "id": 20388,
            "town": "Las Vegas",
            "region": "NV",
            "country": "US"
        }
    }
});
```

### [getChampions](https://boxing.github.io/boxrec/classes/boxrec.html#getchampions)
##### Returns a list of champions

[Output:](https://boxing.github.io/boxrec/classes/boxrecpagechampions.html)
```javascript
const champions = await boxrec.getChampions();
champions.getByWeightClass().heavyweight.IBF;
```

### [getEventById](https://boxing.github.io/boxrec/classes/boxrec.html#geteventbyid)
##### Returns event information

```javascript
const event = await boxrec.getEventById(751017);
```

[Output:](https://boxing.github.io/boxrec/classes/boxrecpageevent.html)
```json
{"date": "2017-09-16",
 "commission": "Nevada Athletic Commission",
 "matchmaker":
   [ {"id": 422440,"name": "Alex Camponovo" },
     {"id": 500179,"name": "Roberto Diaz" },
     {"id": 495527,"name": "Tom Loeffler" } ],
 "location":
   {"location": {"town": "Las Vegas","id": 20388,"region": "Nevada","country": "USA" },
    "venue": {"id": 246559,"name": "T-Mobile Arena" } },
 "promoter":
   [ {"id": 8253,
      "company": "Golden Boy Promotions",
      "name": "Oscar De La Hoya" },
     {"id": 495527,"company": "K2 Promotions","name": "Tom Loeffler" },
     {"id": 413083,"company": "Banner Promotions","name": "Art Pelullo" } ],
 "television":
   [ "USA HBO PPV",
     "Latin America", 
     "Canal Space",
     "Panama RPC Channel 4",
     "Australia Main Event",
     "Mexico Televisa" ],
 "bouts":
   [ {"firstBoxer": [Object],
      "firstBoxerLast6": [Array],
      "firstBoxerRecord": [Object],
      "firstBoxerWeight": 160,
      "secondBoxer": [Object],
      "secondBoxerLast6": [Array],
      "secondBoxerRecord": [Object],
      "secondBoxerWeight": 160,
      "titles": [Array],
      "referee": [Object],
      "judges": [Array],
      "rating": 100,
      "result": [Array],
      "links": [Object],
...
```

### [getDate](https://boxing.github.io/boxrec/classes/boxrec.html#getdate)
##### Returns events listed for that date

```javascript
await boxrec.getDate("2018-08-21");
```


### [getBoutById](https://boxing.github.io/boxrec/classes/boxrec.html#getboutbyid)
##### Returns detailed information on a single bout

```javascript
await boxrec.getBoutById("726555/2037455");
```

### [getRatings](https://boxing.github.io/boxrec/classes/boxrec.html#getratings)
##### Get ratings
Following BoxRec's form format

```javascript
const ratings = await boxrec.getRatings({
   "division": "Welterweight",
   "sex": "M",
   "status": "a"
});
console.log(ratings);
```

[Output:](https://boxing.github.io/boxrec/classes/boxrecpageratings.html)
```javascript
    {
       "id": 629465,
       "name": 'Errol Spence Jr',
       "points": 555,
       "rating": 100,
       "age": 28,
       "record": {
           "draw": 0,
           "loss": 0,
           "win": 23
        },
       "last6": ['win', 'win', 'win', 'win', 'win', 'win'],
       "stance": 'southpaw',
       "residence": {
           "id": 43387,
           "town": 'Desoto',
           "region": 'TX',
           "country": 'US'
        },
       "division": null
    };
```

### [getTitleById](https://boxing.github.io/boxrec/classes/boxrec.html#gettitlebyid)
##### Get title information including all bouts that occurred for this title
```javascript
// WBC Middleweight information
// to get this parameter, the link is on a boxer's profile
await boxrec.getTitleById("6/Middleweight");
````

### [getTitles](https://boxing.github.io/boxrec/classes/boxrec.html#gettitles)
```javascript
await boxrec.getTitles({
    bout_title: 322,
    division: WeightDivisionCapitalized.welterweight,
})
```

### [getBoxerPDF](https://boxing.github.io/boxrec/classes/boxrec.html#getboxerpdf)
##### Return/save the PDF version of a BoxRec boxer profile
```javascript
await boxrec.getBoxerPDF(555); // returns the PDF information
await boxrec.getBoxerPDF(555, "./profile"); // saves the PDF to "./profile/555.pdf"
await boxrec.getBoxerPDF(555, "./profile", "foo.pdf); // saves the PDF to "./profile/foo.pdf"
```

### [getBoxerPrint](https://boxing.github.io/boxrec/classes/boxrec.html#getboxerprint)
##### Return/save the print version of a BoxRec boxer profile
Follows the exact same format as [getBoxerPDF](https://boxing.github.io/boxrec/classes/boxrec.html#getboxerpdf) method
```javascript
await boxrec.getBoxerPrint(555); 
```

### [watch](https://boxing.github.io/boxrec/classes/boxrec.html#watch)
##### Add the boxer to the user's watch list
```javascript
const isWatched = await boxrec.watch(555); 
```

### [unwatch](https://boxing.github.io/boxrec/classes/boxrec.html#unwatch)
##### Remove the boxer from the user's watch list
```javascript
const isRemoved = await boxrec.unwatch(555);
```

### [getWatched](https://boxing.github.io/boxrec/classes/boxrec.html#getwatched)
##### Return an array of boxers that the user is watching
```javascript
await boxrec.getWatched(); 
```

## Roadmap

Last updated 2019-04-13

- [ ] Added 2019-04-13: [Get E2E testing working in CI](https://github.com/boxing/boxrec/issues/32)

- [ ] Added 2019-04-13: Documentation should not be part of commits.  Pull requests to only contain source changes

- [ ] Added 2019-04-13: Prepare for Dockerization

- [ ] Added 2019-04-13: All data accessible by Docker package

- [ ] Added 2019-04-13: Changes to [boxrec-requests](https://github.com/boxing/boxrec-requests) should trigger builds to ensure functionality does not break

- [ ] Added 2019-04-13: Changes to this package should trigger builds in upcoming Docker project

- [ ] Added 2019-04-13: Get to and keep a "A" maintainability in [Code Climate](https://codeclimate.com/github/boxing/boxrec)

- [ ] Added 2019-04-13: Separate typings into typings registry

- [ ] Added 2019-04-13: Reduce package size.  Separate typings will greatly help

- [ ] Added 2019-04-13: Make sure all typings work with external projects that use this package

- [ ] Added 2019-04-13: Master branch should be latest version in NPM

## Security Requirements

### Non HTTPs requests

 BoxRec does not support HTTPS.  Communication between the Node server and BoxRec is [insecure](http://www.stealmylogin.com/).  
This is not a flaw in the package design but a design flaw in BoxRec.


## Questions

<a name="globalId">**What and where is the BoxRec global ID?**</a>

The BoxRec global ID or ID is the unique ID of the person, event, bout, etc.  It can be found in the URL bar.  For people it can also be found on their page.

examples:
  
(Person) Vasiliy Lomachenko - http://boxrec.com/en/boxer/659771.  The BoxRec global ID is `659771`.

(Bout) Terence Crawford vs. Amir Khan - http://boxrec.com/en/event/778793/2299385.  The BoxRec bout ID is `778793/2299385`

(Event) Golden Boy May 4th 2019 Event - http://boxrec.com/en/event/781894.  The BoxRec event ID is `781894`

<a name="globalIdInconsistencies">**Why is there global ID and ID?**</a>

I took the safe approach and assumed that there may be some difference between the two.  There doesn't seem to be but better
safe than sorry.

<a name="isUsingThisSoftwareLegal">**Is using this software legal?**</a>

When this software was initially written, the [Terms and Conditions](http://boxrec.com/en/terms_conditions) on BoxRec did not include anything about [web scraping](https://en.wikipedia.org/wiki/Web_scraping).

BoxRec had updated their [Terms and Conditions](http://boxrec.com/en/terms_conditions) sometime in the middle of 2018 to include that you may not use software to extract data from BoxRec.

[Web scraping](https://en.wikipedia.org/wiki/Web_scraping) on wikipedia states under legal issues _"The legality of web scraping varies across the world. In general, web scraping may be against the terms of use of some websites, but the enforceability of these terms is unclear"._

Conclusion: It is unclear.  What you do with this package though could very well be illegal.

## Note
Not affiliated with the website [BoxRec](http://www.boxrec.com)
