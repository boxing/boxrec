# BoxRec
[![CircleCI](https://circleci.com/gh/boxing/boxrec.svg?style=svg)](https://circleci.com/gh/boxing/boxrec) [![Coverage Status](https://coveralls.io/repos/github/boxing/boxrec/badge.svg?branch=master)](https://coveralls.io/github/boxing/boxrec?branch=master) [![dependencies Status](https://david-dm.org/boxing/boxrec/status.svg)](https://david-dm.org/boxing/boxrec) [![devDependencies Status](https://david-dm.org/boxing/boxrec/dev-status.svg)](https://david-dm.org/boxing/boxrec?type=dev) [![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/1643/badge)](https://bestpractices.coreinfrastructure.org/projects/1643) [![npm version](https://badge.fury.io/js/boxrec.svg)](https://badge.fury.io/js/boxrec)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/9618d7ebf6454a638f0357406d1e7649)](https://www.codacy.com/app/mikedidomizio/boxrec?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=boxing/boxrec&amp;utm_campaign=Badge_Grade)
[![DeepScan grade](https://deepscan.io/api/teams/3514/projects/5187/branches/40336/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=3514&pid=5187&bid=40336)
[![Known Vulnerabilities](https://snyk.io/test/github/boxing/boxrec/badge.svg?targetFile=package.json)](https://snyk.io/test/github/boxing/boxrec?targetFile=package.json)

This project allows you to query information from [BoxRec](http://boxrec.com) and return it in JSON format.
The purpose of this project is to act as an API for BoxRec.

## :warning: Notice before using this package :warning:

BoxRec has put in some work that will throw captchas if making too many quick requests and IP block you if you trip their firewall.  For the sole purpose of blocking packages like this, which is understandable.  But at the cost of making it a worse UX for actual people.  If you use this project you put yourself at risk of being IP banned by BoxRec for some time, not by user but by IP.  This is automatic from their firewall and not something they do manually.  There are ways to get by this but nothing to discuss about at this time.  Use this package for learning purposes at this time.

## Installation

This project is written in [Node](http://nodejs.org).  Currently this project supports Node 8-10. 

```javascript
npm install boxrec --save
```
or 
```javascript
yarn add boxrec
```

## Quick Start
```javascript
const boxrec = require("boxrec").Boxrec;
```
or 
```javascript
import {Boxrec as boxrec} from "boxrec";
```

Use credentials to log into BoxRec and then use any of the [methods](https://github.com/boxing/boxrec#methods-how-to-use) below.
Pass the cookie into all methods.

example:

```javascript
const cookieJar = await boxrec.login(BOXREC_USERNAME, BOXREC_PASSWORD);
await boxrec.getPersonById(cookieJar, 352);
```

## How to contribute

[Details on how to help can be found here](https://github.com/boxing/boxrec/blob/master/CONTRIBUTING.md)

## Additional Documentation

[Latest npm published (master)](https://boxrec-npm-docs.s3.us-east-2.amazonaws.com/master/index.html)

## Methods (How to use)

### login
#### logs the user into BoxRec
To use this properly, it requires a login to BoxRec.  BoxRec supplies additional information when logged in

```javascript
try {
    const cookieJar = await boxrec.login(BOXREC_USERNAME, BOXREC_PASSWORD);
    // successfully logged in
} catch (e) {
    // error occurred logging in
}
```

### getPersonById
#### Get profile by BoxRec ID
Using the [BoxRec global ID](#globalId), retrieve all information about a person.

Output:
```javascript
const gennadyGolovkin = await boxrec.getPersonById(cookieJar, 356831);
console.log(gennadyGolovkin.name); // Gennady Golovkin
console.log(gennadyGolovkin.division); // middleweight
console.log(gennadyGolovkin.titlesHeld); // currently held titles
console.log(gennadyGolovkin.otherInfo); // other info that couldn't be categorized
console.log(gennadyGolovkin.suspended); // will tell if boxer is currently suspended
console.log(gennadyGolovkin.bouts); // list of bouts
console.log(gennadyGolovkin.bouts[37].opponent.name); // Saul Alvarez

// other profiles
// we optionally specify the `role` as some people have multiple roles
boxrec.getPersonById(cookieJar, 401615, BoxrecRole.judge); // judge CJ Ross
```

### getPeopleByName
#### Search people on BoxRec by name
Returns a generator which will makes individual calls, returns differ depending on the profile type 

Output:
```javascript
// by default it picks active/inactive boxers
const floyds = await boxrec.getPeopleByName(cookieJar, "Floyd", "Mayweather");
let boxer = await floyds.next();
console.log(boxer.value); // is Floyd Mayweather Sr. object

boxer = await floyds.next();
console.log(boxer.value); // is Floyd Mayweather Jr. object
```

### getPeopleByLocation
#### Search people by location

```javascript
await boxrec.getPeopleByLocation(cookieJar, {
    country: Country.USA,
    role: BoxrecRole.boxer,
}, 20); // `20` is the search offset.  All endpoints that support `offset` on BoxRec should be supported in this package
```

### getEventsByLocation
#### Search events by location

```javascript
await boxrec.getEventsByLocation(cookieJar, {
    country: Country.USA,
    year: 2017,
});
```

### getSchedule
#### Returns schedule information by country code, television, and/or division

```javascript
await boxrec.getSchedule(cookieJar, {
    countryCode: Country.Canada,
});
```

### getVenueById
#### Returns venue information and events that occurred there

```javascript
await boxrec.getVenueById(cookieJar, 38555);
```

### search
#### Search boxers by name
Following BoxRec's form format

```javascript
const searchResults = await boxrec.search(cookieJar, {
    first_name: "Floyd",
    last_name: "Mayweather",
});
console.log(searchResults[1]); // Floyd Mayweather Jr.
```

Output:
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

### getChampions
#### Returns a list of champions

Output:
```javascript
const champions = await boxrec.getChampions(cookieJar);
champions.getByWeightClass().heavyweight.IBF;
```

### getEventById
#### Returns event information

```javascript
await boxrec.getEventById(cookieJar, 751017);
```

Output:
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

### getDate
#### Returns events listed for that date

```javascript
await boxrec.getDate(cookieJar, "2018-08-21");
```

### getBoutById
#### Returns detailed information on a single bout

```javascript
await boxrec.getBoutById(cookieJar, "726555/2037455");
```

### getRatings
#### Get ratings
Following BoxRec's form format

```javascript
await boxrec.getRatings(cookieJar, {
   "division": "Welterweight",
   "sex": "M",
   "status": "a"
});
```

Output:
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

### getTitleById
#### Get title information including all bouts that occurred for this title
```javascript
// WBC Middleweight information
// to get this parameter, the link is on a boxer's profile
await boxrec.getTitleById(cookieJar, "6/Middleweight");
````

### getTitles
```javascript
await boxrec.getTitles(cookieJar, {
    bout_title: 322,
    division: WeightDivisionCapitalized.welterweight,
})
```

### getBoxerPDF
#### Return/save the PDF version of a BoxRec boxer profile
```javascript
await boxrec.getBoxerPDF(cookieJar, 555); // returns the PDF information
await boxrec.getBoxerPDF(cookieJar, 555, "./profile"); // saves the PDF to "./profile/555.pdf"
await boxrec.getBoxerPDF(cookieJar, 555, "./profile", "foo.pdf); // saves the PDF to "./profile/foo.pdf"
```

### getBoxerPrint
#### Return/save the print version of a BoxRec boxer profile
Follows the exact same format as getBoxerPDF method
```javascript
await boxrec.getBoxerPrint(cookieJar, 555); 
```

### watch
#### Add the boxer to the user's watch list
```javascript
await boxrec.watch(cookieJar, 555); 
```

### unwatch
#### Remove the boxer from the user's watch list
```javascript
await boxrec.unwatch(cookieJar, 555);
```

### getWatched
#### Return an array of boxers that the user is watching
```javascript
await boxrec.getWatched(cookieJar); 
```

## Roadmap

Last updated 2019-04-30

-   [ ] Added 2019-04-13: [Get E2E testing working in CI](https://github.com/boxing/boxrec/issues/32)

-   [X] Added 2019-04-13: Documentation should not be part of commits.  Pull requests to only contain source changes

    Completed 2019-04-30 - Documentation pushed to S3

-   [ ] Added 2019-04-13: Prepare for Dockerization

-   [ ] Added 2019-04-13: All data accessible by Docker package

-   [ ] Added 2019-04-13: Changes to [boxrec-requests](https://github.com/boxing/boxrec-requests) should trigger builds to ensure functionality does not break

-   [ ] Added 2019-04-13: Changes to this package should trigger builds in upcoming Docker project

-   [X] Added 2019-04-13: Get to and keep a "A" maintainability in [Codacy](https://app.codacy.com/project/mikedidomizio/boxrec/dashboard)

    Completed in 2019

-   [ ] Added 2019-04-13: Separate typings into typings registry

-   [X] Added 2019-04-13: Reduce package size.  Separate typings will greatly help

    Completed 2019-04-30 - 1.30 MB to 48 KB

-   [ ] Added 2019-04-13: Make sure all typings work with external projects that use this package

-   [X] Added 2019-04-13: Master branch should be latest version in NPM

    Completed 2019-04-30 - Using Git Flow

## Security Requirements

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
