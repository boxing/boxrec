# BoxRec
[![CircleCI](https://circleci.com/gh/boxing/boxrec.svg?style=svg)](https://circleci.com/gh/boxing/boxrec) 
[![Coverage Status](https://coveralls.io/repos/github/boxing/boxrec/badge.svg?branch=master)](https://coveralls.io/github/boxing/boxrec?branch=master)  
[![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/1643/badge)](https://bestpractices.coreinfrastructure.org/projects/1643) 
[![npm version](https://badge.fury.io/js/boxrec.svg)](https://badge.fury.io/js/boxrec)
[![DeepScan grade](https://deepscan.io/api/teams/3514/projects/5187/branches/40336/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=3514&pid=5187&bid=40336)
[![Known Vulnerabilities](https://snyk.io/test/github/boxing/boxrec/badge.svg?targetFile=package.json)](https://snyk.io/test/github/boxing/boxrec?targetFile=package.json)

This project allows you to query information from [BoxRec](http://boxrec.com) and return it in JSON format.
The purpose of this project is to act as an unofficial API for BoxRec.  This project is not affiliated with BoxRec.

> [!WARNING]  
> A few years ago a lot of time was spent on this project, but not so much these days.  With the changes that go into BoxRec, it is always a game of
cat and mouse when it comes to keeping things working.  Do not expect this package to continuously work.
> 
> The current status of this project is that it is **_not working_**, or working very poorly. An attempt was made to use Puppeteer in headless mode
> to bypass captchas but it's not working well.  [Read more here](https://github.com/boxing/boxrec/issues/299#issuecomment-1311691724).
> Any help devising a solution to unblock this project would be appreciated. The landscape has changed since
> last attempted (2022) so maybe a solution is easier is readily available.

> [!NOTE]
> If you do find issues, please [raise an issue](https://github.com/boxing/boxrec/issues) so others are aware and so they can be triaged.

## Installation

This project is written in [Node](http://nodejs.org).  Currently this project supports Node 8+.

```javascript
npm install boxrec --save
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
try {
  const cookies = await boxrec.login(BOXREC_USERNAME, BOXREC_PASSWORD);
  // successfully logged in
} catch (e) {
  // error occurred logging in
}
```

## Methods

Please read the [documentation](https://boxrec-npm-docs.s3.us-east-2.amazonaws.com/master/classes/boxrec.html) on how to use these methods

`getBoutById`
`getBoxerPDF`
`getBoxerPrint`
`getChampions`
`getDate`
`getEventById`
`getEventsByLocation`
`getPeopleByLocation`
`getPeopleByName`
`getPersonById`
`getRatings`
`getResults`
`getSchedule`
`getTitleById`
`getTitles`
`getVenueById`
`getWatched`
`login`
`search`
`unwatch`
`watch`

The return values are a class instance that can parse the data.  To return the entire JSON object, use the `output` accessor.

```javascript
const boxer = await boxrec.getPersonById(352);
const {output} = boxer;
````

## How to contribute

[Details on how to help can be found here](https://github.com/boxing/boxrec/blob/master/CONTRIBUTING.md)

## Additional Documentation

[Latest npm published (master)](https://boxrec-npm-docs.s3.us-east-2.amazonaws.com/master/index.html)


This [link](https://boxrec-npm-docs.s3.us-east-2.amazonaws.com/master/classes/boxrec.html) shows all the methods, the parameters and the expected response

## Security Requirements

## Questions

<a name="globalId">**What and where is the BoxRec global ID?**</a>

The BoxRec global ID or ID is the unique ID of the person, event, bout, etc.  It can be found in the URL bar.  For people it can also be found on their page.

examples:
  
(Person) Vasiliy Lomachenko - http://boxrec.com/en/boxer/659771.  The BoxRec global ID is `659771`.

(Bout) Terence Crawford vs. Amir Khan - http://boxrec.com/en/event/778793/2299385.  The BoxRec bout ID is `778793/2299385`

(Event) Golden Boy May 4th 2019 Event - http://boxrec.com/en/event/781894.  The BoxRec event ID is `781894`

<a name="globalIdInconsistencies">**Why is there global ID and ID?**</a>

I took the safe approach and assumed that there may be some difference between the two.

<a name="isUsingThisSoftwareLegal">**Is using this software legal?**</a>

When this software was initially written, the [Terms and Conditions](http://boxrec.com/en/terms_conditions) on BoxRec did not include anything about [web scraping](https://en.wikipedia.org/wiki/Web_scraping).

BoxRec had updated their [Terms and Conditions](http://boxrec.com/en/terms_conditions) sometime in the middle of 2018 to include that you may not use software to extract data from BoxRec.

[Web scraping](https://en.wikipedia.org/wiki/Web_scraping) on wikipedia states under legal issues _"The legality of web scraping varies across the world. In general, web scraping may be against the terms of use of some websites, but the enforceability of these terms is unclear"._

Conclusion: It is unclear.  What you do with this package though could very well be illegal.
