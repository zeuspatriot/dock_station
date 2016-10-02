//
//function youtrackReq (type, URL, data){
//    var youtrackBaseUrl = "https://maxymiser.myjetbrains.com/youtrack/rest/";
//    var currUser = Meteor.user();
//    var request = {
//        type: type,
//        withCredentials: true,
//        url: youtrackBaseUrl + URL,
//        headers: {
//            'Accept':'application/json',
//            "Authorization": "Basic " + btoa(currUser.profile.email+":"+currUser.profile.pass)
//        }
//    };
//    if(data) request.data = data;
//    return jQuery.ajax(request);
//}
//
//
//
