import { Meteor } from 'meteor/meteor';

Meteor.methods({
    "formWorkItems": function(id,data){
        Tests.update(id,{$addToSet:{estimate:{items:data.workitems,comment: data.comment, updater: Meteor.user().profile.name,date: new Date()}}});
    },
    resetDev: function(id){
        Tests.update(id,{$set:{dev:""}});
    },
    resetQc: function(id){
        Tests.update(id,{$set:{qc:""}});
    }
});
