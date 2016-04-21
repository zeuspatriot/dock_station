import { Meteor } from 'meteor/meteor';

Template.clientList.helpers({
    "clientNames":function(){
        var userSector = "";
        if(Meteor.user()) userSector = Meteor.user().profile.sector;
        var tests = Tests.find({sector:userSector});
        var clientNames = {};
        tests.forEach(function(test){
            clientNames[test.client] = false;
        });
        return Object.keys(clientNames);
    }
});