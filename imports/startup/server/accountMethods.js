import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Meteor.methods({
    changeUserPassword: function(oldPassword, newPassword){
        return Accounts.changePassword(oldPassword, newPassword);
    },
    changeUserUsername: function(userId, newUsername){
        if(userId === Meteor.user()._id){
            return Accounts.setUsername(userId, newUsername);
        }
        else{
            throw new Error("User can change only own data. (Current user: ", Meteor.user()._id);
        }
    }
});