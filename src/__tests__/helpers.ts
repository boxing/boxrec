import * as fs from "fs";
import * as path from "path";
import {CookieJar} from "request";
import * as rp from "request-promise";
import {Boxrec} from "../boxrec.class";

// ignores __mocks__ and makes real requests
jest.unmock("request-promise");

jest.setTimeout(200000);

export const wait: () => Promise<any> = async () => new Promise((r: any) => setTimeout(r, 20000));

export const expectId: (id: number | null, expectedId: any) => void = (id: number | null, expectedId: any) =>
    expect(id).toEqual(expectedId);

export const expectMatchDate: (date: string | null) => void = (date: string | null) =>
    expect(date).toMatch(/\d{4}-\d{2}-\d{2}/);

export const logIn: () => Promise<{ madeRequest: boolean, cookieJar: CookieJar}> = async (): Promise<{ madeRequest: boolean, cookieJar: CookieJar}> => {
    const {BOXREC_USERNAME, BOXREC_PASSWORD} = process.env;

    if (!BOXREC_USERNAME) {
        throw new Error("missing required env var BOXREC_USERNAME");
    }

    if (!BOXREC_PASSWORD) {
        throw new Error("missing required env var BOXREC_PASSWORD");
    }

    let cookieJar: CookieJar = rp.jar();
    let cookieBuffer: Buffer;
    let madeRequest: boolean = true;
    const tmpPath: string = path.resolve(process.cwd(), "./tmp/cookies.txt");
    const cookieDomain: string = "https://boxrec.com";
    let cookieString: string | null = null;
    try {
        cookieBuffer = await fs.readFileSync(tmpPath);
        cookieString = cookieBuffer.toString();
        cookieJar.setCookie(cookieString, cookieDomain);
        madeRequest = false;
    } catch (e) {
        fs.promises.mkdir(path.resolve(process.cwd(), "./tmp/"), { recursive: true }).catch(console.error);
        // if the file doesn't exist, we login and store the cookie in the "../tmp" directory
        cookieJar = await Boxrec.login(BOXREC_USERNAME, BOXREC_PASSWORD);
        await wait();
        const newCookieString: string = cookieJar.getCookieString(cookieDomain);
        await fs.writeFileSync(tmpPath, newCookieString);
    }

    return {
        cookieJar,
        madeRequest,
    };
};
