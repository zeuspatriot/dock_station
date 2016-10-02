import { Meteor } from 'meteor/meteor';
import { Devices } from '/collections';
import { ReactiveDict } from 'meteor/reactive-dict';

Template.dashboardPage.onCreated(function profileOnCreated(){
    this.state = new ReactiveDict();
    this.state.set("deviceList", []);
});

Template.dashboardPage.helpers({
    users: Meteor.users.find({})
});