import {BoxrecRole} from 'boxrec-requests';
import {BoxrecPageProfileBoxer} from '../boxrec-pages/profile/boxrec.page.profile.boxer';
import {BoxrecPageProfileEvents} from '../boxrec-pages/profile/boxrec.page.profile.events';
import {BoxrecPageProfileManager} from '../boxrec-pages/profile/boxrec.page.profile.manager';
import {BoxrecPageProfileOtherCommon} from '../boxrec-pages/profile/boxrec.page.profile.other.common';
import {BoxrecPageProfilePromoter} from '../boxrec-pages/profile/boxrec.page.profile.promoter';
import {Boxrec} from '../boxrec.class';
import {expectMatchDate, logIn, wait} from './helpers';

jest.setTimeout(120000);

describe('method getPersonById', () => {

    let loggedInCookie: string;

    beforeAll(async () => {
        const logInResponse: { madeRequest: boolean, cookieString: string} = await logIn();
        loggedInCookie = logInResponse.cookieString;
    });

    type Person =
        BoxrecPageProfileBoxer
        | BoxrecPageProfileOtherCommon
        | BoxrecPageProfileEvents
        | BoxrecPageProfileManager;

    describe('boxers', () => {

        const boxers: Map<number, Person> = new Map();
        const getBoxer: (id: number) => any =
            (id: number): Person | undefined => boxers.get(id);

        describe('active', () => {

            // Saul Alvarez
            const activeBoxer: number = 348759;

            beforeAll(async () => {
                boxers.set(activeBoxer, await Boxrec.getPersonById(loggedInCookie, activeBoxer, BoxrecRole.proBoxer));
                await wait();
            });

            describe('output', () => {
               it('location should be defined', () => {
                   expect(getBoxer(activeBoxer).output.bouts[0].location).toEqual(expect.any(String));
               });
            });

            describe('enrollments', () => {

                describe('when a boxer has enrollments', () => {

                    let enrolledBoxer: any;

                    beforeAll(() => {
                        enrolledBoxer = getBoxer(activeBoxer).enrollments;
                    });

                    it('should return who', () => {
                        expect(enrolledBoxer[0].by).toBe('Voluntary Anti-Doping Association (VADA) CBP');
                    });

                    it('should return the expiry date', () => {
                        expectMatchDate(enrolledBoxer[0].expires);
                    });

                    it('should return the id of the enrollment', () => {
                        expect(enrolledBoxer[0].id).toBe(activeBoxer);
                    });

                    it('should return the sport', () => {
                        /**
                         * todo the enum from boxrec-requests is not in sync now,
                         * this value was "Pro Boxing" but BoxRec has changed it
                         */
                        expect(enrolledBoxer[0].sport).toBe('pro boxer');
                    });

                });

            });

            it('should return text string when they\'re suspended or null if they\'re not', () => {
                // we convert it to string because it could be null and we want to find if it matches one or other
                expect(String(getBoxer(activeBoxer).suspended)).toMatch(/suspended|null/);
            });

            it('should include their role as a boxer', () => {
                expect(getBoxer(activeBoxer).role[0]).toEqual({
                    id: activeBoxer,
                    name: BoxrecRole.proBoxer,
                });
            });

            describe('bouts', () => {

                it('should return an array of bouts', () => {
                    expect(getBoxer(activeBoxer).bouts.length).toBeGreaterThanOrEqual(49);
                });

                it('should return the opponent\'s name', () => {
                    expect(getBoxer(activeBoxer).bouts[49].secondBoxer.name).toEqual(expect.any(String));
                });

                describe('location', () => {

                    it('should return the venue name', () => {
                        expect(getBoxer(activeBoxer).bouts[49].location).toEqual(expect.any(String));
                    });

                });

                describe('firstBoxerRating', () => {

                    it('should return the boxer rating before and after the bout', () => {
                        expect(getBoxer(activeBoxer).bouts[0].firstBoxerRating)
                            .toEqual(expect.any(Number));
                    });

                });

                describe('secondBoxerRating', () => {

                    it('should return the boxer rating before and after the bout', () => {
                        expect(getBoxer(activeBoxer).bouts[49].secondBoxerRating)
                            .toEqual(expect.any(Number));
                    });

                });

                describe('last 6', () => {

                    it('should return an array', () => {
                        expect(getBoxer(activeBoxer).bouts[49].secondBoxerLast6).toEqual(expect.any(Array));
                    });

                });

                describe('weight', () => {

                    it('should change fractions to decimals', () => {
                        expect(getBoxer(activeBoxer).bouts[49].firstBoxerWeight).toBeGreaterThanOrEqual(120);
                    });

                });

                describe('links', () => {

                    it('should return the link to the event', () => {
                        expect(getBoxer(activeBoxer).bouts[52].links.event).toBe(771321);
                    });

                    it('should return the link to the bout', () => {
                        expect(getBoxer(activeBoxer).bouts[52].links.bout).toBe('771321/2257534');
                    });

                    it('should return the link to the wiki', () => {
                        expect(getBoxer(activeBoxer).bouts[52].links.bio).toBe(2257534);
                    });

                });

            });

            it('should return the URL of the person\'s profile picture', () => {
                expect((boxers.get(activeBoxer) as BoxrecPageProfileBoxer).picture).toEqual(expect.any(String));
            });

        });

        describe('retired', () => {

            const retiredBoxer: number = 9625;

            beforeAll(async () => {
                // Sugar Ray Robinson
                boxers.set(retiredBoxer, await Boxrec.getPersonById(loggedInCookie, retiredBoxer, BoxrecRole.proBoxer));
                await wait();
            });

            describe('number of bouts', () => {

                it('should break number of boxer bouts to multiple pages', async () => {
                    const sugarRayRobinsonPage1: BoxrecPageProfileBoxer = boxers.get(retiredBoxer) as
                        BoxrecPageProfileBoxer;
                    const sugarRayRobinsonPage2: BoxrecPageProfileBoxer =
                        await Boxrec.getPersonById(loggedInCookie, retiredBoxer, BoxrecRole.proBoxer,
                            sugarRayRobinsonPage1.bouts.length) as BoxrecPageProfileBoxer;
                    await wait();
                    expect(sugarRayRobinsonPage1.bouts[0].secondBoxer.name)
                        .not.toEqual(sugarRayRobinsonPage2.bouts[0].secondBoxer.name);
                });

                describe('enrollments', () => {

                    it('should return an empty array if they have none', () => {
                        expect(getBoxer(retiredBoxer).enrollments).toEqual([]);
                    });
                });

            });

        });

    });

    describe('where role is judge', () => {

        let judge: BoxrecPageProfileOtherCommon;

        beforeAll(async () => {
            judge = await Boxrec.getPersonById(loggedInCookie, 401615, BoxrecRole.judge) as
                BoxrecPageProfileOtherCommon;
            await wait();
        });

        it('should return the person\'s information', () => {
            expect(judge.name).toBe('CJ Ross');
        });

        it('should also have bouts to parse that they were a part of', () => {
            expect(judge.bouts).toEqual(expect.any(Array));
        });

    });

    describe('where role is doctor', () => {

        let doctor: BoxrecPageProfileEvents;

        beforeAll(async () => {
            doctor = await Boxrec
                .getPersonById(loggedInCookie, 412676, BoxrecRole.doctor) as BoxrecPageProfileEvents;
            await wait();
        });

        it('should return the person\'s information', () => {
            expect(doctor.name).toBe('Anthony Ruggeroli');
        });

        it('should return an array of events', () => {
            expect(doctor.events).toEqual(expect.any(Array));
            expect(doctor.events.length).toBeGreaterThan(10);
        });

    });

    describe('where role is promoter', () => {

        let promoter: BoxrecPageProfilePromoter;

        beforeAll(async () => {
            promoter = await Boxrec.getPersonById(loggedInCookie, 419406, BoxrecRole.promoter) as
                BoxrecPageProfilePromoter;
            await wait();
        });

        it('should return the company name', () => {
            expect(promoter.company).toBe('Mayweather Promotions');
        });

    });

});
