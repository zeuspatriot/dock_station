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
        console.log(id);
        var device = Devices.findOne({_id: id});
        console.log(device);
        return device;
    },
    getConsoleLog: function(){
        console.log("Yuppie");
    }
});