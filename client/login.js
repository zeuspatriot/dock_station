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
    "submit form#createUser": function(event){
        event.preventDefault();
        var email = event.target.email.value;
        var password = event.target.password.value;
        var profile = {
            name: event.target.name.value,
            role: event.target.role.value
        };
        youtrackReq("POST","user/login?login="+email+"&password="+password+"")
            .always(function(data){
               console.log("in Done: ",data);
                if(data.status == 200){
                    Accounts.createUser({email:email,password: password, profile:profile},function(err){
                        if(err) alert(err.message);
                        else{
                            Router.go("/");
                        }
                    });
                }
                else{
                    alert(data.responseText);
                }
            });

    },
    "submit form#loginUser": function(event){
        event.preventDefault();
        var email = event.target.email.value;
        var password = event.target.password.value;
        Meteor.loginWithPassword(email, password,function(err){
            if(err) alert(err.message);
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