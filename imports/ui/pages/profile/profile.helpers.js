import {Meteor} from 'meteor/meteor';
import {SECTORS} from '/imports/constants/sectors';
import {ROLES} from '/imports/constants/roles';

Template.profilePage.helpers({
    currUser : function(){
        return Meteor.user();
    },
    sectors: SECTORS,
    roles: ROLES,
    tempProfileData: function(){
        if(!Session.get("tempProfileData")){
            Session.set("tempProfileData", {sector: "",role: ""});
        }
        var tempData = Session.get("tempProfileData");
        return tempData;
    }
});