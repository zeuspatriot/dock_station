

Template.loginPage.helpers({
    "createAccount":function(){
        return Session.get("isCreateAccount");
    }
});