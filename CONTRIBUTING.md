# Contributing

## Welcome
If there is an [open issue](https://github.com/boxing/boxrec/issues) feel free to comment that you'll work on it.  This prevents multiple people from working on the same issue.

## Documentation
[Can be found here](./docs/)

## Development Setup
-   Requires Node 7.6 - 9
-   `git clone` this project
-   Run `yarn install` or `npm install` within the parent directory
-   Run `yarn start` to compile
-   For additional commands, look under the scripts section inside `package.json`
-   For testing, run `yarn test-coverage-watch` and `yarn test-e2e`.  If your project requires more mocks, the functionality will have to be added to this [repo](https://github.com/boxing/boxrec-mocks) beforehand.

## Code Style
-   Follow the same coding style (Use an IDE that supports ES/TSLint/EditorConfig)
-   Keep pull requests to one feature/fix
-   If you're unsure of anything, [ask one of these people](https://github.com/orgs/boxing/people)

## Issues and Bugs
If you have found a problem, follow these steps:

-   Create an issue [here](https://github.com/boxing/boxrec/issues)
-   Give a good example on how to reproduce this issue.  Ex. When I search for `Mike Tyson` using these parameters `{ first_name: "Mike", last_name: "Tyson" }`, it says he has X wins but he actually has Y wins.
-   Label it accordingly: "bug" if it's an issue with this code.  
-   [Sometimes the UI for BoxRec changes and breaks the code as well, there is a specific label for that](https://github.com/boxing/boxrec/issues?q=is%3Aissue+is%3Aclosed+label%3A%22BoxRec+UI+changed%22).  This allows tracking of changes to the BoxRec UI.

## Security Vulnerabilities
If you have a found a security vulnerability with this package or a security vulnerability please create an [issue](https://github.com/boxing/boxrec/issues).  Emails will be sent out notifying [people in this org](https://github.com/orgs/boxing/people) 

## Suggestions
If you have a suggestion, feel free to create an issue with the label "suggestion".  Please note that this project is more of a BoxRec API and nothing more.

## Pull Requests
Create a pull request.  Assign one of the following people from [here](https://github.com/orgs/boxing/people).  Pull Requests are required to successfully build before they can be merged in.

## Requirement to have pull requests accepted
-   Must include unit tests for the new functionality/fix.  Write tests that prove the functionality works, not to merely pass code coverage
-   Must pass code review
-   Must follow the same coding style