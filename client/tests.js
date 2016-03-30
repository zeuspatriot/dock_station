Template.tests.helpers({
    "tests": function(){
        return Tests.find({},{sort:{client:1,name:1}});
    },
    "clients": function(){
        var tests = Tests.find({});
        var result = {};
        tests.forEach(function(test){
            result[test.client] = false;
        });
        return Object.keys(result);
    }
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
        var clientName = jQuery("#clientNameInput").val();
        var testName = jQuery("#testNameInput").val();

        Tests.insert({client:clientName, name:testName}, function(err, res){
            console.log(err,res);
            Router.go("/workitems/"+res);
        })
    }
});