function youtrackReq (type, URL, data, headers){
    var youtrackBaseUrl = "https://maxymiser.myjetbrains.com/youtrack/rest/";
    var request = {
        type: type,
        withCredentials: true,
        url: youtrackBaseUrl + URL,
        headers: {
            'Accept':'application/json',
            "Authorization": "Basic " + btoa("dmitriy.gorbachev@maxymiser.com:Salosila123")
        },
        data: data
    };
    return jQuery.ajax(request);
}
Meteor.startup(function () {

    sAlert.config({
        effect: 'bouncyflip',
        position: 'top-right',
        timeout: 3000,
        html: false,
        onRouteClose: true,
        stack: true,
        // or you can pass an object:
        // stack: {
        //     spacing: 10 // in px
        //     limit: 3 // when fourth alert appears all previous ones are cleared
        // }
        offset: 0, // in px - will be added to first alert (bottom or top - depends of the position in config)
        beep: false,
        // examples:
        // beep: '/beep.mp3'  // or you can pass an object:
        // beep: {
        //     info: '/beep-info.mp3',
        //     error: '/beep-error.mp3',
        //     success: '/beep-success.mp3',
        //     warning: '/beep-warning.mp3'
        // }
        onClose: _.noop //
        // examples:
        // onClose: function() {
        //     /* Code here will be executed once the alert closes. */
        // }
    });

});

Template.loginPage.helpers({
    "createAccount":function(){
        return Session.get("isCreateAccount");
    }
});
Template.loginPage.events({
    "click div#jobCode ul li a" : function(event){
        jQuery("#newUserRole").val(event.target.text.toLocaleLowerCase());
        jQuery("div#jobCode button span#positionText").text(event.target.text);
    },
    "click div#sector ul li a" : function(event){
        jQuery("#newUserSector").val(event.target.text.toLocaleLowerCase());
        jQuery("div#sector button span#sectorText").text(event.target.text);
    },
    "submit form#createUser": function(event){
        event.preventDefault();
        var email = event.target.email.value;
        var password = event.target.password.value;
        var sector = event.target.sector.value;
        var role = event.target.role.value;
        if(!role) sAlert.error("Role is required");
        if(!sector) sAlert.error("Sector is required");
        var profile = {
            name: event.target.name.value,
            role: role,
            email: email,
            pass: password,
            sector: sector
        };
        if(sector && role){
            youtrackReq("POST","user/login?login="+email+"&password="+password+"")
                .always(function(data){
                    if(data.status == 200){
                        Accounts.createUser({username:email,password: password, profile:profile},function(err){
                            if(err) sAlert.error(err.message);
                            else{
                                Router.go("/");
                            }
                        });
                    }
                    else if(data.status == 403){
                        sAlert.error(JSON.parse(data.responseText).value+" Please provide valid YouTrack login data",{timeout:5000});
                    }
                    else{
                        sAlert.error(JSON.parse(data.responseText).value);
                    }
                });
        }
        //Bypass YouTrack AUTH for debugging purpose --> uncomment following code, and comment POST to YouTrack
        //Accounts.createUser({username:email,password: password, profile:profile},function(err){
        //    if(err) sAlert.error(err.message);
        //    else{
        //        Router.go("/");
        //    }
        //});
    },
    "submit form#loginUser": function(event){
        event.preventDefault();
        var email = event.target.email.value;
        var password = event.target.password.value;
        Meteor.loginWithPassword({username: email}, password,function(err){
            if(err) sAlert.error(err.message);
            else{
                Router.go("/");
            }
        });
    },
    "click a#createAcc": function(){
        Session.set("isCreateAccount",true);
    },
    "click a#loginLink": function(){
        Session.set("isCreateAccount",false);
    }
});