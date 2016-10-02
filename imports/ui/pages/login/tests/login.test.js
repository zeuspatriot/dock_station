
describe('on Login Page', function () {
    beforeEach(function () {
        browser.url('http://localhost:3000/login');
        if(browser.isExisting('#logout')){
            browser.click('#logout');
        }
    });


    it('it is not possible to login with false credentials @watch', function () {
        assert.equal(true, false); //init stub, replace with proper assert
    });
    it('it is possible to log in with valid credentials @watch', function(){
        browser.setValue('#newUserEmail','Test.Name');
        browser.setValue('#newUserPassword','TestPass');
        browser.submitForm('#loginUser');
        browser.waitUntil(function(){
            return browser.isExisting('#logout');
        }, 5000);
        assert.equal(browser.isExisting('#logout'), true); //init stub, replace with proper assert
    });

    afterEach(function(){
       if(this.currentTest.state == 'failed'){
           var testNameAndReason = this.currentTest.title + "_" + this.currentTest.err.message;
           browser.saveScreenshot('./errScrn/'+testNameAndReason+'.png');
       }
    });
});

describe('on Register page', function(){
   beforeEach(function(){
       browser.url('http://localhost:3000/login');
       browser.click('#createAcc');
   });

    it('it is not possible to create account with invalid Youtrack login @watch', function(){
        assert.equal(true, false); //init stub, replace with proper assert
    });
    it('it is not possible to create account with invalid Youtrack password @watch', function(){
        assert.equal(true, false); //init stub, replace with proper assert
    });
    it('it is possible to create account with valid credentials @watch', function(){
        assert.equal(true, false); //init stub, replace with proper assert
    });
    it('correct role and sector are assigned to newly created account @watch', function(){
        assert.equal(true, false); //init stub, replace with proper assert
    });

    afterEach(function(){
        if(this.currentTest.state == 'failed'){
            var testNameAndReason = this.currentTest.title + "_" + this.currentTest.err.message;
            browser.saveScreenshot('./errScrn/'+testNameAndReason+'.png');
        }
    });
});