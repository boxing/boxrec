## 7.0.0 (2019-10-22)

### Changed

-   It won't affect consumers of the package but data is now more flexible by finding data by either the header or 
column data.  This is important because now table changes won't break the package
-   Decorators added to multiple areas to ensure consistency of data returned

## 6.2.0 (2019-09-21)

### Added

-   Added support for `socialMedia` for profiles

### Fixed

-   Suspensions on profile should now again be working correctly

## 6.1.0 (2019-09-17)

### Added

-   Added support for `death` for profiles

### Changed

-   All profiles support `born` and not just boxers

## 6.0.0 (2019-09-16)

### Changed

-   Birth Place/Residence on Profile page is now a string, therefore changed to string

### Fixed

-   Name/Alias on Search page fixed and should be a bit more flexible
-   Champions returned properly now since table format changed

## 5.0.3 (2019-09-12)

### Security

-   Updated dependencies (lodash bump)

## 5.0.2 (2019-08-22)

### Fixed

-   `offset` properly works now for getting people by location

## 5.0.1 (2019-08-12)

### Fixed

-   Move `boxrec-requests` back to being a necessary dependency

## 5.0.0 (2019-08-12)

### Fixed

-   Support and changes to accommodate BoxRec new roles

## 4.0.1 (2019-06-21)

### Fixed

-   Update dependency due to vulnerability

## 4.0.0 (2019-06-11)

### Changed

-   Better results for `ratings` requests.  There were more variations for `ratings` than expected

### Fixed

-   Update/remove handlebars and js-yaml dependencies

## 3.0.0 (2019-05-09)

### Added

-   Some events actually have `tickets` with contact information on how to buy.  It's rare but it exists

### Changed

-   Getting people by location now returns a `people` object by default and not `boxers`

### Fixed

-   Issue where titles with spaces like `Light Heavyweight` wouldn't be caught properly by the regex 

## 2.0.1 (2019-05-03)

### Fixed

-   `boxrec-requests` was a dev dependency but it is a normal dependency

## 2.0.0 (2019-04-30)

### Added

-   Added "total number" for certain pages ex. `numberOfBouts`, `numberOfPages`, `numberOfLocations`, `numberOfPeople`

### Changed

-   Make stateless.  Cookie is returned and is now required to pass in when making requests
-   Updated all location objects to include both `id` and `name` of town/region/country
-   Docs are now pushed to S3.  This allows maintaining multiple versions of the docs and reducing git history clutter
-   `bio_open/bio_closed` to just be `bio` to keep consistency
-   `KOs` are now the number of KOs and not the percentage

### Fixed

-   Package size is now reduced from 1.30 MB to 48 KB.  Better package build and removed dependencies
-   `bout` links are more consistent
-   Ratings are now updated to allow decimal places as BoxRec has changed their algorithm

## 1.2.0 (2019-01-16)

### Added

-   `getPersonById` now supports a getter for the profile picture by using `picture`
-   Champions method `getByWeightDivision` now supports the picture of the champion

## 1.1.0 (2019-01-15)

### Added

-   Can now use `watch` method watch a boxer
-   Can now use `unwatch` method to unwatch a boxer
-   Can now use `getWatched` method to list boxers that the user is watching

## 1.0.0 (2019-01-08)

### Added

-   Can now make `getTitles` call that returns scheduled title fights

### Fixed

-   Typescript and typings now working properly

### Changed

-   Pages aren't parsed on initialization and instead only on getter requests.  Prevents unnecessary parsing
-   Changed `getTitle` to `getTitleById` to get previous title fights by the belt ID
-   Changed `getBout` to `getBoutById` to match `getTitleById` format

## 0.19.0 (2018-11-26)

### Added

-   can now return/save the PDF version of a boxer profile
-   can now return/save the printable version of a boxer profile

## 0.18.4 (2018-10-20)

### Fixed

-   Fixed exception that would occur when event had only country but no venue/town/region

## 0.18.3 (2018-10-17)

### Fixed

-   Searching will now get the dynamic search parameter from the search page
-   Second boxer information on event bouts will come back properly now

## 0.18.2 (2018-10-09)

### Fixed

-   BoxRec now uses `ktO` instead of `pf` in the search query params

## 0.18.1 (2018-08-30)

### Fixed

-   tables are using unique IDs now.  So we'll search by the class/tag name

## 0.18.0 (2018-08-21)

### Added

-   Can now search for events by date

## 0.17.0 (2018-08-11)

### Added

-   Can now get individual bout information
-   Can now get results of fights that have occurred by division/country

## 0.16.0 (2018-07-28)

### Added

-   Added ability to get/set BoxRec cookies.  Allows developer to reuse logged in session
-   Code Climate integration to improve code quality

## 0.15.0 (2018-07-25) 

### Added

-   Can now get the profile events/bouts for other roles (doctor, inspector, judge, manager, matchmaker, promoter, referre, supervisor)
-   `offset` param now works for all endpoints that support it
-   Made use of typedocs `@hidden` tag to hide private properties, methods

### Fixed

-   Sometimes `division` was missing on pages, the code expected a string and would throw an error trying to `trim()` `undefined`.  In these scenarios it will return `null`

## 0.14.0 (2018-07-13)

### Added

-   Can now get title information including all bouts that occurred for that belt
-   Profile bouts will now return the ratings for both boxers before and after a bout

## 0.13.0 (2018-06-27)

### Added

-   Can get a list of scheduled events

### Removed

-   A number of classes would have an `output` object.  Changed them to be more meaningful like `results`, `boxers`, etc.
to make it more representative of the data

## 0.12.0 (2018-06-17)

### Added

-   Can now get venue information, including bouts that occurred there

## 0.11.0 (2018-06-12)

### Added

-   Can now get people by location
-   Can now get events by location

## 0.10.0 (2018-06-06)

### Added

-   Can now search for people other than boxer's (matchmakers, doctors, judges, etc.).  Limited for now to information in the profile table beside their profile picture on BoxRec

### Changed

-   `getBoxerById` method has been changed to `getPersonById` since you can search for people other than boxers
-   `getBoxersByName` method has been changed to `getPeopleByName` since you can search for people other than boxers

### Fixed

-   BoxRec profile bouts no longer returns link to venue/location.  Object has changed but this will return venue name and city/town still
-   wiki link for profile bouts was returning null

## 0.9.5 (2018-05-30)

### Added

-   User will be notified that they need to give GDPR consent to BoxRec

### Fixed

-   The Jest config file for the E2E tests was not reading the test file

## 0.9.4 (2018-05-27)

### Added

-   Doc generation automatically done on pre-commit

## 0.9.3 (2018-05-21)

### Fixed

-   Support for Node 10

## 0.9.2 (2018-05-21)

### Changed

-   Change profile bouts list to return latest fight at end of array

## 0.9.1 (2018-05-15)

### Fixed

-   Events that hadn't occurred yet would have a different number of columns

## 0.9.0 (2018-05-14)

### Added

-   Can now get event information by id

### Changed

-   Update `profile` bouts to match `event` bouts 

## 0.8.1 (2018-04-08)

### Added

-   Documentation on how to contribute to the project

### Changed

-   Moved page object files into separate directories

## 0.8.0 (2018-04-08)

### Added

-   Can now list champions.  Can list by weight class, by belt organization.

## 0.7.0 (2018-04-04)

### Added

-   Can now search boxer by name

## 0.6.0 (2018-04-03)

### Added

-   Profile will return a list of boxer's suspensions

## 0.5.2 (2018-04-03)

-   Separate mocks to be used from another repo

## 0.5.1 (2018-04-02)

-   Update README to include better examples on requests/responses

## 0.5.0 (2018-04-02)

### Added

-   Can now search for boxers (and only boxers at this time)

## 0.4.1 (2018-04-02)

### Changed

-   Updated webpack and ts-lint dependency to 4.1.0

## 0.4.0 (2018-03-28)

### Added

-   Ability to retrieve ratings by location, weight class, division, sex, etc.

## 0.3.0 (2018-03-27)

### Added

-   Profile `bouts` will return an array of basic information about the bout including weight, result, location, judges, referees

### Changed

-   Getting the profile `bouts` used to give the number of bouts the fighter has completed.  `bouts` is now an array of basic bout information.  `numberOfBouts` will now give you the amount of bouts that the boxer has had

## 0.2.1 (2018-03-22)

### Added

-   Better description in README about what attributes are gathered

## 0.2.0 (2018-03-21)

### Added

-   Added the ability to retrieve boxer profile stats
