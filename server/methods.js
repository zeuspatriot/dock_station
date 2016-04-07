Meteor.methods({
   "formWorkItems": function(id,data){
       Tests.update(id,{$addToSet:{estimate:{items:data.workitems,comment: data.comment, updater: Meteor.user().profile.name,date: new Date()}}});
   },
    "updateTestById": function(id,data){
        Tests.update(id,{$set:data});
    },
    "createTest": function(test){
        var newId;
        newId =  Tests.insert(test, function(err, res){
            return res;
        });
        return newId;
    },
    "deleteTestById": function(id){
        Tests.remove(id);
    },
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
