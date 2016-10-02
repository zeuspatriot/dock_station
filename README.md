# Workitems tool
This tool helps to build and create Workitems, and post them to YouTrack with a single click. Provides posibility to review estimation history, as well as return point to any instance of estimation.

### Our Technology stack looks like this:
* [Meteor.js](https://www.meteor.com/) as application language
* [Twitter_Bootstrap](http://getbootstrap.com/components/) as CSS library
* [Mocha](https://mochajs.org/) for Unit tests and end-to-end tests
* [Chimp](https://chimp.readme.io/) as test runner for end-to-end tests
* [WebdriverIO](http://webdriver.io/api.html) (part of Chimp) as `browser communication` tool

# Table of Contents
[Tool usage requirements and limitations](#tool-usage-requirements-and-limitations)

[Tool features](#tool-features)

[Development and contribution](#development-and-contribution)

---------

# Tool usage requirements and limitations:

1. For Register you have to use YouTrack login (Make sure that you use Login, as it is not allways same as your EMAIL), you may use anything you like for password.
2. Anytime you click **Post to Youtrack** button will **create a new set of imtems each time (may duplicate)** (You will be prompted to enter your Youtrack Password, so we will not have to store it)
3. If you will provide wrong password in promted window, you will have to refresh the page to have Password input once more.
4. Most of errors are self explainatory, but sometimes, you might have error 400 with some email data -- this means that user used his EMAIL instead of Youtrack Login.


# Tool features:

1. Possible to create multiple Clients, as well as multiple Tests, to store Estimates and Workitems
2. Possible to create multiple Estimates(workitems breakdowns), and store them. By doing so, you will have multipple Delivery options to select from
3. Possible to assign Developer and QC to the Campaign.
4. Possible to automatically set Current owner to Dev or QC

# Development and contribution

## Git workflow for this project
Lets agree to use few simple guidelines below, in order to keep our application modular, manageble, and interesting to develope
* Create new Branch per each feature you are about to work with.
* Always Branch from Master when you start new feature
* If possible, add YT ticket ID for the feature you are working with, to the title of your branch (`eg. YT0302_delete_history`)
* Try to write Unit tests for your code before you request Merge with Master
* Assing `Dmitriy Gorbacev` to your Merge request whenever you finished with your feature


### Setup local copy to work with
1. Install Meteor.js
2. Clone the repo to your machine
3. From a project folder, run command line, and type `meteor`

> Note that some errors with different packages were noticed, this is mostly environment problem. try to run `meteor` command multiple times if you will see errors with some modules.

4. After all dependencies will be downloaded, your server will be up.
5. Start your testing servers (see instructions below).

### Start testing servers in parallel
1. From a project folder, run `meteor test --driver-package practicalmeteor:mocha --port 3030`. This will start mini version of your application that will run Unit tests for Server part, and display results under `http://localhost:3030`
2. From anywhere, run `npm install --g chimp` to install [Chimp](https://chimp.readme.io/) (also [Check out WebdriverIO](http://webdriver.io/api.html) for API cheatsheet, use `browser` instead of `client`)
3. run `npm install -g phantomjs`, in order to install headless browser for testing.
4. From a project folder, run `chimp .config/chimp.js`, this will run end-to-end tests, and show reports in your console, updating each time you save your code.