import {Meteor} from 'meteor/meteor';
import {SECTORS} from '/imports/constants/sectors';
import {ROLES} from '/imports/constants/roles';
import { ReactiveDict } from 'meteor/reactive-dict';

Template.profilePage.onCreated(function profileOnCreated(){
    this.state = new ReactiveDict();
    this.state.set("tempProfileData", {sector: "",role: ""});
    Meteor.subscribe("settings");
});

Template.profilePage.helpers({
    currUser : function(){
        return Meteor.user();
    },
    sectors: SECTORS,
    roles: ROLES,
    tempProfileData: function(){
        const instance = Template.instance();
        var tempData = instance.state.get('tempProfileData');
        return tempData;
    },
    sectorSettings: function(){
        return Settings.findOne({sector:Meteor.user().profile.sector});
    }
});

