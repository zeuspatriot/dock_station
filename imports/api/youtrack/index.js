import {YOUTRACK_BASE_URL} from '/imports/constants/urls';


export var youtrackApi = {
    call: function(type, url, user, data){
        if (!user) throw new Error("User is required argument");
        var request = {
            type: type,
            withCredentials: true,
            url: YOUTRACK_BASE_URL + url,
            headers: {
                'Accept':'application/json',
                "Authorization": "Basic " + btoa(user.profile.email+":"+user.profile.pass)
            }
        };
        if(data) request.data = data;
        return jQuery.ajax(request);
    },
    loginToYoutrack: function(userName, password){
        var request = {
            type: "POST",
            withCredentials: true,
            url: YOUTRACK_BASE_URL + 'user/login',
            headers: {
                'Accept':'application/json',
                "Authorization": "Basic " + btoa(userName+":"+password)
            },
            data: {
                login: userName,
                password: password
            }
        };
        var defer = jQuery.Deferred();
        jQuery.ajax(request).always(function(res){
            if(res.status == 200){
                defer.resolve(res);
            }
            else{
                defer.reject(res);
            }
        });
        return defer.promise();

    }
};