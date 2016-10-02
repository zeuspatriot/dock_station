import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';

//Router.route("/workitems/:_id",function(){
//    var currTest = Tests.findOne({_id:this.params._id});
//    this.render('workitems',{data:currTest});
//});
Router.route("/",{
    template: "dashboardPage",
    name: "dashboard"
});

Router.route("/login/",{
    template:"loginPage",
    name:"login"
});
Router.route("/devices",{
    template: "devicesPage",
    name: "devices"
});
//Router.route("/clients",{
//    template: "clientList",
//    name: "clientList"
//});
//Router.route("/clients/:client",function(){
//    var userSector = "";
//    if(Meteor.user()) userSector = Meteor.user().profile.sector;
//    var clientTests = Tests.find({client:this.params.client,sector: userSector});
//    var result = {
//        clientName: this.params.client,
//        clientTests: clientTests
//    };
//
//    this.render('tests',{data:result});
//});

//Router.route("/profile", {
//    template : "profilePage",
//    name : "profile"
//});

Router.onBeforeAction(function () {
    if (!Meteor.user() && !Meteor.loggingIn()) {
        this.redirect('/login');
    } else {
        // required by Iron to process the route handler
        this.next();
    }
}, {
    except: ['login']
});
