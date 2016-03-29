Router.route("/workitems/:_id",function(){
    var currTest = Tests.findOne({_id:this.params._id});
    this.render('workitems',{data:currTest});
});
Router.route("/users", {
    template: "users",
    name: "users"
});
Router.route("/",{
    template: "tests",
    name: "tests"
});

Router.route("/login/",{
    template:"loginPage",
    name:"login"
});

Router.onBeforeAction(function () {
    if (!Meteor.user() && !Meteor.loggingIn()) {
        this.redirect('/login');
    } else {
        // required by Iron to process the route handler
        this.next();
    }
}, {
    except: ['login']
});
