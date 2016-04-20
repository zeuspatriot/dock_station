import {youtrackApi} from '/imports/api/youtrack';
import {Meteor} from 'meteor/meteor';
import {sAlert} from 'meteor/juliancwirko:s-alert';
import { ReactiveDict } from 'meteor/reactive-dict';

Template.loginPage.events({
    "click div#jobCode ul li a" : function(event, instance){
        jQuery("#newUserRole").val(event.target.text.toLocaleLowerCase());
        var temp = instance.state.get("tempLoginData");
        temp.role = event.target.text;
        instance.state.set("tempLoginData", temp);
    },
    "click div#sector ul li a" : function(event, instance){
        jQuery("#newUserSector").val(event.target.text.toLocaleLowerCase());
        var temp = instance.state.get("tempLoginData");
        temp.sector = event.target.text;
        instance.state.set("tempLoginData", temp);
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
            youtrackApi.call("POST","user/login?login="+email+"&password="+password+"",Meteor.user())
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
    "click a#createAcc": function(event, instance){
        instance.state.set("isCreateAccount",true);
    },
    "click a#loginLink": function(event, instance){
        instance.state.set("isCreateAccount",false);
    }
});