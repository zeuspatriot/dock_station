import { Meteor } from "meteor/meteor";

Template.deviceList.onCreated(function profileOnCreated(){
    this.state = new ReactiveDict();
    this.state.set("deviceList", []);
});

Template.deviceList.helpers({
    devices: function(){
        const instance = Template.instance();
        var devices = instance.state.get("deviceList");
        Meteor.call("getAllDevices", function(err,res){
            devices = instance.state.set("deviceList",res);
        });
        return devices ;
    }
});