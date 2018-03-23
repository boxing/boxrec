# Boxrec 
[![Build Status](https://travis-ci.org/boxing/boxrec.svg?branch=master)](https://travis-ci.org/boxing/boxrec) [![Coverage Status](https://coveralls.io/repos/github/boxing/boxrec/badge.svg?branch=master)](https://coveralls.io/github/boxing/boxrec?branch=master) [![dependencies Status](https://david-dm.org/boxing/boxrec/status.svg)](https://david-dm.org/boxing/boxrec) [![devDependencies Status](https://david-dm.org/boxing/boxrec/dev-status.svg)](https://david-dm.org/boxing/boxrec?type=dev) [![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/1643/badge)](https://bestpractices.coreinfrastructure.org/projects/1643) [![npm version](https://badge.fury.io/js/boxrec.svg)](https://badge.fury.io/js/boxrec)
---
## Installation
`yarn add boxrec -D`

or

`npm install boxrec --save-dev`

## Usage
`
const boxrec = require("boxrec");
`

#### Logging In

This requires a login to properly function.
The profileTable although doesn't appear to change, the number of columns in the bouts does change and this is set up to expect all columns.

Note: Boxrec does not support HTTPS

```
boxrec.login(username, password)
.then(() => {
    // successfully logged in
})
.catch(error => {});
```

#### Get boxer information
```
boxrec.getBoxerById(356831)
.then(boxer => {
    console.log(boxer.name) // Gennady Golovkin
    console.log(boxer.division) // middleweight
    
    // other info that couldn't be categorized
    console.log(boxer.otherInfo)
})
```

You can get the following:

| Key              |
| -----------------|
| name             |
| globalId         |
| role             |
| rating           |
| ranking          |
| vadacbp          |
| bouts            |
| rounds           |
| KOs              |
| titlesHeld       |
| birthName        |
| alias            |
| born             |
| nationality      |
| debut            |
| division         |
| reach            |
| residence        |
| birthPlace       |
| numberOfBouts    |
| hasBoutScheduled |

## Note
Not affiliated with the website [boxrec](http://www.boxrec.com)
