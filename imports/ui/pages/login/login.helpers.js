import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';

Template.loginPage.onCreated(function loginOnCreated(){
    this.state = new ReactiveDict();
    //this.state.set("tempLoginData", {sector: "",role: ""});
    this.state.set("isCreateAccount", false);
});

Template.loginPage.helpers({
    createAccount: function(){
        const instance = Template.instance();
        return instance.state.get("isCreateAccount");
    }
    //,
    //userProfile: function(){
    //    var profile = {
    //            name: "",
    //            email: "",
    //            pass: ""
    //        };
    //    return profile;
    //}
    //,
    //tempLoginData: function(){
    //    const instance = Template.instance();
    //    var tempData = instance.state.get("tempLoginData");
    //    return tempData;
    //}
});