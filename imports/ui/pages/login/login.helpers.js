import {SECTORS} from '/imports/constants/sectors';
import {ROLES} from '/imports/constants/roles';

Template.loginPage.helpers({
    createAccount: function(){
        return Session.get("isCreateAccount");
    },
    userProfile: function(){
        var profile = {
                name: "",
                role: "",
                email: "",
                pass: "",
                sector: ""
            };
        return profile;
    },
    sectors: SECTORS,
    roles: ROLES,
    tempLoginData: function(){
        if(!Session.get("tempLoginData")){
            Session.set("tempLoginData", {sector: "",role: ""});
        }
        var tempData = Session.get("tempLoginData");
        return tempData;
    }
});