import { Meteor } from 'meteor/meteor';

Template.clientList.events({
    "click button.clientNames":function(event){
        var clientName = jQuery(event.target).text();
        Router.go("/clients/"+clientName);
    },
    "click button#submitNewClient": function(event){
        var clientName = jQuery("input#newClientName").val();
        var userSector = "";
        if(Meteor.user()) userSector = Meteor.user().profile.sector;
        var test = {client:clientName, sector:userSector};
        Meteor.call("createTest",test);
        //Tests.insert({client:clientName, sector:userSector});
        jQuery("#createClient").show();
        jQuery("#newClient").hide();
        jQuery("input#newClientName").val("");
    },
    "click button#createClient": function(){
        jQuery("#createClient").hide();
        jQuery("#newClient").show();
    }
});