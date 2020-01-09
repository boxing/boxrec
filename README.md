# BoxRec
[![CircleCI](https://circleci.com/gh/boxing/boxrec.svg?style=svg)](https://circleci.com/gh/boxing/boxrec) [![Coverage Status](https://coveralls.io/repos/github/boxing/boxrec/badge.svg?branch=master)](https://coveralls.io/github/boxing/boxrec?branch=master) [![dependencies Status](https://david-dm.org/boxing/boxrec/status.svg)](https://david-dm.org/boxing/boxrec) [![devDependencies Status](https://david-dm.org/boxing/boxrec/dev-status.svg)](https://david-dm.org/boxing/boxrec?type=dev) [![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/1643/badge)](https://bestpractices.coreinfrastructure.org/projects/1643) [![npm version](https://badge.fury.io/js/boxrec.svg)](https://badge.fury.io/js/boxrec)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/9618d7ebf6454a638f0357406d1e7649)](https://www.codacy.com/app/mikedidomizio/boxrec?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=boxing/boxrec&amp;utm_campaign=Badge_Grade)
[![DeepScan grade](https://deepscan.io/api/teams/3514/projects/5187/branches/40336/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=3514&pid=5187&bid=40336)
[![Known Vulnerabilities](https://snyk.io/test/github/boxing/boxrec/badge.svg?targetFile=package.json)](https://snyk.io/test/github/boxing/boxrec?targetFile=package.json)

This project allows you to query information from [BoxRec](http://boxrec.com) and return it in JSON format.
The purpose of this project is to act as an API for BoxRec.

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

Additionally to get JSON output of all boxer data use `gennadyGolovkin.output`

Output:
```{
    "JSON": {
        "KOs": 35,
        "alias": "GGG",
        "birthName": "&#x413;&#x435;&#x43D;&#x43D;&#x430;&#x434;&#x438;&#x439; &#x413;&#x435;&#x43D;&#x43D;&#x430;&#x434;&#x44C;&#x435;&#x432;&#x438;&#x447; &#x413;&#x43E;&#x43B;&#x43E;&#x432;&#x43A;&#x438;&#x43D;",
        "birthPlace": "Karaganda, Kazakhstan",
        "born": "1982-04-08",
        "bouts": [
            {
                "date": "1 22 3",
                "firstBoxerRating": [
                    null,
                    null
                ],
                "firstBoxerWeight": 159.75,
                "judges": [
                    {
                        "id": 407667,
                        "name": "Joerg Ilinseer",
                        "scorecard": []
                    },
                    {
                        "id": 400941,
                        "name": "Heinrich Muehmert",
                        "scorecard": []
                    },
                    {
                        "id": 402345,
                        "name": "Herbert Urich",
                        "scorecard": []
                    }
                ],
                "links": {
                    "bio": 1091113,
                    "bout": "489773/1091113",
                    "event": 489773,
                    "other": []
                },
                "location": "Burg-Waechter Castello, Düsseldorf",
                "metadata": "  time: 1:28\n | <a href=\"/en/judge/407667\">Joerg Ilinseer</a> | <a href=\"/en/judge/400941\">Heinrich Muehmert</a> | <a href=\"/en/judge/402345\">Herbert Urich</a>\n<br>",
                "numberOfRounds": [
                    null,
                    null
                ],
                "outcome": "unknown",
                "rating": null,
                "referee": {
                    "id": null,
                    "name": null
                },
                "result": [
                    "unknown",
                    null,
                    null
                ],
                "secondBoxer": {
                    "id": null,
                    "name": null
                },
                "secondBoxerLast6": [],
                "secondBoxerRating": [
                    null,
                    null
                ],
                "secondBoxerRecord": {
                    "draw": null,
                    "loss": null,
                    "win": null
                },
                "secondBoxerWeight": null,
                "titles": []
            },
            ...
            ...
        ],
        "debut": "2006-05-06",
        "division": "middleweight",
        "globalId": 356831,
        "hasBoutScheduled": false,
        "height": [
            5,
            10.5,
            179
        ],
        "name": "Gennadiy Golovkin",
        "nationality": "Kazakhstan",
        "numberOfBouts": 42,
        "otherInfo": [
            [
                "career",
                "        \n        \n2006-2019\n"
            ]
        ],
        "picture": "https://boxrec.com/media/images/thumb/b/b9/GGG.jpg/200px-GGG.jpg",
        "ranking": [
            [
                2,
                1553
            ],
            [
                1,
                11
            ]
        ],
        "rating": 98,
        "reach": [
            70,
            178
        ],
        "residence": "Los Angeles, California, USA",
        "role": [
            {
                "id": 356831,
                "name": "Am Boxing"
            },
            {
                "id": 356831,
                "name": "proboxer"
            },
            {
                "id": 356831,
                "name": "promoter"
            }
        ],
        "rounds": 212,
        "stance": "orthodox",
        "status": "active",
        "suspended": null,
        "titlesHeld": [
            "International Boxing Organization World Middle Title",
            "International Boxing Federation World Middle Title"
        ],
        "vadacbp": false
    },
    "Response payload": {
        "EDITOR_CONFIG": {
            "text": "{\"KOs\":35,\"alias\":\"GGG\",\"birthName\":\"&#x413;&#x435;&#x43D;&#x43D;&#x430;&#x434;&#x438;&#x439; &#x413;&#x435;&#x43D;&#x43D;&#x430;&#x434;&#x44C;&#x435;&#x432;&#x438;&#x447; &#x413;&#x43E;&#x43B;&#x43E;&#x432;&#x43A;&#x438;&#x43D;\",\"birthPlace\":\"Karaganda, Kazakhstan\",\"born\":\"1982-04-08\",\"bouts\":[{\"date\":\"1 22 3\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":159.75,\"judges\":[{\"id\":407667,\"name\":\"Joerg Ilinseer\",\"scorecard\":[]},{\"id\":400941,\"name\":\"Heinrich Muehmert\",\"scorecard\":[]},{\"id\":402345,\"name\":\"Herbert Urich\",\"scorecard\":[]}],\"links\":{\"bio\":1091113,\"bout\":\"489773/1091113\",\"event\":489773,\"other\":[]},\"location\":\"Burg-Waechter Castello, Düsseldorf\",\"metadata\":\"  time: 1:28\n | <a href=\\\"/en/judge/407667\\\">Joerg Ilinseer</a> | <a href=\\\"/en/judge/400941\\\">Heinrich Muehmert</a> | <a href=\\\"/en/judge/402345\\\">Herbert Urich</a>\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":null,\"name\":null},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[]},{\"date\":\"6 9 0\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":160,\"judges\":[{\"id\":404165,\"name\":\"Arnold Golger\",\"scorecard\":[]},{\"id\":400941,\"name\":\"Heinrich Muehmert\",\"scorecard\":[]}],\"links\":{\"bio\":1113915,\"bout\":\"496173/1113915\",\"event\":496173,\"other\":[]},\"location\":\"Koenig Pilsener Arena, Oberhausen\",\"metadata\":\"  time: 1:10\n | <span>referee:</span> <a href=\\\"/en/referee/400937\\\">Arno Pokrandt</a><span> | </span><a href=\\\"/en/judge/404165\\\">Arnold Golger</a> | <a href=\\\"/en/judge/400941\\\">Heinrich Muehmert</a>\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":400937,\"name\":\"Arno Pokrandt\"},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[]},{\"date\":\"5 1 2\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":158.75,\"judges\":[],\"links\":{\"bio\":1117975,\"bout\":\"503202/1117975\",\"event\":503202,\"other\":[]},\"location\":\"Universum Gym, Wandsbek\",\"metadata\":\"  time: 3:00\n | <span>referee:</span> <a href=\\\"/en/referee/407668\\\">Frank Michael Maass</a>\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":407668,\"name\":\"Frank Michael Maass\"},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[]},{\"date\":\"1 10 0\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":157.75,\"judges\":[],\"links\":{\"bio\":1134923,\"bout\":\"505655/1134923\",\"event\":505655,\"other\":[]},\"location\":\"Kugelbake-Halle, Cuxhaven\",\"metadata\":\"  time: 3:00\n | <span>referee:</span> <a href=\\\"/en/referee/401426\\\">Iko Bebic</a>\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":401426,\"name\":\"Iko Bebic\"},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[]},{\"date\":\"9 4 2\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":160.5,\"judges\":[],\"links\":{\"bio\":1141707,\"bout\":\"506478/1141707\",\"event\":506478,\"other\":[]},\"location\":\"Brandberge Arena, Halle an der Saale\",\"metadata\":\"  time: 2:28\n | <span>referee:</span> <a href=\\\"/en/referee/400941\\\">Heinrich Muehmert</a>\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":400941,\"name\":\"Heinrich Muehmert\"},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[]},{\"date\":\"12 12 3\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":159.75,\"judges\":[],\"links\":{\"bio\":1156827,\"bout\":\"509251/1156827\",\"event\":509251,\"other\":[]},\"location\":\"Estrel Convention Center, Neukoelln\",\"metadata\":\"  time: 1:00\n\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":null,\"name\":null},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[]},{\"date\":\"10 9 4\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":162,\"judges\":[],\"links\":{\"bio\":1175893,\"bout\":\"519574/1175893\",\"event\":519574,\"other\":[]},\"location\":\"Kugelbake-Halle, Cuxhaven\",\"metadata\":\"  time: 3:00\n | <span>referee:</span> <a href=\\\"/en/referee/401122\\\">Manfred Kuechler</a>\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":401122,\"name\":\"Manfred Kuechler\"},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[]},{\"date\":\"19 3 1\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":158.75,\"judges\":[],\"links\":{\"bio\":1205567,\"bout\":\"526169/1205567\",\"event\":526169,\"other\":[]},\"location\":\"Fight Night Arena, Cologne\",\"metadata\":\"  time: 1:59\n | <span>referee:</span> <a href=\\\"/en/referee/401122\\\">Manfred Kuechler</a>\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":401122,\"name\":\"Manfred Kuechler\"},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[]},{\"date\":\"11 1 0\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":159,\"judges\":[{\"id\":401426,\"name\":\"Iko Bebic\",\"scorecard\":[78,74]},{\"id\":404165,\"name\":\"Arnold Golger\",\"scorecard\":[79,75]}],\"links\":{\"bio\":1219251,\"bout\":\"532272/1219251\",\"event\":532272,\"other\":[]},\"location\":\"Burg-Waechter Castello, Düsseldorf\",\"metadata\":\"<span>referee:</span> <a href=\\\"/en/referee/407668\\\">Frank Michael Maass</a> 78-74<span> | </span><a href=\\\"/en/judge/401426\\\">Iko Bebic</a> 79-75 | <a href=\\\"/en/judge/404165\\\">Arnold Golger</a> 78-74\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":407668,\"name\":\"Frank Michael Maass\"},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[]},{\"date\":\"15 8 0\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":160.5,\"judges\":[],\"links\":{\"bio\":1275746,\"bout\":\"545375/1275746\",\"event\":545375,\"other\":[]},\"location\":\"Sporthalle, Alsterdorf\",\"metadata\":\"  time: 2:04\n | <span>referee:</span> <a href=\\\"/en/referee/401426\\\">Iko Bebic</a>\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":401426,\"name\":\"Iko Bebic\"},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[]},{\"date\":\"20 3 0\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":159.75,\"judges\":[{\"id\":404165,\"name\":\"Arnold Golger\",\"scorecard\":[78,73]},{\"id\":401122,\"name\":\"Manfred Kuechler\",\"scorecard\":[78,73]}],\"links\":{\"bio\":1295951,\"bout\":\"548094/1295951\",\"event\":548094,\"other\":[]},\"location\":\"Burg-Waechter Castello, Düsseldorf\",\"metadata\":\"<span>referee:</span> <a href=\\\"/en/referee/400937\\\">Arno Pokrandt</a> 78-73<span> | </span><a href=\\\"/en/judge/404165\\\">Arnold Golger</a> 78-73 | <a href=\\\"/en/judge/401122\\\">Manfred Kuechler</a> 77-74\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":400937,\"name\":\"Arno Pokrandt\"},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[]},{\"date\":\"9 4 2\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":161,\"judges\":[],\"links\":{\"bio\":1302431,\"bout\":\"551907/1302431\",\"event\":551907,\"other\":[]},\"location\":\"Brandberge Arena, Halle an der Saale\",\"metadata\":\"  time: 0:26\n | <span>referee:</span> <a href=\\\"/en/referee/401426\\\">Iko Bebic</a>\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":401426,\"name\":\"Iko Bebic\"},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[]},{\"date\":\"13 9 1\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":161,\"judges\":[{\"id\":400972,\"name\":\"Ove Ovesen\",\"scorecard\":[80,72]},{\"id\":400872,\"name\":\"Soren Saugmann\",\"scorecard\":[80,72]},{\"id\":400876,\"name\":\"Torben Seemann Hansen\",\"scorecard\":[79,72]}],\"links\":{\"bio\":1320379,\"bout\":\"553871/1320379\",\"event\":553871,\"other\":[]},\"location\":\"Brondby Hallen, Brondby\",\"metadata\":\"<span>referee:</span> <a href=\\\"/en/referee/400878\\\">Hans Larsen</a><span> | </span><a href=\\\"/en/judge/400972\\\">Ove Ovesen</a> 80-72 | <a href=\\\"/en/judge/400872\\\">Soren Saugmann</a> 80-72 | <a href=\\\"/en/judge/400876\\\">Torben Seemann Hansen</a> 79-72\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":400878,\"name\":\"Hans Larsen\"},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[]},{\"date\":\"29 3 0\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":162,\"judges\":[{\"id\":42636,\"name\":\"Juergen Langos\",\"scorecard\":[]}],\"links\":{\"bio\":1366347,\"bout\":\"561684/1366347\",\"event\":561684,\"other\":[]},\"location\":\"Stadthalle, Rostock\",\"metadata\":\"  time: 3:00\n | <span>referee:</span> <a href=\\\"/en/referee/410776\\\">Timo Habighorst</a><span> | </span><a href=\\\"/en/judge/42636\\\">Juergen Langos</a>\n<br>cut\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":410776,\"name\":\"Timo Habighorst\"},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[]},{\"date\":\"35 7 1\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":159.75,\"judges\":[{\"id\":404165,\"name\":\"Arnold Golger\",\"scorecard\":[]},{\"id\":401122,\"name\":\"Manfred Kuechler\",\"scorecard\":[]}],\"links\":{\"bio\":1379288,\"bout\":\"566978/1379288\",\"event\":566978,\"other\":[]},\"location\":\"Burg-Waechter Castello, Düsseldorf\",\"metadata\":\"  time: 2:52\n | <span>referee:</span> <a href=\\\"/en/referee/42636\\\">Juergen Langos</a><span> | </span><a href=\\\"/en/judge/404165\\\">Arnold Golger</a> | <a href=\\\"/en/judge/401122\\\">Manfred Kuechler</a>\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":42636,\"name\":\"Juergen Langos\"},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[]},{\"date\":\"13 2 1\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":161.25,\"judges\":[],\"links\":{\"bio\":1397998,\"bout\":\"571538/1397998\",\"event\":571538,\"other\":[]},\"location\":\"König Palast, Krefeld\",\"metadata\":\"  time: 0:59\n | <span>referee:</span> <a href=\\\"/en/referee/401122\\\">Manfred Kuechler</a>\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":401122,\"name\":\"Manfred Kuechler\"},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[]},{\"date\":\"19 3 1\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":158.5,\"judges\":[{\"id\":411031,\"name\":\"Zoltan Enyedi\",\"scorecard\":[]},{\"id\":401660,\"name\":\"Dr Ruben M Garcia\",\"scorecard\":[]},{\"id\":401122,\"name\":\"Manfred Kuechler\",\"scorecard\":[]}],\"links\":{\"bio\":1431320,\"bout\":\"576185/1431320\",\"event\":576185,\"other\":[]},\"location\":\"Nuerburgring race track, Nuerburg\",\"metadata\":\"  time: 2:20\n | <span>referee:</span> <a href=\\\"/en/referee/401887\\\">Raul Caiz Sr</a><span> | </span><a href=\\\"/en/judge/411031\\\">Zoltan Enyedi</a> | <a href=\\\"/en/judge/401660\\\">Dr Ruben M Garcia</a> | <a href=\\\"/en/judge/401122\\\">Manfred Kuechler</a>\n<br><div class=\\\"titleColor\\\"><a href=\\\"/en/title/93/Middleweight\\\" class=\\\"titleLink\\\">vacant World Boxing Organisation Inter-Continental Middle Title</a></div>\n<br>Carvalho down in the 2nd round\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":401887,\"name\":\"Raul Caiz Sr\"},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[{\"id\":\"93/Middleweight\",\"name\":\"vacant World Boxing Organisation Inter-Continental Middleweight Title\"}]},{\"date\":\"10 0 0\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":162.5,\"judges\":[],\"links\":{\"bio\":1467905,\"bout\":\"587633/1467905\",\"event\":587633,\"other\":[]},\"location\":\"Sparkassen-Arena, Kiel\",\"metadata\":\"  time: 1:24\n | <span>referee:</span> <a href=\\\"/en/referee/407668\\\">Frank Michael Maass</a>\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":407668,\"name\":\"Frank Michael Maass\"},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[]},{\"date\":\"21 1 1\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":158,\"judges\":[{\"id\":401157,\"name\":\"Julio Cesar Alvarado\",\"scorecard\":[]},{\"id\":401343,\"name\":\"Gustavo Padilla\",\"scorecard\":[]},{\"id\":402849,\"name\":\"Guillermo Perez Pineda\",\"scorecard\":[]}],\"links\":{\"bio\":1521936,\"bout\":\"600494/1521936\",\"event\":600494,\"other\":[]},\"location\":\"Arena Roberto Duran, Panama City\",\"metadata\":\"  time: 0:58\n | <span>referee:</span> <a href=\\\"/en/referee/402805\\\">Russell Mora</a><span> | </span><a href=\\\"/en/judge/401157\\\">Julio Cesar Alvarado</a> | <a href=\\\"/en/judge/401343\\\">Gustavo Padilla</a> | <a href=\\\"/en/judge/402849\\\">Guillermo Perez Pineda</a>\n<br><div class=\\\"titleColor\\\"><a href=\\\"/en/title/41/Middleweight\\\" class=\\\"titleLink\\\">interim World Boxing Association World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/403326\\\">Miguel Prado</a>)</div>\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":402805,\"name\":\"Russell Mora\"},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[{\"id\":\"41/Middleweight\",\"name\":\"interim World Boxing Association World Middleweight Title\",\"supervisor\":{\"id\":403326,\"name\":\"Miguel Prado\"}}]},{\"date\":\"14 2 1\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":159.25,\"judges\":[{\"id\":401660,\"name\":\"Dr Ruben M Garcia\",\"scorecard\":[]},{\"id\":18102,\"name\":\"Terry O'Connor\",\"scorecard\":[]},{\"id\":400918,\"name\":\"Philippe Verbeke\",\"scorecard\":[]}],\"links\":{\"bio\":1550294,\"bout\":\"609714/1550294\",\"event\":609714,\"other\":[]},\"location\":\"Sport Complex “Daulet”, Nur-Sultan (Astana)\",\"metadata\":\"  time: 2:44\n | <span>referee:</span> <a href=\\\"/en/referee/400900\\\">Stanley Christodoulou</a><span> | </span><a href=\\\"/en/judge/401660\\\">Dr Ruben M Garcia</a> | <a href=\\\"/en/judge/18102\\\">Terry O&apos;Connor</a> | <a href=\\\"/en/judge/400918\\\">Philippe Verbeke</a>\n<br><div class=\\\"titleColor\\\"><a href=\\\"/en/title/41/Middleweight\\\" class=\\\"titleLink\\\">World Boxing Association World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/5654\\\">Jesper D Jensen</a>)</div>\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":400900,\"name\":\"Stanley Christodoulou\"},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[{\"id\":\"41/Middleweight\",\"name\":\"World Boxing Association World Middleweight Title\",\"supervisor\":{\"id\":5654,\"name\":\"Jesper D Jensen\"}}]},{\"date\":\"27 7 1\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":158,\"judges\":[{\"id\":401887,\"name\":\"Raul Caiz Sr\",\"scorecard\":[86,85]},{\"id\":400924,\"name\":\"Ricardo Duncan\",\"scorecard\":[87,84]},{\"id\":402214,\"name\":\"Nelson Vazquez\",\"scorecard\":[86,85]}],\"links\":{\"bio\":1591501,\"bout\":\"619664/1591501\",\"event\":619664,\"other\":[]},\"location\":\"Arena Roberto Duran, Panama City\",\"metadata\":\"  time: 1:57\n | <span>referee:</span> <a href=\\\"/en/referee/402849\\\">Guillermo Perez Pineda</a><span> | </span><a href=\\\"/en/judge/401887\\\">Raul Caiz Sr</a> 86-85 | <a href=\\\"/en/judge/400924\\\">Ricardo Duncan</a> 87-84 | <a href=\\\"/en/judge/402214\\\">Nelson Vazquez</a> 86-85\n<br><div class=\\\"titleColor\\\"><a href=\\\"/en/title/41/Middleweight\\\" class=\\\"titleLink\\\">World Boxing Association World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/403326\\\">Miguel Prado</a>)</div>\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":402849,\"name\":\"Guillermo Perez Pineda\"},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[{\"id\":\"41/Middleweight\",\"name\":\"World Boxing Association World Middleweight Title\",\"supervisor\":{\"id\":403326,\"name\":\"Miguel Prado\"}}]},{\"date\":\"23 3 2\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":156.5,\"judges\":[{\"id\":400930,\"name\":\"Artur Ellensohn\",\"scorecard\":[]},{\"id\":401011,\"name\":\"Pawel Kardyni\",\"scorecard\":[]},{\"id\":400918,\"name\":\"Philippe Verbeke\",\"scorecard\":[]}],\"links\":{\"bio\":1638606,\"bout\":\"627848/1638606\",\"event\":627848,\"other\":[]},\"location\":\"Ballsaal Interconti-Hotel, Düsseldorf\",\"metadata\":\"  time: 2:17\n | <span>referee:</span> <a href=\\\"/en/referee/93650\\\">Jose Ignacio Martinez Antunez</a><span> | </span><a href=\\\"/en/judge/400930\\\">Artur Ellensohn</a> | <a href=\\\"/en/judge/401011\\\">Pawel Kardyni</a> | <a href=\\\"/en/judge/400918\\\">Philippe Verbeke</a>\n<br><div class=\\\"titleColor\\\"><a href=\\\"/en/title/41/Middleweight\\\" class=\\\"titleLink\\\">World Boxing Association World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/5654\\\">Jesper D Jensen</a>)<br><a href=\\\"/en/title/189/Middleweight\\\" class=\\\"titleLink\\\">vacant International Boxing Organization  World Middle Title</a></div>\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":93650,\"name\":\"Jose Ignacio Martinez Antunez\"},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[{\"id\":\"41/Middleweight\",\"name\":\"World Boxing Association World Middleweight Title\",\"supervisor\":{\"id\":5654,\"name\":\"Jesper D Jensen\"}},{\"id\":\"189/Middleweight\",\"name\":\"vacant International Boxing Organization World Middleweight Title\"}]},{\"date\":\"19 6 0\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":159,\"judges\":[{\"id\":401982,\"name\":\"Ted Gimza\",\"scorecard\":[]},{\"id\":402000,\"name\":\"Tom Miller\",\"scorecard\":[]},{\"id\":400972,\"name\":\"Ove Ovesen\",\"scorecard\":[]}],\"links\":{\"bio\":1694617,\"bout\":\"641196/1694617\",\"event\":641196,\"other\":[]},\"location\":\"Ice Palace \\\"Terminal\\\", Brovari\",\"metadata\":\"  time: 1:17\n | <span>referee:</span> <a href=\\\"/en/referee/93650\\\">Jose Ignacio Martinez Antunez</a><span> | </span><a href=\\\"/en/judge/401982\\\">Ted Gimza</a> | <a href=\\\"/en/judge/402000\\\">Tom Miller</a> | <a href=\\\"/en/judge/400972\\\">Ove Ovesen</a>\n<br><div class=\\\"titleColor\\\"><a href=\\\"/en/title/41/Middleweight\\\" class=\\\"titleLink\\\">World Boxing Association World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/5654\\\">Jesper D Jensen</a>)<br><a href=\\\"/en/title/189/Middleweight\\\" class=\\\"titleLink\\\">International Boxing Organization  World Middle Title</a></div>\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":93650,\"name\":\"Jose Ignacio Martinez Antunez\"},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[{\"id\":\"41/Middleweight\",\"name\":\"World Boxing Association World Middleweight Title\",\"supervisor\":{\"id\":5654,\"name\":\"Jesper D Jensen\"}},{\"id\":\"189/Middleweight\",\"name\":\"International Boxing Organization World Middleweight Title\"}]},{\"date\":\"28 1 0\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":159,\"judges\":[{\"id\":401246,\"name\":\"Don Ackerman\",\"scorecard\":[40,34]},{\"id\":402713,\"name\":\"Wynn Kintz\",\"scorecard\":[40,34]},{\"id\":406482,\"name\":\"Tom Schreck\",\"scorecard\":[40,34]}],\"links\":{\"bio\":1719903,\"bout\":\"645184/1719903\",\"event\":645184,\"other\":[]},\"location\":\"Turning Stone Resort & Casino, Verona\",\"metadata\":\"  time: 1:11\n | <span>referee:</span> <a href=\\\"/en/referee/65428\\\">Charlie Fitch</a><span> | </span><a href=\\\"/en/judge/401246\\\">Don Ackerman</a> 40-34 | <a href=\\\"/en/judge/402713\\\">Wynn Kintz</a> 40-34 | <a href=\\\"/en/judge/406482\\\">Tom Schreck</a> 40-34\n<br><div class=\\\"titleColor\\\"><a href=\\\"/en/title/41/Middleweight\\\" class=\\\"titleLink\\\">World Boxing Association World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/420022\\\">George Martinez</a>)<br><a href=\\\"/en/title/189/Middleweight\\\" class=\\\"titleLink\\\">International Boxing Organization  World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/403048\\\">Ed Levine</a>)</div>\n<br>Proksa down in rds 1, 4 &amp; 5\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":65428,\"name\":\"Charlie Fitch\"},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[{\"id\":\"41/Middleweight\",\"name\":\"World Boxing Association World Middleweight Title\",\"supervisor\":{\"id\":420022,\"name\":\"George Martinez\"}},{\"id\":\"189/Middleweight\",\"name\":\"International Boxing Organization World Middleweight Title\",\"supervisor\":{\"id\":403048,\"name\":\"Ed Levine\"}}]},{\"date\":\"21 5 0\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":159,\"judges\":[{\"id\":400935,\"name\":\"Glenn Feldman\",\"scorecard\":[60,54]},{\"id\":402000,\"name\":\"Tom Miller\",\"scorecard\":[59,55]},{\"id\":403441,\"name\":\"John Poturaj\",\"scorecard\":[60,54]}],\"links\":{\"bio\":1751110,\"bout\":\"659024/1751110\",\"event\":659024,\"other\":[]},\"location\":\"Madison Square Garden Theater, New York\",\"metadata\":\"  time: 2:46\n | <span>referee:</span> <a href=\\\"/en/referee/401025\\\">Steve Smoger</a><span> | </span><a href=\\\"/en/judge/400935\\\">Glenn Feldman</a> 60-54 | <a href=\\\"/en/judge/402000\\\">Tom Miller</a> 59-55 | <a href=\\\"/en/judge/403441\\\">John Poturaj</a> 60-54\n<br><div class=\\\"titleColor\\\"><a href=\\\"/en/title/41/Middleweight\\\" class=\\\"titleLink\\\">World Boxing Association World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/403326\\\">Miguel Prado</a>)<br><a href=\\\"/en/title/189/Middleweight\\\" class=\\\"titleLink\\\">International Boxing Organization  World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/762881\\\">Hilton Whitaker III</a>)</div>\n<br>No knockdowns. Rosado corner throws in towel\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":401025,\"name\":\"Steve Smoger\"},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[{\"id\":\"41/Middleweight\",\"name\":\"World Boxing Association World Middleweight Title\",\"supervisor\":{\"id\":403326,\"name\":\"Miguel Prado\"}},{\"id\":\"189/Middleweight\",\"name\":\"International Boxing Organization World Middleweight Title\",\"supervisor\":{\"id\":762881,\"name\":\"Hilton Whitaker III\"}}]},{\"date\":\"24 8 2\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":158.5,\"judges\":[{\"id\":400913,\"name\":\"John Coyle\",\"scorecard\":[20,18]},{\"id\":400924,\"name\":\"Ricardo Duncan\",\"scorecard\":[20,18]},{\"id\":402849,\"name\":\"Guillermo Perez Pineda\",\"scorecard\":[20,18]}],\"links\":{\"bio\":1773727,\"bout\":\"664539/1773727\",\"event\":664539,\"other\":[]},\"location\":\"Salle des Étoiles, Monte Carlo\",\"metadata\":\"  time: 2:20\n | <span>referee:</span> <a href=\\\"/en/referee/400900\\\">Stanley Christodoulou</a><span> | </span><a href=\\\"/en/judge/400913\\\">John Coyle</a> 20-18 | <a href=\\\"/en/judge/400924\\\">Ricardo Duncan</a> 20-18 | <a href=\\\"/en/judge/402849\\\">Guillermo Perez Pineda</a> 20-18\n<br><div class=\\\"titleColor\\\"><a href=\\\"/en/title/41/Middleweight\\\" class=\\\"titleLink\\\">World Boxing Association World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/403546\\\">Renzo Bagnariol</a>)<br><a href=\\\"/en/title/189/Middleweight\\\" class=\\\"titleLink\\\">International Boxing Organization  World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/403048\\\">Ed Levine</a>)</div>\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":400900,\"name\":\"Stanley Christodoulou\"},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[{\"id\":\"41/Middleweight\",\"name\":\"World Boxing Association World Middleweight Title\",\"supervisor\":{\"id\":403546,\"name\":\"Renzo Bagnariol\"}},{\"id\":\"189/Middleweight\",\"name\":\"International Boxing Organization World Middleweight Title\",\"supervisor\":{\"id\":403048,\"name\":\"Ed Levine\"}}]},{\"date\":\"29 4 0\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":159,\"judges\":[{\"id\":400935,\"name\":\"Glenn Feldman\",\"scorecard\":[20,18]},{\"id\":400892,\"name\":\"Julie Lederman\",\"scorecard\":[20,18]},{\"id\":401118,\"name\":\"Clark Sammartino\",\"scorecard\":[20,18]}],\"links\":{\"bio\":1789701,\"bout\":\"669605/1789701\",\"event\":669605,\"other\":[]},\"location\":\"MGM Grand at Foxwoods Resort, Mashantucket\",\"metadata\":\"  time: 1:22\n | <span>referee:</span> <a href=\\\"/en/referee/400911\\\">Eddie Cotton</a><span> | </span><a href=\\\"/en/judge/400935\\\">Glenn Feldman</a> 20-18 | <a href=\\\"/en/judge/400892\\\">Julie Lederman</a> 20-18 | <a href=\\\"/en/judge/401118\\\">Clark Sammartino</a> 20-18\n<br><div class=\\\"titleColor\\\"><a href=\\\"/en/title/41/Middleweight\\\" class=\\\"titleLink\\\">World Boxing Association World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/433739\\\">Aurelio Fiengo</a>)<br><a href=\\\"/en/title/189/Middleweight\\\" class=\\\"titleLink\\\">International Boxing Organization  World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/403048\\\">Ed Levine</a>)</div>\n<br>Macklin cut over rt. eye in 2nd rd.\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":400911,\"name\":\"Eddie Cotton\"},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[{\"id\":\"41/Middleweight\",\"name\":\"World Boxing Association World Middleweight Title\",\"supervisor\":{\"id\":433739,\"name\":\"Aurelio Fiengo\"}},{\"id\":\"189/Middleweight\",\"name\":\"International Boxing Organization World Middleweight Title\",\"supervisor\":{\"id\":403048,\"name\":\"Ed Levine\"}}]},{\"date\":\"25 3 0\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":159.25,\"judges\":[{\"id\":402058,\"name\":\"Max DeLuca\",\"scorecard\":[80,71]},{\"id\":401493,\"name\":\"Michael Pernick\",\"scorecard\":[79,71]},{\"id\":406482,\"name\":\"Tom Schreck\",\"scorecard\":[79,72]}],\"links\":{\"bio\":1825817,\"bout\":\"677312/1825817\",\"event\":677312,\"other\":[]},\"location\":\"Madison Square Garden Theater, New York\",\"metadata\":\"  time: 3:00\n | <span>referee:</span> <a href=\\\"/en/referee/133255\\\">Harvey Dock</a><span> | </span><a href=\\\"/en/judge/402058\\\">Max DeLuca</a> 80-71 | <a href=\\\"/en/judge/401493\\\">Michael Pernick</a> 79-71 | <a href=\\\"/en/judge/406482\\\">Tom Schreck</a> 79-72\n<br><div class=\\\"titleColor\\\"><a href=\\\"/en/title/41/Middleweight\\\" class=\\\"titleLink\\\">World Boxing Association World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/506778\\\">Calvin Inalsingh</a>)<br><a href=\\\"/en/title/189/Middleweight\\\" class=\\\"titleLink\\\">International Boxing Organization  World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/403048\\\">Ed Levine</a>)</div>\n<br>Stevens down in 2nd rd.\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":133255,\"name\":\"Harvey Dock\"},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[{\"id\":\"41/Middleweight\",\"name\":\"World Boxing Association World Middleweight Title\",\"supervisor\":{\"id\":506778,\"name\":\"Calvin Inalsingh\"}},{\"id\":\"189/Middleweight\",\"name\":\"International Boxing Organization World Middleweight Title\",\"supervisor\":{\"id\":403048,\"name\":\"Ed Levine\"}}]},{\"date\":\"22 3 0\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":159.25,\"judges\":[{\"id\":400900,\"name\":\"Stanley Christodoulou\",\"scorecard\":[60,52]},{\"id\":401427,\"name\":\"Leszek Jankowiak\",\"scorecard\":[59,53]},{\"id\":400918,\"name\":\"Philippe Verbeke\",\"scorecard\":[59,53]}],\"links\":{\"bio\":1845468,\"bout\":\"682026/1845468\",\"event\":682026,\"other\":[]},\"location\":\"Salle des Étoiles, Monte Carlo\",\"metadata\":\"  time: 1:20\n | <span>referee:</span> <a href=\\\"/en/referee/401173\\\">Luis Pabon</a><span> | </span><a href=\\\"/en/judge/400900\\\">Stanley Christodoulou</a> 60-52 | <a href=\\\"/en/judge/401427\\\">Leszek Jankowiak</a> 59-53 | <a href=\\\"/en/judge/400918\\\">Philippe Verbeke</a> 59-53\n<br><div class=\\\"titleColor\\\"><a href=\\\"/en/title/41/Middleweight\\\" class=\\\"titleLink\\\">World Boxing Association World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/557219\\\">Mike McAleenan</a>)<br><a href=\\\"/en/title/189/Middleweight\\\" class=\\\"titleLink\\\">International Boxing Organization  World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/403048\\\">Ed Levine</a>)</div>\n<br>Adama down in round 1, round 6, and in round 7 before fight was stopped.\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":401173,\"name\":\"Luis Pabon\"},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[{\"id\":\"41/Middleweight\",\"name\":\"World Boxing Association World Middleweight Title\",\"supervisor\":{\"id\":557219,\"name\":\"Mike McAleenan\"}},{\"id\":\"189/Middleweight\",\"name\":\"International Boxing Organization World Middleweight Title\",\"supervisor\":{\"id\":403048,\"name\":\"Ed Levine\"}}]},{\"date\":\"30 2 0\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":159.25,\"judges\":[{\"id\":400892,\"name\":\"Julie Lederman\",\"scorecard\":[20,17]},{\"id\":406465,\"name\":\"John McKaie\",\"scorecard\":[20,17]},{\"id\":402265,\"name\":\"Don Trella\",\"scorecard\":[20,17]}],\"links\":{\"bio\":1892681,\"bout\":\"693306/1892681\",\"event\":693306,\"other\":[]},\"location\":\"Madison Square Garden, New York\",\"metadata\":\"  time: 2:47\n | <span>referee:</span> <a href=\\\"/en/referee/401023\\\">Mike Ortega</a><span> | </span><a href=\\\"/en/judge/400892\\\">Julie Lederman</a> 20-17 | <a href=\\\"/en/judge/406465\\\">John McKaie</a> 20-17 | <a href=\\\"/en/judge/402265\\\">Don Trella</a> 20-17\n<br><div class=\\\"titleColor\\\"><a href=\\\"/en/title/43/Middleweight\\\" class=\\\"titleLink\\\">World Boxing Association Super World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/433739\\\">Aurelio Fiengo</a>)<br><a href=\\\"/en/title/189/Middleweight\\\" class=\\\"titleLink\\\">International Boxing Organization  World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/577642\\\">Jeremy Levine</a>)</div>\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":401023,\"name\":\"Mike Ortega\"},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[{\"id\":\"43/Middleweight\",\"name\":\"World Boxing Association Super World Middleweight Title\",\"supervisor\":{\"id\":433739,\"name\":\"Aurelio Fiengo\"}},{\"id\":\"189/Middleweight\",\"name\":\"International Boxing Organization World Middleweight Title\",\"supervisor\":{\"id\":577642,\"name\":\"Jeremy Levine\"}}]},{\"date\":\"59 6 1\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":161.75,\"judges\":[{\"id\":401887,\"name\":\"Raul Caiz Sr\",\"scorecard\":[10,9]},{\"id\":402058,\"name\":\"Max DeLuca\",\"scorecard\":[10,9]},{\"id\":401536,\"name\":\"Robert Hoyle\",\"scorecard\":[10,9]}],\"links\":{\"bio\":1915760,\"bout\":\"698469/1915760\",\"event\":698469,\"other\":[]},\"location\":\"StubHub Center, Carson\",\"metadata\":\"  time: 1:19\n | <span>referee:</span> <a href=\\\"/en/referee/401878\\\">Jack Reiss</a><span> | </span><a href=\\\"/en/judge/401887\\\">Raul Caiz Sr</a> 10-9 | <a href=\\\"/en/judge/402058\\\">Max DeLuca</a> 10-9 | <a href=\\\"/en/judge/401536\\\">Robert Hoyle</a> 10-9\n<br><div class=\\\"titleColor\\\"><a href=\\\"/en/title/6/Middleweight\\\" class=\\\"titleLink\\\">interim World Boxing Council World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/400916\\\">Bob Logist</a>)<br><a href=\\\"/en/title/43/Middleweight\\\" class=\\\"titleLink\\\">World Boxing Association Super World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/626542\\\">Julio Thyme</a>)<br><a href=\\\"/en/title/189/Middleweight\\\" class=\\\"titleLink\\\">International Boxing Organization  World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/403048\\\">Ed Levine</a>)</div>\n<br>Rubio failed to make weight, loses interim title. None of the titles on the line for Rubio.\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":401878,\"name\":\"Jack Reiss\"},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[{\"id\":\"6/Middleweight\",\"name\":\"interim World Boxing Council World Middleweight Title\",\"supervisor\":{\"id\":400916,\"name\":\"Bob Logist\"}},{\"id\":\"43/Middleweight\",\"name\":\"World Boxing Association Super World Middleweight Title\",\"supervisor\":{\"id\":626542,\"name\":\"Julio Thyme\"}},{\"id\":\"189/Middleweight\",\"name\":\"International Boxing Organization World Middleweight Title\",\"supervisor\":{\"id\":403048,\"name\":\"Ed Levine\"}}]},{\"date\":\"29 1 1\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":159.75,\"judges\":[{\"id\":639700,\"name\":\"Fernando Barbosa\",\"scorecard\":[100,87]},{\"id\":400900,\"name\":\"Stanley Christodoulou\",\"scorecard\":[99,88]},{\"id\":401858,\"name\":\"Jack Woodburn\",\"scorecard\":[99,88]}],\"links\":{\"bio\":1931744,\"bout\":\"702538/1931744\",\"event\":702538,\"other\":[]},\"location\":\"Salle des Étoiles, Monte Carlo\",\"metadata\":\"  time: 0:50\n | <span>referee:</span> <a href=\\\"/en/referee/401173\\\">Luis Pabon</a><span> | </span><a href=\\\"/en/judge/639700\\\">Fernando Barbosa</a> 100-87 | <a href=\\\"/en/judge/400900\\\">Stanley Christodoulou</a> 99-88 | <a href=\\\"/en/judge/401858\\\">Jack Woodburn</a> 99-88\n<br><div class=\\\"titleColor\\\"><a href=\\\"/en/title/6/Middleweight\\\" class=\\\"titleLink\\\">interim World Boxing Council World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/456477\\\">Mauricio Sulaiman</a>)<br><a href=\\\"/en/title/43/Middleweight\\\" class=\\\"titleLink\\\">World Boxing Association Super World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/538042\\\">Gilberto Jesus Mendoza</a>)<br><a href=\\\"/en/title/189/Middleweight\\\" class=\\\"titleLink\\\">International Boxing Organization  World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/403048\\\">Ed Levine</a>)</div>\n<br>Murray down twice in the 4th round and once in the 10th.\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":401173,\"name\":\"Luis Pabon\"},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[{\"id\":\"6/Middleweight\",\"name\":\"interim World Boxing Council World Middleweight Title\",\"supervisor\":{\"id\":456477,\"name\":\"Mauricio Sulaiman\"}},{\"id\":\"43/Middleweight\",\"name\":\"World Boxing Association Super World Middleweight Title\",\"supervisor\":{\"id\":538042,\"name\":\"Gilberto Jesus Mendoza\"}},{\"id\":\"189/Middleweight\",\"name\":\"International Boxing Organization World Middleweight Title\",\"supervisor\":{\"id\":403048,\"name\":\"Ed Levine\"}}]},{\"date\":\"19 1 0\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":160,\"judges\":[{\"id\":401967,\"name\":\"Adalaide Byrd\",\"scorecard\":[50,43]},{\"id\":401036,\"name\":\"Pat Russell\",\"scorecard\":[49,44]},{\"id\":401538,\"name\":\"Steve Weisfeld\",\"scorecard\":[50,43]}],\"links\":{\"bio\":1963672,\"bout\":\"711316/1963672\",\"event\":711316,\"other\":[]},\"location\":\"Forum, Inglewood\",\"metadata\":\"  time: 0:45\n | <span>referee:</span> <a href=\\\"/en/referee/401878\\\">Jack Reiss</a><span> | </span><a href=\\\"/en/judge/401967\\\">Adalaide Byrd</a> 50-43 | <a href=\\\"/en/judge/401036\\\">Pat Russell</a> 49-44 | <a href=\\\"/en/judge/401538\\\">Steve Weisfeld</a> 50-43\n<br><div class=\\\"titleColor\\\"><a href=\\\"/en/title/6/Middleweight\\\" class=\\\"titleLink\\\">interim World Boxing Council World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/456477\\\">Mauricio Sulaiman</a>)<br><a href=\\\"/en/title/43/Middleweight\\\" class=\\\"titleLink\\\">World Boxing Association Super World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/538042\\\">Gilberto Jesus Mendoza</a>)<br><a href=\\\"/en/title/189/Middleweight\\\" class=\\\"titleLink\\\">International Boxing Organization  World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/403048\\\">Ed Levine</a>)</div>\n<br>WBC interim title not on the line for Monroe Jr who didn&apos;t comply with WBC rules prior to the bout<br>\nMonroe down twice in rd 2 and once in rd 6\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":401878,\"name\":\"Jack Reiss\"},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[{\"id\":\"6/Middleweight\",\"name\":\"interim World Boxing Council World Middleweight Title\",\"supervisor\":{\"id\":456477,\"name\":\"Mauricio Sulaiman\"}},{\"id\":\"43/Middleweight\",\"name\":\"World Boxing Association Super World Middleweight Title\",\"supervisor\":{\"id\":538042,\"name\":\"Gilberto Jesus Mendoza\"}},{\"id\":\"189/Middleweight\",\"name\":\"International Boxing Organization World Middleweight Title\",\"supervisor\":{\"id\":403048,\"name\":\"Ed Levine\"}}]},{\"date\":\"34 2 0\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":159.75,\"judges\":[{\"id\":400935,\"name\":\"Glenn Feldman\",\"scorecard\":[70,62]},{\"id\":400892,\"name\":\"Julie Lederman\",\"scorecard\":[70,62]},{\"id\":401538,\"name\":\"Steve Weisfeld\",\"scorecard\":[70,62]}],\"links\":{\"bio\":1995895,\"bout\":\"717853/1995895\",\"event\":717853,\"other\":[]},\"location\":\"Madison Square Garden, New York\",\"metadata\":\"  time: 1:32\n | <span>referee:</span> <a href=\\\"/en/referee/408398\\\">Steve Willis</a><span> | </span><a href=\\\"/en/judge/400935\\\">Glenn Feldman</a> 70-62 | <a href=\\\"/en/judge/400892\\\">Julie Lederman</a> 70-62 | <a href=\\\"/en/judge/401538\\\">Steve Weisfeld</a> 70-62\n<br><div class=\\\"titleColor\\\"><a href=\\\"/en/title/6/Middleweight\\\" class=\\\"titleLink\\\">interim World Boxing Council World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/456477\\\">Mauricio Sulaiman</a>)<br><a href=\\\"/en/title/43/Middleweight\\\" class=\\\"titleLink\\\">World Boxing Association Super World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/538042\\\">Gilberto Jesus Mendoza</a>)<br><a href=\\\"/en/title/75/Middleweight\\\" class=\\\"titleLink\\\">International Boxing Federation World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/432783\\\">Lindsey Tucker</a>)<br><a href=\\\"/en/title/189/Middleweight\\\" class=\\\"titleLink\\\">International Boxing Organization  World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/403048\\\">Ed Levine</a>)</div>\n<br>Lemieux down once in round five\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":408398,\"name\":\"Steve Willis\"},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[{\"id\":\"6/Middleweight\",\"name\":\"interim World Boxing Council World Middleweight Title\",\"supervisor\":{\"id\":456477,\"name\":\"Mauricio Sulaiman\"}},{\"id\":\"43/Middleweight\",\"name\":\"World Boxing Association Super World Middleweight Title\",\"supervisor\":{\"id\":538042,\"name\":\"Gilberto Jesus Mendoza\"}},{\"id\":\"75/Middleweight\",\"name\":\"International Boxing Federation World Middleweight Title\",\"supervisor\":{\"id\":432783,\"name\":\"Lindsey Tucker\"}},{\"id\":\"189/Middleweight\",\"name\":\"International Boxing Organization World Middleweight Title\",\"supervisor\":{\"id\":403048,\"name\":\"Ed Levine\"}}]},{\"date\":\"18 0 0\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":159.5,\"judges\":[{\"id\":401967,\"name\":\"Adalaide Byrd\",\"scorecard\":[]},{\"id\":403835,\"name\":\"Steve Morrow\",\"scorecard\":[]},{\"id\":401036,\"name\":\"Pat Russell\",\"scorecard\":[]}],\"links\":{\"bio\":2037019,\"bout\":\"726453/2037019\",\"event\":726453,\"other\":[]},\"location\":\"Forum, Inglewood\",\"metadata\":\"  time: 2:37\n | <span>referee:</span> <a href=\\\"/en/referee/401878\\\">Jack Reiss</a><span> | </span><a href=\\\"/en/judge/401967\\\">Adalaide Byrd</a> | <a href=\\\"/en/judge/403835\\\">Steve Morrow</a> | <a href=\\\"/en/judge/401036\\\">Pat Russell</a>\n<br><div class=\\\"titleColor\\\"><a href=\\\"/en/title/6/Middleweight\\\" class=\\\"titleLink\\\">interim World Boxing Council World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/420660\\\">Rex Walker</a>)<br><a href=\\\"/en/title/43/Middleweight\\\" class=\\\"titleLink\\\">World Boxing Association Super World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/209478\\\">Kina Malpartida</a>)<br><a href=\\\"/en/title/75/Middleweight\\\" class=\\\"titleLink\\\">International Boxing Federation World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/432783\\\">Lindsey Tucker</a>)<br><a href=\\\"/en/title/189/Middleweight\\\" class=\\\"titleLink\\\">International Boxing Organization  World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/403048\\\">Ed Levine</a>)</div>\n<br>Wade down once in rd 1 &amp; twice in rd 2\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":401878,\"name\":\"Jack Reiss\"},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[{\"id\":\"6/Middleweight\",\"name\":\"interim World Boxing Council World Middleweight Title\",\"supervisor\":{\"id\":420660,\"name\":\"Rex Walker\"}},{\"id\":\"43/Middleweight\",\"name\":\"World Boxing Association Super World Middleweight Title\",\"supervisor\":{\"id\":209478,\"name\":\"Kina Malpartida\"}},{\"id\":\"75/Middleweight\",\"name\":\"International Boxing Federation World Middleweight Title\",\"supervisor\":{\"id\":432783,\"name\":\"Lindsey Tucker\"}},{\"id\":\"189/Middleweight\",\"name\":\"International Boxing Organization World Middleweight Title\",\"supervisor\":{\"id\":403048,\"name\":\"Ed Levine\"}}]},{\"date\":\"36 0 0\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":159.5,\"judges\":[{\"id\":400961,\"name\":\"Guido Cavalleri\",\"scorecard\":[38,38]},{\"id\":405582,\"name\":\"Craig Metcalfe\",\"scorecard\":[38,38]},{\"id\":404733,\"name\":\"Benoit Roussel\",\"scorecard\":[37,39]}],\"links\":{\"bio\":2091057,\"bout\":\"736736/2091057\",\"event\":736736,\"other\":[]},\"location\":\"O2 Arena, Greenwich\",\"metadata\":\"  time: 1:57\n | <span>referee:</span> <a href=\\\"/en/referee/44400\\\">Marlon Wright</a><span> | </span><a href=\\\"/en/judge/400961\\\">Guido Cavalleri</a> 38-38 | <a href=\\\"/en/judge/405582\\\">Craig Metcalfe</a> 38-38 | <a href=\\\"/en/judge/404733\\\">Benoit Roussel</a> 37-39\n<br><div class=\\\"titleColor\\\"><a href=\\\"/en/title/6/Middleweight\\\" class=\\\"titleLink\\\">World Boxing Council World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/588189\\\">Alberto Leon</a>)<br><a href=\\\"/en/title/75/Middleweight\\\" class=\\\"titleLink\\\">International Boxing Federation World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/420969\\\">Daryl Peoples</a>)<br><a href=\\\"/en/title/189/Middleweight\\\" class=\\\"titleLink\\\">International Boxing Organization  World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/403048\\\">Ed Levine</a>)</div>\n<br>Fight stopped after Brook&apos;s corner threw in the towel; Brook sustained a fractured right eye socket.\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":44400,\"name\":\"Marlon Wright\"},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[{\"id\":\"6/Middleweight\",\"name\":\"World Boxing Council World Middleweight Title\",\"supervisor\":{\"id\":588189,\"name\":\"Alberto Leon\"}},{\"id\":\"75/Middleweight\",\"name\":\"International Boxing Federation World Middleweight Title\",\"supervisor\":{\"id\":420969,\"name\":\"Daryl Peoples\"}},{\"id\":\"189/Middleweight\",\"name\":\"International Boxing Organization World Middleweight Title\",\"supervisor\":{\"id\":403048,\"name\":\"Ed Levine\"}}]},{\"date\":\"32 1 0\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":159.75,\"judges\":[{\"id\":402058,\"name\":\"Max DeLuca\",\"scorecard\":[114,113]},{\"id\":402265,\"name\":\"Don Trella\",\"scorecard\":[115,112]},{\"id\":401538,\"name\":\"Steve Weisfeld\",\"scorecard\":[115,112]}],\"links\":{\"bio\":2139435,\"bout\":\"744074/2139435\",\"event\":744074,\"other\":[]},\"location\":\"Madison Square Garden, New York\",\"metadata\":\"<span>referee:</span> <a href=\\\"/en/referee/65428\\\">Charlie Fitch</a><span> | </span><a href=\\\"/en/judge/402058\\\">Max DeLuca</a> 114-113 | <a href=\\\"/en/judge/402265\\\">Don Trella</a> 115-112 | <a href=\\\"/en/judge/401538\\\">Steve Weisfeld</a> 115-112\n<br><div class=\\\"titleColor\\\"><a href=\\\"/en/title/6/Middleweight\\\" class=\\\"titleLink\\\">World Boxing Council World Middle Title</a><br><a href=\\\"/en/title/43/Middleweight\\\" class=\\\"titleLink\\\">World Boxing Association Super World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/420022\\\">George Martinez</a>)<br><a href=\\\"/en/title/75/Middleweight\\\" class=\\\"titleLink\\\">International Boxing Federation World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/432783\\\">Lindsey Tucker</a>)<br><a href=\\\"/en/title/189/Middleweight\\\" class=\\\"titleLink\\\">International Boxing Organization  World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/403048\\\">Ed Levine</a>)</div>\n<br>Jacobs down in round four<br>IBF title not on the line for Jacobs who misses IBF&apos;s same-day weigh-in\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":65428,\"name\":\"Charlie Fitch\"},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[{\"id\":\"6/Middleweight\",\"name\":\"World Boxing Council World Middleweight Title\"},{\"id\":\"43/Middleweight\",\"name\":\"World Boxing Association Super World Middleweight Title\",\"supervisor\":{\"id\":420022,\"name\":\"George Martinez\"}},{\"id\":\"75/Middleweight\",\"name\":\"International Boxing Federation World Middleweight Title\",\"supervisor\":{\"id\":432783,\"name\":\"Lindsey Tucker\"}},{\"id\":\"189/Middleweight\",\"name\":\"International Boxing Organization World Middleweight Title\",\"supervisor\":{\"id\":403048,\"name\":\"Ed Levine\"}}]},{\"date\":\"49 1 1\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":160,\"judges\":[{\"id\":401967,\"name\":\"Adalaide Byrd\",\"scorecard\":[110,118]},{\"id\":401002,\"name\":\"Dave Moretti\",\"scorecard\":[115,113]},{\"id\":402265,\"name\":\"Don Trella\",\"scorecard\":[114,114]}],\"links\":{\"bio\":2160855,\"bout\":\"751017/2160855\",\"event\":751017,\"other\":[]},\"location\":\"T-Mobile Arena, Las Vegas\",\"metadata\":\"<span>referee:</span> <a href=\\\"/en/referee/400853\\\">Kenny Bayless</a><span> | </span><a href=\\\"/en/judge/401967\\\">Adalaide Byrd</a> 110-118 | <a href=\\\"/en/judge/401002\\\">Dave Moretti</a> 115-113 | <a href=\\\"/en/judge/402265\\\">Don Trella</a> 114-114\n<br><div class=\\\"titleColor\\\"><a href=\\\"/en/title/6/Middleweight\\\" class=\\\"titleLink\\\">World Boxing Council World Middle Title</a><br><a href=\\\"/en/title/43/Middleweight\\\" class=\\\"titleLink\\\">World Boxing Association Super World Middle Title</a><br><a href=\\\"/en/title/75/Middleweight\\\" class=\\\"titleLink\\\">International Boxing Federation World Middle Title</a><br><a href=\\\"/en/title/189/Middleweight\\\" class=\\\"titleLink\\\">International Boxing Organization  World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/403048\\\">Ed Levine</a>)</div>\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":400853,\"name\":\"Kenny Bayless\"},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[{\"id\":\"6/Middleweight\",\"name\":\"World Boxing Council World Middleweight Title\"},{\"id\":\"43/Middleweight\",\"name\":\"World Boxing Association Super World Middleweight Title\"},{\"id\":\"75/Middleweight\",\"name\":\"International Boxing Federation World Middleweight Title\"},{\"id\":\"189/Middleweight\",\"name\":\"International Boxing Organization World Middleweight Title\",\"supervisor\":{\"id\":403048,\"name\":\"Ed Levine\"}}]},{\"date\":\"36 3 1\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":159.5,\"judges\":[{\"id\":404376,\"name\":\"Barry Lindenman\",\"scorecard\":[]},{\"id\":403835,\"name\":\"Steve Morrow\",\"scorecard\":[]},{\"id\":401686,\"name\":\"Alejandro Rochin\",\"scorecard\":[]}],\"links\":{\"bio\":2223447,\"bout\":\"764261/2223447\",\"event\":764261,\"other\":[]},\"location\":\"StubHub Center, Carson\",\"metadata\":\"  time: 1:53\n | <span>referee:</span> <a href=\\\"/en/referee/401878\\\">Jack Reiss</a><span> | </span><a href=\\\"/en/judge/404376\\\">Barry Lindenman</a> | <a href=\\\"/en/judge/403835\\\">Steve Morrow</a> | <a href=\\\"/en/judge/401686\\\">Alejandro Rochin</a>\n<br><div class=\\\"titleColor\\\"><a href=\\\"/en/title/6/Middleweight\\\" class=\\\"titleLink\\\">World Boxing Council World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/400943\\\">Duane Ford</a>)<br><a href=\\\"/en/title/43/Middleweight\\\" class=\\\"titleLink\\\">World Boxing Association Super World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/513863\\\">Carlos Chavez</a>)<br><a href=\\\"/en/title/189/Middleweight\\\" class=\\\"titleLink\\\">International Boxing Organization  World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/403048\\\">Ed Levine</a>)</div>\n<br>Martirosyan down in round two.\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":401878,\"name\":\"Jack Reiss\"},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[{\"id\":\"6/Middleweight\",\"name\":\"World Boxing Council World Middleweight Title\",\"supervisor\":{\"id\":400943,\"name\":\"Duane Ford\"}},{\"id\":\"43/Middleweight\",\"name\":\"World Boxing Association Super World Middleweight Title\",\"supervisor\":{\"id\":513863,\"name\":\"Carlos Chavez\"}},{\"id\":\"189/Middleweight\",\"name\":\"International Boxing Organization World Middleweight Title\",\"supervisor\":{\"id\":403048,\"name\":\"Ed Levine\"}}]},{\"date\":\"49 1 2\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":159.5,\"judges\":[{\"id\":400935,\"name\":\"Glenn Feldman\",\"scorecard\":[114,114]},{\"id\":401002,\"name\":\"Dave Moretti\",\"scorecard\":[113,115]},{\"id\":401538,\"name\":\"Steve Weisfeld\",\"scorecard\":[113,115]}],\"links\":{\"bio\":2257534,\"bout\":\"771321/2257534\",\"event\":771321,\"other\":[]},\"location\":\"T-Mobile Arena, Las Vegas\",\"metadata\":\"<span>referee:</span> <a href=\\\"/en/referee/401364\\\">Benjy Esteves Jr</a><span> | </span><a href=\\\"/en/judge/400935\\\">Glenn Feldman</a> 114-114 | <a href=\\\"/en/judge/401002\\\">Dave Moretti</a> 113-115 | <a href=\\\"/en/judge/401538\\\">Steve Weisfeld</a> 113-115\n<br><div class=\\\"titleColor\\\"><a href=\\\"/en/title/6/Middleweight\\\" class=\\\"titleLink\\\">World Boxing Council World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/456477\\\">Mauricio Sulaiman</a>)<br><a href=\\\"/en/title/43/Middleweight\\\" class=\\\"titleLink\\\">World Boxing Association Super World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/420019\\\">Mariana Borisova</a>)<br><a href=\\\"/en/title/189/Middleweight\\\" class=\\\"titleLink\\\">International Boxing Organization  World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/401132\\\">Jorge Alonso</a>)</div>\n<br>IBO title not on the line for &#xC1;lvarez due to him not paying the sanction fee.\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":401364,\"name\":\"Benjy Esteves Jr\"},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[{\"id\":\"6/Middleweight\",\"name\":\"World Boxing Council World Middleweight Title\",\"supervisor\":{\"id\":456477,\"name\":\"Mauricio Sulaiman\"}},{\"id\":\"43/Middleweight\",\"name\":\"World Boxing Association Super World Middleweight Title\",\"supervisor\":{\"id\":420019,\"name\":\"Mariana Borisova\"}},{\"id\":\"189/Middleweight\",\"name\":\"International Boxing Organization World Middleweight Title\",\"supervisor\":{\"id\":401132,\"name\":\"Jorge Alonso\"}}]},{\"date\":\"19 0 0\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":163.75,\"judges\":[{\"id\":402683,\"name\":\"Ron McNair\",\"scorecard\":[29,28]},{\"id\":401833,\"name\":\"Joseph Pasquale\",\"scorecard\":[30,27]},{\"id\":406886,\"name\":\"Robin Taylor\",\"scorecard\":[30,27]}],\"links\":{\"bio\":2345157,\"bout\":\"786725/2345157\",\"event\":786725,\"other\":[]},\"location\":\"Madison Square Garden, New York\",\"metadata\":\"  time: 2:09\n | <span>referee:</span> <a href=\\\"/en/referee/408398\\\">Steve Willis</a><span> | </span><a href=\\\"/en/judge/402683\\\">Ron McNair</a> 29-28 | <a href=\\\"/en/judge/401833\\\">Joseph Pasquale</a> 30-27 | <a href=\\\"/en/judge/406886\\\">Robin Taylor</a> 30-27\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":408398,\"name\":\"Steve Willis\"},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[]},{\"date\":\"13 1 0\",\"firstBoxerRating\":[null,null],\"firstBoxerWeight\":159,\"judges\":[{\"id\":401465,\"name\":\"Frank Lombardi\",\"scorecard\":[115,112]},{\"id\":448310,\"name\":\"Eric Marlinski\",\"scorecard\":[115,112]},{\"id\":407798,\"name\":\"Kevin Morgan\",\"scorecard\":[114,113]}],\"links\":{\"bio\":2388530,\"bout\":\"794525/2388530\",\"event\":794525,\"other\":[]},\"location\":\"Madison Square Garden, New York\",\"metadata\":\"<span>referee:</span> <a href=\\\"/en/referee/133255\\\">Harvey Dock</a><span> | </span><a href=\\\"/en/judge/401465\\\">Frank Lombardi</a> 115-112 | <a href=\\\"/en/judge/448310\\\">Eric Marlinski</a> 115-112 | <a href=\\\"/en/judge/407798\\\">Kevin Morgan</a> 114-113\n<br><div class=\\\"titleColor\\\"><a href=\\\"/en/title/75/Middleweight\\\" class=\\\"titleLink\\\">vacant International Boxing Federation World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/16069\\\">Randy Neumann</a>)<br><a href=\\\"/en/title/189/Middleweight\\\" class=\\\"titleLink\\\">vacant International Boxing Organization  World Middle Title</a> (supervisor: <a href=\\\"/en/supervisor/762881\\\">Hilton Whitaker III</a>)</div>\n<br>Derevyanchenko down in round one.\n<br>\",\"numberOfRounds\":[null,null],\"outcome\":\"unknown\",\"rating\":null,\"referee\":{\"id\":133255,\"name\":\"Harvey Dock\"},\"result\":[\"unknown\",null,null],\"secondBoxer\":{\"id\":null,\"name\":null},\"secondBoxerLast6\":[],\"secondBoxerRating\":[null,null],\"secondBoxerRecord\":{\"draw\":null,\"loss\":null,\"win\":null},\"secondBoxerWeight\":null,\"titles\":[{\"id\":\"75/Middleweight\",\"name\":\"vacant International Boxing Federation World Middleweight Title\",\"supervisor\":{\"id\":16069,\"name\":\"Randy Neumann\"}},{\"id\":\"189/Middleweight\",\"name\":\"vacant International Boxing Organization World Middleweight Title\",\"supervisor\":{\"id\":762881,\"name\":\"Hilton Whitaker III\"}}]}],\"debut\":\"2006-05-06\",\"division\":\"middleweight\",\"globalId\":356831,\"hasBoutScheduled\":false,\"height\":[5,10.5,179],\"name\":\"Gennadiy Golovkin\",\"nationality\":\"Kazakhstan\",\"numberOfBouts\":42,\"otherInfo\":[[\"career\",\"        \n        \n2006-2019\n\"]],\"picture\":\"https://boxrec.com/media/images/thumb/b/b9/GGG.jpg/200px-GGG.jpg\",\"ranking\":[[2,1553],[1,11]],\"rating\":98,\"reach\":[70,178],\"residence\":\"Los Angeles, California, USA\",\"role\":[{\"id\":356831,\"name\":\"Am Boxing\"},{\"id\":356831,\"name\":\"proboxer\"},{\"id\":356831,\"name\":\"promoter\"}],\"rounds\":212,\"stance\":\"orthodox\",\"status\":\"active\",\"suspended\":null,\"titlesHeld\":[\"International Boxing Organization World Middle Title\",\"International Boxing Federation World Middle Title\"],\"vadacbp\":false}",
            "mode": "application/json"
        }
    }
}
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
