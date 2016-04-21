import { Meteor } from 'meteor/meteor';

Meteor.methods({
    "deleteClientByName": function(clientName){
        Tests.find({client:clientName}).forEach(function(test){
            Tests.remove(test._id);
        });
    },
    "updateClientByName": function(oldClientName, newClientName){
        Tests.find({client: oldClientName}).forEach(function(test){
            Tests.update(test._id,{$set:{client: newClientName}});
        });
    }
});
