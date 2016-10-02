import { Meteor } from 'meteor/meteor';


Template.devicesPage.onCreated(function profileOnCreated(){
    this.state = new ReactiveDict();
    this.state.set("isNewDeviceFlag",false);
});

Template.devicesPage.helpers({
    isNewDevice : function(){
        const instance = Template.instance();
        var isNewDevice = instance.state.get('isNewDeviceFlag');
        return isNewDevice;
    }
});