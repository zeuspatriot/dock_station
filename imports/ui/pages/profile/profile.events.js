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
        var oldPass = jQuery("#oldPassword").val();
        var newPass = jQuery("#newPassword").val();
        var newLogin = jQuery("#login").val();
        var newName = jQuery("#name").val();
        var newSector = jQuery("#userSector").val();
        var newRole = jQuery("#userRole").val();

        Meteor.users.update(currUserId,
            {$set:
                {
                    "profile.name":newName,
                    "profile.role":newRole,
                    "profile.sector": newSector,
                    "profile.email": newLogin
                }
            }
        );

        youtrackApi.loginToYoutrack(newLogin, Meteor.user().profile.pass).done(function(data){
            Meteor.call("changeUserUsername",currUserId, newLogin, function(err, res){
                if(err) throw err;
                sAlert.success("Changes saved!");
            });
        }).fail(function(data){
            sAlert.error(JSON.parse(data.responseText).value+" Please provide valid YouTrack login data",{timeout:5000});
        });



        if(oldPass && newPass){
            Meteor.call("changeUSerPassword", oldPass, newPass);
            //Accounts.changePassword(oldPass, newPass);
        }
    }
});