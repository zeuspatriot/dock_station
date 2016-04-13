import {YOUTRACK_BASE_URL} from '/imports/constants/urls';


export var youtrackApi = {
    'call': function(type, url, user, data){
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
    }
};