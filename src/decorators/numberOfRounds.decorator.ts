import {BoxrecCommonTableHeader, getColumnDataByColumnHeader, trimRemoveLineBreaks} from '../helpers';

/**
 * Adds a getter to the class that returns the number of rounds for this bout
 * @constructor
 */
export function NumberOfRoundsGetter(): (target: any) => void {
    return target => {
        Object.defineProperty(target.prototype, 'numberOfRounds', {
            get(): number[] {
                const numberOfRounds: string = trimRemoveLineBreaks(getColumnDataByColumnHeader(this.$,
                    this.headerColumns, BoxrecCommonTableHeader.rounds, false));

                if (numberOfRounds.includes('/')) {
                    // ended early
                    return numberOfRounds.split('/').map(item => parseInt(item, 10));
                }

                const parsedNumberOfRounds: number = parseInt(numberOfRounds, 10);
                // went to decision
                return [parsedNumberOfRounds, parsedNumberOfRounds];
            },
        });
    };
}

export interface NumberOfRoundsInterface {
    readonly numberOfRounds: number[];
}
