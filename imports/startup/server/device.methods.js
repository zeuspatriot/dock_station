import { Meteor } from "meteor/meteor";
import { Devices } from "/imports/api/collections";

Meteor.publish('deviceList', function(){
    return Devices.find({});
});

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
    bookDevice: function(id){
        Devices.update(id, {$set:{takenBy: Meteor.user().username, booked: true}});
        Meteor.setTimeout(function(){
            if(Devices.findOne({_id: id}).booked){
                return Devices.update(id, {$set:{takenBy: false, booked:false}});
            }
        },10000);
    },
    resetDevicesAvailability: function(){ // Delete before Production, helper function
        var devices = Devices.find({}).fetch();
        devices.forEach(function(device){
            Devices.update({_id: device._id},{$set:{takenBy: false}})
        });
    },
    takeBookedDevices: function(userId){
        var user = Meteor.users.findOne({_id: userId});
        if(user){
            var devicesForUser = Devices.find({takenBy: user.username, booked: true}).fetch();
            if(devicesForUser.length){
                devicesForUser.forEach(function(device){
                    Devices.update(device._id,{$set:{booked: false}});
                });
            }
        }
        else{
            console.log("User was not found");
        }
    },
    returnDevice: function(deviceId){
        var lastUser = Devices.findOne(deviceId).takenBy;
        Devices.update(deviceId, {$set:{takenBy: false, lastUser: lastUser}});
    },
    echo: function(id){
        console.log(Meteor.users.findOne({_id: id}).username);
    }
});