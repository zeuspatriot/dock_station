Template.loginPage.helpers({

});
Template.loginPage.events({
    "click div#jobCode ul li a" : function(event){
        console.log(event.target);
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
        Accounts.createUser({email:email,password: password, profile:profile},function(err){
            if(err) alert(err.message);
        })
    }
});