import { Meteor } from 'meteor/meteor';

Meteor.methods({
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
    }
});
