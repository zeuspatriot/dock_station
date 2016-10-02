import { Meteor } from 'meteor/meteor';

Meteor.users.allow(
    {
        remove:function() {
            return true
        }
    });