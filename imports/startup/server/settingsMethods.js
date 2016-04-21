import { Meteor } from "meteor/meteor";

Meteor.methods({
    updateSettings: function(sector, settings){
        if(sector === Meteor.user().profile.sector){
            return Settings.update({sector: sector}, {$set:settings});
        }
        else{
            throw new Error("You may only change your sector settings. "+ Meteor.user()._id);
        }
    }
});