import {BoxrecBoutLocation} from "../boxrec.constants";

export const emptyLocationObject: BoxrecBoutLocation = {
    location: {
        country: {
            id: null,
            name: null,
        },
        region: {
            id: null,
            name: null,
        },
        town: {
            id: null,
            name: null,
        },
    },
    venue: {
        id: null,
        name: null,
    },
};
