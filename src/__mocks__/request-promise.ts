const rp: any = jest.fn((/*uri*/) => {
    //
});

const PHPSESSID: string = "PHPSESSID=fakeaebcll1kss57th16nkg111";
const REMEMBERME: string = "REMEMBERME=MMLP1";

rp.jar = () => {
    return {
        getCookieString(/*uri, callback*/): string {
            return `${PHPSESSID}; ${REMEMBERME}`;
        },
        setCookie(/*cookieName, callback*/): void {
            //
        },
        getCookies(): Array<{ key: string }> {
            return [{
                key: "PHPSESSID",
            }, {
                key: "REMEMBERME",
            }];
        }
    };
};

rp.cookie = () => {
    return "cookie";
};

rp.get = () => {
    return Promise.resolve({
        headers: {
            "set-cookie": [PHPSESSID],
        }
    });
};

rp.post = () => {
    return Promise.resolve({
        body: "", // HTML body response
        request: {
            uri: {
                pathname: "",
            },
        },
        statusCode: 200
    });
};

module.exports = rp;
