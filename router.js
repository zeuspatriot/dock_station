//Router.route("/workitems/:_id",function(){
//    var currTest = Tests.findOne({_id:this.params._id});
//    this.render('workitems',{data:currTest});
//});
//Router.route("/users", {
//    template: "users",
//    name: "users"
//});
//Router.route("/",{
//    template: "clientList",
//    name: "tests"
//});
//
//Router.route("/login/",{
//    template:"loginPage",
//    name:"login"
//});
//Router.route("/clients",{
//    template: "clientList",
//    name: "clientList"
//});
//Router.route("/clients/:client",function(){
//    var userSector = "";
//    if(Meteor.user()) userSector = Meteor.user().profile.sector;
//    var clientTests = Tests.find({client:this.params.client,sector: userSector});
//    var result = {
//        clientName: this.params.client,
//        clientTests: clientTests
//    };
//
//    this.render('tests',{data:result});
//});
//
//Router.onBeforeAction(function () {
//    if (!Meteor.user() && !Meteor.loggingIn()) {
//        this.redirect('/login');
//    } else {
//        // required by Iron to process the route handler
//        var userSector = "";
//        if(Meteor.user()) userSector = Meteor.user().profile.sector;
//        Meteor.subscribe("tests", userSector);
//        Meteor.subscribe('users',userSector);
//        this.next();
//    }
//}, {
//    except: ['login']
//});
