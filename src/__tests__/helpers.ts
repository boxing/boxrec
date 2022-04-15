import * as fs from 'fs';
import * as path from 'path';
import {Boxrec} from '../boxrec.class';

jest.setTimeout(200000);

export const wait: () => Promise<any> = async () => new Promise((r: any) => setTimeout(r, 20000));

export const expectId: (id: number | null, expectedId: any) => void = (id: number | null, expectedId: any) =>
    expect(id).toEqual(expectedId);

export const expectMatchDate: (date: string | null) => void = (date: string | null) =>
    expect(date).toMatch(/\d{4}-\d{2}-\d{2}/);

export const logIn: () =>
    Promise<{ madeRequest: boolean, cookieString: string}> = async ():
    Promise<{ madeRequest: boolean, cookieString: string}> => {
    const {BOXREC_USERNAME, BOXREC_PASSWORD} = process.env;

    if (!BOXREC_USERNAME) {
        throw new Error('missing required env var BOXREC_USERNAME');
    }

    if (!BOXREC_PASSWORD) {
        throw new Error('missing required env var BOXREC_PASSWORD');
    }

    const getNewCookie: () => void = async () => {
        fs.promises.mkdir(path.resolve(process.cwd(), './tmp/'), { recursive: true }).catch(console.error);
        // if the file doesn't exist, we login and store the cookie in the "../tmp" directory
        cookieString = await Boxrec.login(BOXREC_USERNAME, BOXREC_PASSWORD);
        await wait();
        await fs.writeFileSync(tmpPath, cookieString);
    };

    let cookieBuffer: Buffer;
    let madeRequest: boolean = true;
    const tmpPath: string = path.resolve(process.cwd(), './tmp/cookies.txt');
    let cookieString: string = '';

    try {
        const { mtime } = fs.statSync(tmpPath);

        const timeWhenCookieFileModified: number = new Date(mtime).getTime();
        const currentUnixTime: number = new Date().getTime();

        // I think it's an hour but due to testing times, anywhere close we'll get a new cookie
        if (currentUnixTime - timeWhenCookieFileModified > 2000) {
            // tslint:disable-next-line:no-console
            console.log('Getting a new cookie');
            await getNewCookie();
        }

        cookieBuffer = await fs.readFileSync(tmpPath);
        cookieString = cookieBuffer.toString();
        madeRequest = false;
    } catch (e) {
        await getNewCookie();
    }

    return {
        cookieString,
        madeRequest,
    };
};
