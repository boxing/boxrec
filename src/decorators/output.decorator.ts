/**
 * Adds a getter to the class that returns the rating for this bout
 * @constructor
 */
interface OutputObj {
    method: string;
    function: (str: any) => any;
}

// todo should we use this going forward?  it's not complete but is it required?
type OutputValues = 'age' | 'boxingOrganizations' | 'byWeightDivision' | 'career' | 'champions' | 'commission' |
    'date' | 'division' | 'doctors' | 'firstBoxerRating' | 'firstBoxerWeight' | 'hasBoutScheduled' |
    'id' | 'inspector' | 'judges' | 'last6' | 'links' | 'localBoxers' | 'localManagers' | 'location' |
    'matchmakers' | 'media' | 'metadata' |
    'name' | 'numberOfBouts' | 'numberOfPages' | 'numberOfPeople' | 'numberOfRounds' | 'outcome' |
    'people' | 'points' | 'promoters' | 'rating' | 'record' | 'referee' | 'residence' | 'result' | 'secondBoxer' |
    'secondBoxerLast6' |
    'secondBoxerRating' |
    'secondBoxerRecord' |
    'secondBoxerWeight' | 'stance' | 'television' | 'titles';

export function OutputGetter(collection: Array<string | OutputObj>):
    (target: any) => void {
    return (target: any) => {
        Object.defineProperty(target.prototype, 'output', {
            get(): any {
                const obj: any = {};

                for (const item of collection) {
                    if (typeof item === 'string') {
                        obj[item] = this[item]; // eslint-disable-line
                    } else {
                        const col: OutputObj = item as OutputObj;
                        // assign the getter the value that is run through the passed in function
                        obj[col.method] = col.function(this[col.method]);
                    }
                }

                return obj;
            },
        });
    };
}

export interface OutputInterface {
    readonly output: any;
}
