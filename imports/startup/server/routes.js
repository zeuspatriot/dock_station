import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';
import { Devices } from "/imports/api/collections";

//Router.route("/workitems/:_id",function(){
//    var currTest = Tests.findOne({_id:this.params._id});
//    this.render('workitems',{data:currTest});
//});

Router.route('/user/:id',{where: 'server'})
    .get(function () {
        //Meteor.call("echo", this.params.id);
        Meteor.call("takeBookedDevices", this.params.id);
        this.response.end('get request\n');
    });
