import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { youtrackApi } from '/imports/api/youtrack';

Template.profilePage.events({
    "click div#jobCode ul li a" : function(event){
        jQuery("#userRole").val(event.target.text.toLocaleLowerCase());
        var temp = Session.get("tempProfileData");
        temp.role = event.target.text;
        Session.set("tempProfileData", temp);
        //jQuery("div#jobCode button span#positionText").text(event.target.text);
    },
    "click div#sector ul li a" : function(event){
        jQuery("#userSector").val(event.target.text.toLocaleLowerCase());
        var temp = Session.get("tempProfileData");
        temp.sector = event.target.text;
        Session.set("tempProfileData", temp);
        //jQuery("div#sector button span#sectorText").text(event.target.text);
    },
    "click #submit": function(){
        var currUserId = Meteor.user()._id;

        var newLogin = jQuery("#login").val();
        var newName = jQuery("#name").val();
        var newSector = jQuery("#userSector").val();
        var newRole = jQuery("#userRole").val();
        var data = {$set:
            {
                "profile.name":newName,
                "profile.role":newRole,
                "profile.sector": newSector,
                "profile.email": newLogin
            }
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
    }
});