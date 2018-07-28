## 0.16.0 (2018-07-28)

### Added

- Added ability to get/set BoxRec cookies.  Allows developer to reuse logged in session
- Code Climate integration to improve code quality

## 0.15.0 (2018-07-25) 

### Added

- Can now get the profile events/bouts for other roles (doctor, inspector, judge, manager, matchmaker, promoter, referre, supervisor)
- `offset` param now works for all endpoints that support it
- Made use of typedocs `@hidden` tag to hide private properties, methods

### Fixed

- Sometimes `division` was missing on pages, the code expected a string and would throw an error trying to `trim()` `undefined`.  In these scenarios it will return `null`

## 0.14.0 (2018-07-13)

### Added

- Can now get title information including all bouts that occurred for that belt
- Profile bouts will now return the ratings for both boxers before and after a bout

## 0.13.0 (2018-06-27)

### Added

- Can get a list of scheduled events

### Removed

- A number of classes would have an `output` object.  Changed them to be more meaningful like `results`, `boxers`, etc.
to make it more representative of the data

## 0.12.0 (2018-06-17)

### Added

- Can now get venue information, including bouts that occurred there

## 0.11.0 (2018-06-12)

### Added

- Can now get people by location
- Can now get events by location

## 0.10.0 (2018-06-06)

### Added

- Can now search for people other than boxer's (matchmakers, doctors, judges, etc.).  Limited for now to information in the profile table beside their profile picture on BoxRec

### Changed

- `getBoxerById` method has been changed to `getPersonById` since you can search for people other than boxers
- `getBoxersByName` method has been changed to `getPeopleByName` since you can search for people other than boxers

### Fixed

- BoxRec profile bouts no longer returns link to venue/location.  Object has changed but this will return venue name and city/town still
- wiki link for profile bouts was returning null

## 0.9.5 (2018-05-30)

### Added

- User will be notified that they need to give GDPR consent to BoxRec

### Fixed

- The Jest config file for the E2E tests was not reading the test file

## 0.9.4 (2018-05-27)

### Added

- Doc generation automatically done on pre-commit

## 0.9.3 (2018-05-21)

### Fixed

- Support for Node 10

## 0.9.2 (2018-05-21)

### Changed

- Change profile bouts list to return latest fight at end of array

## 0.9.1 (2018-05-15)

### Fixed

- Events that hadn't occurred yet would have a different number of columns

## 0.9.0 (2018-05-14)

### Added

- Can now get event information by id

### Changed

- Update `profile` bouts to match `event` bouts 

## 0.8.1 (2018-04-08)

### Added

- Documentation on how to contribute to the project

### Changed

- Moved page object files into separate directories

## 0.8.0 (2018-04-08)

### Added

- Can now list champions.  Can list by weight class, by belt organization.

## 0.7.0 (2018-04-04)

### Added

- Can now search boxer by name

## 0.6.0 (2018-04-03)

### Added

- Profile will return a list of boxer's suspensions

## 0.5.2 (2018-04-03)

- Separate mocks to be used from another repo

## 0.5.1 (2018-04-02)

- Update README to include better examples on requests/responses

## 0.5.0 (2018-04-02)

### Added

- Can now search for boxers (and only boxers at this time)

## 0.4.1 (2018-04-02)

### Changed

- Updated webpack and ts-lint dependency to 4.1.0

## 0.4.0 (2018-03-28)

### Added

- Ability to retrieve ratings by location, weight class, division, sex, etc.

## 0.3.0 (2018-03-27)

### Added

- Profile `bouts` will return an array of basic information about the bout including weight, result, location, judges, referees

### Changed

- Getting the profile `bouts` used to give the number of bouts the fighter has completed.  `bouts` is now an array of basic bout information.  `numberOfBouts` will now give you the amount of bouts that the boxer has had

## 0.2.1 (2018-03-22)

### Added

- Better description in README about what attributes are gathered

## 0.2.0 (2018-03-21)

### Added

- Added the ability to retrieve boxer profile stats
