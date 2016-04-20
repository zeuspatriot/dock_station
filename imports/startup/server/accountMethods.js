import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Meteor.methods({
    changeUserPassword: function(userId, newPassword){
        return Meteor.users.update(userId, {$set:{"profile.pass":newPassword}});
        //return Accounts.changePassword(oldPassword, newPassword);
    },
    changeUserUsername: function(userId, newUsername){
        if(userId === Meteor.user()._id){
            return Accounts.setUsername(userId, newUsername);
        }
        else{
            throw new Error("User can change only own data. (Current user: ", Meteor.user()._id);
        }
    },
    changeUserData: function(userId, data){
        return Meteor.users.update(userId, data);
    }
});