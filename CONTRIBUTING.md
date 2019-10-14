# Contributing

## Welcome
If there is an [open issue](https://github.com/boxing/boxrec/issues) feel free to comment that you'll work on it.  This prevents multiple people from working on the same issue.

## Documentation
[Documentation on the interfaces/classes can be found here](https://boxrec-npm-docs.s3.us-east-2.amazonaws.com/master/index.html)

## Development Setup
-   Requires Node 8 - 9
-   Fork the project to create a copy of it under your GitHub user
-   `git clone` that project
-   Run `yarn install` or `npm install` within the parent directory
-   Write code and unit tests to ensure proper functionality is expected
-   For additional commands, look under the scripts section inside `package.json`
-   For testing, run `yarn test-coverage-watch` and `yarn test-e2e`

## Setup Issues
-   If you run into any issues while getting set up with development of this project, create an issue.  Working out the small details and hiccups will help others get started in the future

## Development Notes
-   If your project requires more mocks, the functionality will have to be added to this [repo](https://github.com/boxing/boxrec-mocks) beforehand.
-   If your project needs changes to the HTTPS requests to BoxRec, you'll need to work on this [repo](https://github.com/boxing/boxrec-requests)
-   Ensure if you are working on separate repos to test the changes with `npm link`.  This assumes you understand what the purpose of `npm link` is

## Code Style
-   Follow the same coding style (Use an IDE that supports ES/TSLint/EditorConfig).  The project code style should look like one person has written the code for consistency reasons
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
When your change is ready, create a pull request from your repo to this repo.  The pull request should be pointing to `develop`.  Assign one of the following people from [here](https://github.com/orgs/boxing/people).  Pull Requests are required to successfully build before they can be merged in.  We merge into `develop` and not straight to `master` as not all changes are releasable at the time.  Current Git style is like `git flow` but without squashing of commits to master.

## Requirement to have pull requests accepted
-   Must include unit tests for the new functionality/fix.  Write tests that prove the functionality works, not to merely pass code coverage
-   Must pass code review
-   Must follow the same coding style