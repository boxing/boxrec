const rp = (jest).fn((/*uri*/) => {
    //
});

const PHPSESSID = "PHPSESSID=fakeaebcll1kss57th16nkg111";
const REMEMBERME = "REMEMBERME=MMLP1";

rp.jar = () => {
    return {
        getCookieString(/*uri, callback*/) {
            return `${PHPSESSID}; ${REMEMBERME}`;
        },
        setCookie(/*cookieName, callback*/) {
            //
        },
        getCookies() {
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
        //
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
