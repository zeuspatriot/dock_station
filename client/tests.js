Template.tests.helpers({
    "tests": function(){
        //var userSector = "";
        //if(Meteor.user()) userSector = Meteor.user().profile.sector;
        //return Tests.find({sector: userSector},{sort:{client:1,name:1}});
        var clientName = "";
        if(this.fetch().length) clientName = this.fetch()[0].client;
        var userSector = "";
        if(Meteor.user()) userSector = Meteor.user().profile.sector;
        var tests = Tests.find({client: clientName, sector: userSector});
        return tests;
    },
    "clientName": function(){
        var clientName = "";
        if(this.fetch().length) clientName = this.fetch()[0].client;
        return clientName;
    }
    //"clients": function(){
    //    var tests = Tests.find({});
    //    var result = {};
    //    tests.forEach(function(test){
    //        result[test.client] = false;
    //    });
    //    return Object.keys(result);
    //}
});
Template.tests.events({
    "click #addNewTest": function(){
        jQuery("li#addNewTestHolder").hide();
        jQuery("#newTest").removeClass("hidden");
    },
    "click #addAnother": function(){
        jQuery("#clientNameInput").removeClass("hidden");
        jQuery("#clientNameHolder").hide();
    },
    "click #clientNameHolder li.clientName a": function(event){
        jQuery("#clientNameInput").val(event.target.text);
        jQuery("#clientNameHolder span#text").text(event.target.text);
    },
    "click #createTest": function(){
        var userSector = "";
        if(Meteor.user()) userSector = Meteor.user().profile.sector;
        var clientName = jQuery("#clientNameInput").val();
        var testName = jQuery("#testNameInput").val();

        Tests.insert({client:clientName, name:testName, sector: userSector}, function(err, res){
            Router.go("/workitems/"+res);
        })
    }
});