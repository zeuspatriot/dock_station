import { Meteor } from 'meteor/meteor';


Template.devicesPage.events({
    "submit #createDeviceForm": function(event){
        event.preventDefault();
        var device = {
            name: event.target.deviceName.value,
            os: event.target.deviceOs.value,
            browsersList: event.target.deviceBrowsers.value.split(";"),
            office: event.target.deviceOffice.value,
            takenBy: false
        };
        console.log(device);
        Meteor.call("createDevice", device, function(err,res){
            if(err) return err;
            sAlert.success("New Device created");
            jQuery('input').value("");
        });
    }
});