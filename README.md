# Boxrec 
[![Build Status](https://travis-ci.org/boxing/boxrec.svg?branch=master)](https://travis-ci.org/boxing/boxrec) [![Coverage Status](https://coveralls.io/repos/github/boxing/boxrec/badge.svg?branch=master)](https://coveralls.io/github/boxing/boxrec?branch=master) [![dependencies Status](https://david-dm.org/boxing/boxrec/status.svg)](https://david-dm.org/boxing/boxrec) [![devDependencies Status](https://david-dm.org/boxing/boxrec/dev-status.svg)](https://david-dm.org/boxing/boxrec?type=dev) [![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/1643/badge)](https://bestpractices.coreinfrastructure.org/projects/1643) [![npm version](https://badge.fury.io/js/boxrec.svg)](https://badge.fury.io/js/boxrec)

This project allows you to query information from [Boxrec](http://boxrec.com) and return it in JSON format.

## Installation

This project is written in [Node](http://nodejs.org).

`yarn add boxrec`

or

`npm install boxrec --save`

## Usage
`
const boxrec = require("boxrec");
`

#### Logging In

This requires a login to properly function.
The profileTable although doesn't appear to change, the number of columns in the bouts does change and this is set up to expect all columns.

Note: Boxrec does not support HTTPS

```javascript
boxrec.login(username, password)
.then(() => {
    // successfully logged in
})
.catch(error => {});
```

#### Get boxer profile
Using the Boxrec Boxer ID, retrieve all information about a boxer.
```javascript
boxrec.getBoxerById(356831)
.then(boxer => {
    console.log(boxer.name); // Gennady Golovkin
    console.log(boxer.division); // middleweight
    console.log(boxer.titlesHead); // [International Boxing Organization World Middleweight Title, ...];
    console.log(boxer.otherInfo); // other info that couldn't be categorized
    console.log(boxer.bouts); // list of bouts
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
| titlesHeld       |
| vadacbp          |

#### Get ratings

Following Boxrec's form format

```javascript
boxrec.getRatings({
    division: "Welterweight",
    sex: "M",
    status: "a"
}).then(ratings => {
    console.log(ratings[1]);
});
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

#### Search boxers

Following Boxrec's form format

```javascript
boxrec.search({
    first_name: "Floyd",
    last_name: "Mayweather",
}).then(searchResults => {
    console.log(searchResults[1]); 
});
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

## Note
Not affiliated with the website [boxrec](http://www.boxrec.com)
