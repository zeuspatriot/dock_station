
Template.tests.helpers({
    "tests": function(){
        var clientName = "";
        if(this.clientName) clientName = this.clientName;
        var tests = Tests.find({client: clientName},{sort:{name:1}});
        return tests;
    },
    "clientName": function(){
        var clientName = "";
        if(this.clientName) clientName = this.clientName;
        return clientName;
    }
});