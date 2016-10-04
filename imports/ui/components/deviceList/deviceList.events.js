import { Meteor } from "meteor/meteor";
import { Router } from 'meteor/iron:router';


Template.deviceList.events({
    "click .bookDevice": function(){
        Meteor.call("bookDevice", this._id);
    }
});
