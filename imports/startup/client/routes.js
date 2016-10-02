import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';
import { Devices } from "/collections";

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
Router.route("/devices/:id",function(){
    this.render('deviceInfo',{data: {deviceId: this.params.id}});
});

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
