import {CookieJar} from "tough-cookie";
import {RequestResponse} from "request";
import {BoxrecRating} from "./boxrec-pages/boxrec.constants";
import {BoxrecPageRatings} from "./boxrec-pages/boxrec.page.ratings";

const rp = require("request-promise");
const BoxrecPageProfile = require("./boxrec-pages/boxrec.page.profile");

export class Boxrec {

    private _cookie: any = null; // is a string but `getCookieString` returns void?
    private _hasLoggedIn: boolean = false;
    private _cookieJar: any;

    async login(username: string, password: string): Promise<void> {

        const cookieJar: CookieJar = rp.jar();
        let rawCookies;

        try {
            rawCookies = await this.getSessionCookie();
        } catch (e) {
            throw new Error("Could not get response from boxrec");
        }

        if (!rawCookies || !rawCookies[0]) {
            throw new Error("Could not get cookie from initial request to boxrec");
        }

        const cookie = rp.cookie(rawCookies[0]);

        cookieJar.setCookie(cookie, "http://boxrec.com", () => {
        });

        this._cookieJar = cookieJar;

        const options = {
            uri: "http://boxrec.com/en/login", // boxrec does not support HTTPS
            followAllRedirects: true, // 302 redirect occurs
            resolveWithFullResponse: true,
            formData: {
                "_username": username,
                "_password": password,
                "_remember_me": "on",
                "_target_path": "http://boxrec.com", // not required
                "login[go]": "", // not required
            },
            jar: this._cookieJar,
        };

        await rp.post(options)
            .then((data: RequestResponse) => {
                // an unsuccessful login returns a 200, we'll look for phrases to determine the error
                let errorMessage: string = "";

                if (data.body.includes("your password is incorrect")) {
                    errorMessage = "Your password is incorrect";
                }

                if (data.body.includes("username does not exist")) {
                    errorMessage = "Username does not exist";
                }

                if (data.statusCode !== 200 || errorMessage !== "") {
                    throw new Error(errorMessage);
                }
            });

        // it argues that the return value is void
        this._cookie = cookieJar.getCookieString("http://boxrec.com", () => {
            // the callback doesn't work but it works if you assign as a variable?
        });

        if (this._cookie && this._cookie.includes("PHPSESSID") && this._cookie.includes("REMEMBERME")) {
            this._hasLoggedIn = true;
            return; // success
        } else {
            throw new Error("Cookie did not have PHPSESSID and REMEMBERME");
        }
    }

    async getBoxerById(boxerId: number) {
        this.checkIfLoggedIn();
        const boxrecPageBody = await rp.get({
            uri: `http://boxrec.com/en/boxer/${boxerId}`,
            jar: this._cookieJar,
        });

        return new BoxrecPageProfile(boxrecPageBody);
    }

    public async getRatings(qs: any): Promise<BoxrecRating[]> {
        for (let i in qs) {
            qs[`r[${i}]`] = qs[i];
        }

        const boxrecPageBody = await rp.get({
            uri: "http://boxrec.com/en/ratings",
            qs,
            jar: this._cookieJar,
        });

        return new BoxrecPageRatings(boxrecPageBody).get;
    }

    // makes a request to get the PHPSESSID required to login
    private async getSessionCookie(): Promise<string[]> {
        return rp.get({
            uri: "http://boxrec.com",
            resolveWithFullResponse: true,
        }).then((data: RequestResponse) => data.headers["set-cookie"]);
    }

    private checkIfLoggedIn(): boolean {
        if (this._hasLoggedIn) {
            return true;
        } else {
            throw new Error("This package requires logging into Boxrec to work properly.  Please use the `login` method before any other calls");
        }
    }

}

module.exports = new Boxrec();
