import {Meteor} from 'meteor/meteor';
import {sAlert} from 'meteor/juliancwirko:s-alert';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Accounts } from 'meteor/accounts-base';

Template.loginPage.events({
    "submit form#createUser": function(event){
        event.preventDefault();
        if(event.target.password.value != event.target.passwordConfirm.value){
            return sAlert.error("Passwords does not match");
        }
        var email = event.target.email.value;
        var password = event.target.password.value;
        var profile = {
            admin: false
        };

        Accounts.createUser({username:email,password: password, profile:profile},function(err){
            if(err) sAlert.error(err.message);
            else{
                Router.go("/");
            }
        });
    },
    "submit form#loginUser": function(event){
        event.preventDefault();
        var email = event.target.email.value;
        var password = event.target.password.value;
        Meteor.loginWithPassword({email: email}, password,function(err){
            if(err) sAlert.error(err.message);
            else{
                Router.go("/");
            }
        });
    },
    "click a#createAcc": function(event, instance){
        instance.state.set("isCreateAccount",true);
    },
    "click a#loginLink": function(event, instance){
        instance.state.set("isCreateAccount",false);
    }
});