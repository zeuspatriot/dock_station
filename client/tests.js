function refreshPopup (){
    jQuery("#deleteTestConfirm").text("");
    jQuery("#deleteTestConfirm").append('<div class="panel panel-default center-block"><div class="panel-heading" style="background-color: orangered; color: white;">Delete action is permanent</div><div class="panel-body"><span id="holder">Are you sure, that you want to delete "<span class="testName"></span>", action is permanent, and cannot be reverted</span><br><div class="center-block" style="text-align: center"><button class="btn btn-warning pull-left" id="cancel" style="margin-top: 10px">Cancel</button><button class="btn btn-primary pull-right" id="ok" style="margin-top: 10px">Delete Test</button></div></div></div>');
}

Template.tests.helpers({
    "tests": function(){
        var clientName = "";
        if(this.clientName) clientName = this.clientName;
        var userSector = "";
        if(Meteor.user()) userSector = Meteor.user().profile.sector;
        var tests = Tests.find({client: clientName, sector: userSector},{sort:{name:1}});
        return tests;
    },
    "clientName": function(){
        var clientName = "";
        if(this.clientName) clientName = this.clientName;
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
        refreshPopup();
    },
    "click #deleteTestConfirm #ok": function(event, global){
        var clientName = global.data.clientName;
        var testId = jQuery("#deleteTestConfirm span.testName").attr("id");

        if(jQuery("#deleteTestConfirm span.testName").attr("id") == clientName){
            Tests.find({client:clientName}).forEach(function(test){
                Tests.remove(test._id);
            });
            Router.go("/clients/");
        }
        else {
            Tests.remove(testId);
        }

        jQuery("#deleteTestConfirm").hide();
        jQuery(".greyout").hide();
        refreshPopup();
    },
    "click .deleteClient": function(event, global){
        var clientName = global.data.clientName;
        jQuery("#deleteTestConfirm").show();
        jQuery(".greyout").show();
        jQuery("#deleteTestConfirm span.testName").text(clientName);
        jQuery("#deleteTestConfirm span.testName").attr('id',clientName);
    },
    "click .editClient": function(){
        jQuery("#clientName").hide();
        jQuery("#editClientName").show();
    },
    "submit .editClientForm": function(event, global){
        event.preventDefault();
        var clientName = global.data.clientName;
        var newClientName = event.target.clientName.value;
        Tests.find({client: clientName}).forEach(function(test){
            Tests.update(test._id,{$set:{client: newClientName}});
        });
        Router.go("/clients/"+newClientName);
        jQuery("#clientName").show();
        jQuery("#editClientName").hide();
    }

});