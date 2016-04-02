Template.tests.helpers({
    "tests": function(){
        //var userSector = "";
        //if(Meteor.user()) userSector = Meteor.user().profile.sector;
        //return Tests.find({sector: userSector},{sort:{client:1,name:1}});
        var clientName = "";
        if(this.fetch().length) clientName = this.fetch()[0].client;
        var userSector = "";
        if(Meteor.user()) userSector = Meteor.user().profile.sector;
        var tests = Tests.find({client: clientName, sector: userSector},{sort:{name:1}});
        return tests;
    },
    "clientName": function(){
        var clientName = "";
        if(this.fetch().length) clientName = this.fetch()[0].client;
        return clientName;
    }
});
Template.tests.events({
    "click #addNewTest": function(){
        jQuery("#addNewTestHolder").hide();
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
    "submit #createTest": function(event){
        event.preventDefault();
        var userSector = "";
        if(Meteor.user()) userSector = Meteor.user().profile.sector;
        var clientName = jQuery("#clientNameInput").val();
        var testName = jQuery("#testNameInput").val();

        Tests.insert({client:clientName, name:testName, sector: userSector}, function(err, res){
            Router.go("/workitems/"+res);
        })
    },
    "click .editTest": function(event){
        console.log(event.target);
        if(jQuery("form.editTestForm#"+this._id+" input").css("display")=="block"){
            jQuery("form.editTestForm#"+this._id+" input").hide();
            jQuery("form.editTestForm#"+this._id+" a").show();
        }
        else{
            jQuery("form.editTestForm#"+this._id+" input").show();
            jQuery("form.editTestForm#"+this._id+" a").hide();
        }
    },
    "submit form.editTestForm": function(event){
        event.preventDefault();
        var val = event.target.testName.value;
        Tests.update(this._id,{$set:{name:val}});
        jQuery("form.editTestForm#"+this._id+" input").hide();
        jQuery("form.editTestForm#"+this._id+" a").show();
    },
    "click .deleteTest": function(){
        jQuery("#deleteTestConfirm").show();
        jQuery(".greyout").show();
        jQuery("#deleteTestConfirm span.testName").text(this.name);
        jQuery("#deleteTestConfirm span.testName").attr("id",this._id);
    },
    "click #deleteTestConfirm #cancel":function(){
        jQuery("#deleteTestConfirm").hide();
        jQuery(".greyout").hide();
    },
    "click #deleteTestConfirm #ok": function(){
        var testId = jQuery("#deleteTestConfirm span.testName").attr("id");
        Tests.remove(testId);
        jQuery("#deleteTestConfirm").hide();
        jQuery(".greyout").hide();
    },
    "click .deleteClient": function(event, global){
        console.log(global);
        jQuery("#deleteTestConfirm").show();
        jQuery(".greyout").show();
        //jQuery("#deleteTestConfirm span.testName").text(this.name);
        //jQuery("#deleteTestConfirm span.testName").attr("id",this._id);
    }

});