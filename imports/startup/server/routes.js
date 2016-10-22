import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';
import { Devices } from "/imports/api/collections";


Router.route('/qrCode/:id',{where: 'server'})
    .get(function () {
        if(Meteor.users.findOne(this.params.id)){
            Meteor.call("takeBookedDevices", this.params.id);
            this.response.end('User Found\n');
        }
        else if(Devices.findOne(this.params.id)){
            Meteor.call("returnDevice", this.params.id);
            this.response.end('Device Found\n');
        }
        else{
            this.response.end("400");
        }
    });
