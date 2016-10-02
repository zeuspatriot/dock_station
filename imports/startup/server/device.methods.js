import { Meteor } from "meteor/meteor";
import { Devices } from "/collections";


Meteor.methods({
    createDevice: function(device){
        return Devices.insert(device,function(err, newId){
            if(err) throw err;
            return newId;
        })
    },
    getAllDevices: function(){
        return Devices.find({}).fetch();
    },
    getDeviceById: function(id){
        var device = Devices.findOne({_id: id});
        return device;
    },
    updateDevice: function(id, device){
        return Devices.update({_id:id},{$set: device});
    },
    resetDevicesAvailability: function(){ // Delete before Production, helper function
        var devices = Devices.find({}).fetch();
        devices.forEach(function(device){
            Devices.update({_id: device._id},{$set:{takenBy: false}})
        });
    }
});