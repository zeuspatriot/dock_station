import { Meteor } from "meteor/meteor";

Template.deviceInfo.events({
    "submit #updateDeviceForm": function(){
        event.preventDefault();

        var device = {
            name: event.target.deviceName.value,
            os: event.target.deviceOs.value,
            browsersList: event.target.deviceBrowsers.value.split(","),
            office: event.target.deviceOffice.value
        };
        Meteor.call("updateDevice", this._id, device, function(err, result){
            if(err) return sAlert.error("Something went wrong. "+ err.message);
            sAlert.success("Device successfully updated");
        });
    }
});