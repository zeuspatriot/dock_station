import { Meteor } from "meteor/meteor";
import { Devices } from "/imports/api/collections";

Template.deviceInfo.onCreated(function(){
    this.state = new ReactiveDict();
});
Meteor.subscribe("deviceList");
Template.deviceInfo.helpers({
   device: function(){
       //const instance = Template.instance();
       //Meteor.call("getDeviceById","WcwKup67Joxf5vxJH", function(err,res){
       //    instance.state.set("device", res)
       //});
       //var device = instance.state.get("device");
       //return device;
       return Devices.findOne(this.deviceId)
   }
});
