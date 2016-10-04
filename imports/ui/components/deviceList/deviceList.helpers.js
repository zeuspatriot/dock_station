import { Meteor } from "meteor/meteor";
import { Devices } from "/imports/api/collections";

Template.deviceList.onCreated(function profileOnCreated(){
    this.state = new ReactiveDict();
});
Meteor.subscribe("deviceList");
Template.deviceList.helpers({
    devices(){
        return Devices.find({});
    }
});