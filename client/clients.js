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
Template.clientList.events({
    "click button.clientNames":function(event){
        var clientName = jQuery(event.target).text();
        Router.go("/clients/"+clientName);
    },
    "click button#submitNewClient": function(event){
        var clientName = jQuery("input#newClientName").val();
        var userSector = "";
        if(Meteor.user()) userSector = Meteor.user().profile.sector;
        var test = {client:clientName, sector:userSector}
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