import './login.html';
import './login.helpers';
import './login.events';


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

