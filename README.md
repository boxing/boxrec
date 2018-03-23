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

Boxrec has a limit on requests if you aren't logged in.
Although you can make requests without logging in, it's suggested to register a user to prevent issues using this.

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

The following getters are supported:

| Key           | Boxrec Text   |
| ------------- |---------------|
| name          | ----          |
| globalId      | global ID     |
| role          | role          |
| rating        | rating        |
| ranking       | ranking       |
| vadacbp       | VADA CBP      |
| bouts         | bouts         |
| rounds        | rounds        |
| KOs           | KOs           |
| titlesHeld    | titles held   |
| birthName     | birth name    |
| alias         | alias         |
| born          | born          |
| nationality   | nationality   |
| debut         | debut         |
| division      | division      |
| reach         | reach         |
| residence     | residence     |
| birthPlace    | birthPlace    |

## Note
Not affiliated with the website [boxrec](http://www.boxrec.com)
