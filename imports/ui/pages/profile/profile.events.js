import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { youtrackApi } from '/imports/api/youtrack';
import { ReactiveDict } from 'meteor/reactive-dict';

Template.profilePage.events({
    "click div#jobCode ul li a" : function(event, instance){
        jQuery("#userRole").val(event.target.text.toLocaleLowerCase());
        var temp = instance.state.get("tempProfileData");
        temp.role = event.target.text;
        instance.state.set("tempProfileData", temp);
    },
    "click div#sector ul li a" : function(event, instance){
        jQuery("#userSector").val(event.target.text.toLocaleLowerCase());
        var temp = instance.state.get("tempProfileData");
        temp.sector = event.target.text;
        instance.state.set("tempProfileData", temp);
    },
    "click #submit": function(){
        var currUserId = Meteor.user()._id;

        var newLogin = jQuery("#login").val();
        var newName = jQuery("#name").val();
        var newSector = jQuery("#userSector").val();
        var newRole = jQuery("#userRole").val();
        var data = {
                "profile.name":newName,
                "profile.role":newRole,
                "profile.sector": newSector,
                "profile.email": newLogin
            };

        Meteor.call("changeUserData", currUserId, data);

        youtrackApi.loginToYoutrack(newLogin, Meteor.user().profile.pass).done(function(data){
            Meteor.call("changeUserUsername",currUserId, newLogin, function(err, res){
                if(err) throw err;
                sAlert.success("Changes saved!");
            });
        }).fail(function(data){
            sAlert.error(JSON.parse(data.responseText).value+" Please provide valid YouTrack login data",{timeout:5000});
        });




    },
    'submit #submitChangePassword': function(event){
        event.preventDefault();
        var oldPass = event.target.oldPassword.value;
        var newPass = event.target.newPassword.value;
        console.log(oldPass,newPass);

        if(oldPass != newPass){
            Accounts.changePassword(oldPass, newPass, function(err, res){
                if (err) {
                    console.error(err);
                    sAlert.error(err.message);
                }
                else{
                    sAlert.success("Password successfully changed");
                    event.target.oldPassword.value = "";
                    event.target.newPassword.value = "";
                    Meteor.call("changeUserPassword", Meteor.user()._id, newPass);
                }
            });
        }
        else{
            sAlert.error("New Password must not be same as old password");
        }
    },
    'submit #settings': function(event, instance){
        event.preventDefault();
        var settings = {};
        jQuery("form#"+event.target.id).find("input").each(function(){
            this.type == 'checkbox'
                ? settings[this.name] = this.checked
                : settings[this.name] = this.value;
        });
        Meteor.call("updateSettings", Meteor.user().profile.sector, settings, function(err,resp){
            if(err) sAlert.error(err);
            else {
                sAlert.success("Settings saved");
            }
        });

    }
});