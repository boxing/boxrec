const rp = jest.fn((/*uri*/) => {
});

const PHPSESSID = "PHPSESSID=fakeaebcll1kss57th16nkg111";
const REMEMBERME = "REMEMBERME=MMLP1";

rp.jar = () => {
    return {
        getCookieString(/*uri, callback*/) {
            return `${PHPSESSID}; ${REMEMBERME}`;
        },
        setCookie(cookieName, callback) {
        }
    }
};

rp.cookie = () => {
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
        statusCode: 200,
        request: {
            uri: {
                pathname: "",
            },
        }
    });
};

module.exports = rp;
