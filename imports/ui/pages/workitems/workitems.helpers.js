import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { workitemsApi } from '/imports/api/workitems';

Template.workitems.onCreated(function onWorkitemsCreated(){
    this.state = new ReactiveDict();
    Meteor.subscribe('settings');
});
Template.workitems.helpers({
    "developers": function(){
        return Meteor.users.find({"profile.role":'dev'});
    },
    "qcs": function(){
        return Meteor.users.find({"profile.role":'qc'});
    },
    "test": function(){
        return this;
    },
    "currentWorkitems": function(){
        Session.get("eventTrigger");
        if(this.estimate){
            return _.sortBy(this.estimate[this.estimate.length-1].items,"group");
        }
        else{
            return false;
        }
    },
    "groupedLastWorkItems": function(){
        Session.get("eventTrigger");
        if(this.estimate){
            var result = workitemsApi.summEstimate(this.estimate[this.estimate.length-1].items);
            return _.map(result, function(val,key){return {group: key, value: val}});
        }
        else{
            return false;
        }
    },
    "isTa": function(){
        var isTa = false;
        if (Meteor.user()) isTa = Meteor.user().profile.role == "ta";
        return isTa;
    },
    "formatDate": function(date){
        var formatedDate = date.toLocaleDateString();
        return formatedDate;
    },
    "estimates": function(){
        var estimates = this.estimate.concat();
        if(estimates) _.extend(_.last(estimates), {"active": true});
        return estimates.reverse();
    },
    "presetItems": function(){
        Session.get("eventTrigger");
        if(window.items){
            return window.items;
        }
        else{
            window.items = [
                {
                    name: "Publish Instruction",
                    group: 1,
                    owner: "None"
                },
                {
                    name: "GIT Merge request",
                    group: 2,
                    owner: "None"
                },
                {
                    name: "Qa Report",
                    group: 3,
                    owner: "None"
                },
                {
                    name: "System testing",
                    group: 4,
                    owner: "None"
                },
                {
                    name: "",
                    group: 5,
                    owner: "None"
                }
            ];
        }
        return window.items;
    },
    "estimateTotals": function(){
        Session.get("eventTrigger");
        var estimates = workitemsApi.summEstimate(this.estimate[this.estimate.length-1].items);
        var result = {
            devTotal: 0,
            qcTotal: 0,
            total: 0
        };
        if(estimates){
            Object.keys(estimates).forEach(function(key){
                var workitem = estimates[key];
                result["devTotal"] ? result["devTotal"] += workitem.devEst : result["devTotal"] = workitem.devEst;
                result["qcTotal"] ? result["qcTotal"] += workitem.qcEst : result["qcTotal"] = workitem.qcEst;
            });
            result["total"] = (result.devTotal + result.qcTotal);
        }

        return result;
    },
    allowedToPublish: function(){
        const instance = Template.instance();
        var userRole = Meteor.user().profile.role;
        return instance.state.get('sectorSettings')[userRole];
    },
    sectorSettings: function(){
        const instance = Template.instance();
        var settings = Settings.findOne({sector:Meteor.user().profile.sector});
        instance.state.set("sectorSettings",settings);
        return settings;
    },
    currOwnerEnabled: function(){
        const instance = Template.instance();
        return instance.state.get('sectorSettings').currentOwner;
    }

});