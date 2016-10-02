import { Meteor } from "meteor/meteor";
import { Devices } from "/collections";

Meteor.publish("Devices", function(){
    if(!this.userId){
        return this.ready();
    }
    return Devices.find({});
});
