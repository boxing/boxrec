# Boxrec
[![Build Status](https://travis-ci.org/boxing/boxrec.svg?branch=master)](https://travis-ci.org/boxing/boxrec) [![Coverage Status](https://coveralls.io/repos/github/boxing/boxrec/badge.svg?branch=master)](https://coveralls.io/github/boxing/boxrec?branch=master) [![dependencies Status](https://david-dm.org/boxing/boxrec/status.svg)](https://david-dm.org/boxing/boxrec) [![devDependencies Status](https://david-dm.org/boxing/boxrec/dev-status.svg)](https://david-dm.org/boxing/boxrec?type=dev) [![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/1643/badge)](https://bestpractices.coreinfrastructure.org/projects/1643) [![npm version](https://badge.fury.io/js/boxrec.svg)](https://badge.fury.io/js/boxrec)

This project allows you to query information from [BoxRec](http://boxrec.com) and return it in JSON format.
The purpose of this project is to act as an API for BoxRec.

It allows you to retrieve the following information:

- Boxers (by id)
- Events (by id)
- List of Champions (by weight class and by sanctioning body)
- Search boxers (by name)
- Ratings (or Rankings)

## Installation

This project is written in [Node](http://nodejs.org).

`yarn add boxrec`

or

`npm install boxrec --save`

## Usage
`
const boxrec = require("boxrec");
`

## How to contribute

[Details on how to help can be found here](https://github.com/boxing/boxrec/blob/master/CONTRIBUTING.md)

## How to use

#### Logging In

This requires a login to properly function.
The profileTable although doesn't appear to change, the number of columns in the bouts does change and this is set up to expect all columns.

Note: BoxRec does not support HTTPS

```javascript
boxrec.login(username, password)
.then(() => {
    // successfully logged in
})
.catch(error => {});
```

#### Get boxer profile by BoxRec ID
Using the BoxRec Boxer ID, retrieve all information about a boxer.
```javascript
boxrec.getBoxerById(356831)
.then(boxer => {
    console.log(boxer.name); // Gennady Golovkin
    console.log(boxer.division); // middleweight
    console.log(boxer.titlesHeld); // [International Boxing Organization World Middleweight Title, ...];
    console.log(boxer.otherInfo); // other info that couldn't be categorized
    console.log(boxer.bouts); // list of bouts
    console.log(boxer.suspensions); // list of suspensions
    console.log(boxer.bouts[0].opponent.name); // Saul Alvarez
});
```

the following are supported:

| Key              |
| -----------------|
| alias            |
| birthName        |
| birthPlace       |
| born             |
| bouts            |
| debut            |
| division         |
| globalId         |
| hasBoutScheduled |
| KOs              |
| name             |
| nationality      |
| numberOfBouts    |
| otherInfo        |
| ranking          |
| rating           |
| reach            |
| residence        |
| role             |
| rounds           |
| stance           |
| suspensions      |
| titlesHeld       |
| vadacbp          |

#### Search boxers by name
Returns the same object as `getBoxerById`

```javascript
const floyds = await boxrec.getBoxersByName("Floyd", "Mayweather");
let boxer = await floyds.next();
console.log(boxer.value); // is Floyd Mayweather Sr. object

boxer = await floyds.next();
console.log(boxer.value); // is Floyd Mayweather Jr. object

// or using Promises
floyds.next().then(boxer => console.log(boxer.value));
```

#### Search boxers
Following BoxRec's form format

```javascript
boxrec.search({
    first_name: "Floyd",
    last_name: "Mayweather",
}).then(searchResults => console.log(searchResults[1]));
```    

Output:
```javascript
    {
        id: 352,
        name: 'Floyd Mayweather Jr',
        alias: 'Money / Pretty Boy',
        record: {
            draw: 0,
            loss: 0,
            win: 50
        },
        last6: ['win', 'win', 'win', 'win', 'win', 'win'],
        division: 'welterweight',
        career: [1996, 2017],
        residence: {
            id: 20388,
            town: 'Las Vegas',
            region: 'NV',
            country: 'US'
        }
    }
});
```

#### Get champions

```javascript
boxrec.getChampions()
.then(champions => {
    champions.getByWeightClass().heavyweight.IBF; // Anthony Joshua
});
```

#### Get event

```javascript
boxrec.getEventById(751017)
.then(event => console.log(event));
```

Output:
```javascript
{ date: '2017-09-16',
  commission: 'Nevada Athletic Commission',
  matchmaker:
   [ { id: 422440, name: 'Alex Camponovo' },
     { id: 500179, name: 'Roberto Diaz' },
     { id: 495527, name: 'Tom Loeffler' } ],
  location:
   { location: { town: 'Las Vegas', id: 20388, region: 'Nevada', country: 'USA' },
     venue: { id: 246559, name: 'T-Mobile Arena' } },
  promoter:
   [ { id: 8253,
       company: 'Golden Boy Promotions',
       name: 'Oscar De La Hoya' },
     { id: 495527, company: 'K2 Promotions', name: 'Tom Loeffler' },
     { id: 413083, company: 'Banner Promotions', name: 'Art Pelullo' } ],
  television:
   [ 'USA HBO PPV',
     'Latin America: Canal Space',
     'Panama RPC Channel 4',
     'Australia Main Event',
     'Mexico Televisa' ],
  bouts:
   [ { firstBoxer: [Object],
       firstBoxerLast6: [Array],
       firstBoxerRecord: [Object],
       firstBoxerWeight: 160,
       secondBoxer: [Object],
       secondBoxerLast6: [Array],
       secondBoxerRecord: [Object],
       secondBoxerWeight: 160,
       titles: [Array],
       referee: [Object],
       judges: [Array],
       rating: 100,
       result: [Array],
       links: [Object],
...
```

#### Get ratings
Following BoxRec's form format

```javascript
boxrec.getRatings({
    division: "Welterweight",
    sex: "M",
    status: "a"
}).then(ratings => console.log(ratings[1]));
```

Output:
```javascript
    {
        id: 629465,
        name: 'Errol Spence Jr',
        points: 555,
        rating: 100,
        age: 28,
        record: {
            draw: 0,
            loss: 0,
            win: 23
        },
        last6: ['win', 'win', 'win', 'win', 'win', 'win'],
        stance: 'southpaw',
        residence: {
            id: 43387,
            town: 'Desoto',
            region: 'TX',
            country: 'US'
        },
        division: null
    };
```

## Note
Not affiliated with the website [BoxRec](http://www.boxrec.com)
