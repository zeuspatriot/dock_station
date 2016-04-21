Meteor.publish("users", function (sector){
    if(!this.userId){
        return this.ready();
    }
    return Meteor.users.find({'profile.sector': sector},{fields:{"profile.name":1,"profile.email":1,"profile.role":1}});
});
Meteor.publish("tests", function(sector){
    if(!this.userId){
        return this.ready();
    }
    return Tests.find({sector: sector});
});
Meteor.publish('settings', function(){
    return Settings.find({});
});