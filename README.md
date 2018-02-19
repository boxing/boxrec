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

Note: Boxrec does not support HTTPS, keep that in mind with passwords

```
boxrec.login(username, password)
.then(() => {
    // successfully logged in
})
.catch(error => {});
```

## Note
Not affiliated with the website [boxrec](http://www.boxrec.com)
