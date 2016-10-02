import { Meteor } from 'meteor/meteor';
import { Devices } from '/collections';
import { ReactiveDict } from 'meteor/reactive-dict';

Template.dashboardPage.onCreated(function profileOnCreated(){
    this.state = new ReactiveDict();
    this.state.set("deviceList", []);
});

Template.dashboardPage.helpers({
    users: Meteor.users.find({}),
    devices: function(){
        const instance = Template.instance();
        var devices = instance.state.get("deviceList");
        Meteor.call("getAllDevices", function(err,res){
            devices = instance.state.set("deviceList",res);
        });
        return devices ;
    }
});