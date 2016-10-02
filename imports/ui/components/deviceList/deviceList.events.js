import { Meteor } from "meteor/meteor";
import { Router } from 'meteor/iron:router';


Template.deviceList.events({
    "click .bookDevice": function(){
        const instance = Template.instance();
        Meteor.call("updateDevice", this._id, {takenBy: Meteor.user().username}, function(err,res){
            Meteor.call("getAllDevices", function(err,res){
                instance.state.set("deviceList",res);
            });
        });
    }
});
