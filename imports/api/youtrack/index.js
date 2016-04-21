import {YOUTRACK_BASE_URL} from '/imports/constants/urls';

var settings;

export var youtrackApi = {
    setSettings: function(userSector){
        settings = Settings.findOne({sector: userSector});
        console.log(settings);
    },
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

    },
    getTicket: function(ticketId,user){
        var request = {
            type: "GET",
            withCredentials: true,
            url: YOUTRACK_BASE_URL + 'issue/'+ticketId,
            headers: {
                'Accept':'application/json',
                "Authorization": "Basic " + btoa(user.profile.email+":"+user.profile.pass)
            }
        };
        return jQuery.ajax(request);
    },
    createNewWorkItem: function(newItemData, user){
        var request = {
            type: "POST",
            withCredentials: true,
            url: YOUTRACK_BASE_URL + 'issue/',
            headers: {
                'Accept':'application/json',
                "Authorization": "Basic " + btoa(user.profile.email+":"+user.profile.pass)
            },
            data: newItemData
        };
        return jQuery.ajax(request);
    },
    changeEstimate: function(createdItemId, devEst, qcEst, user){
        var estimation = devEst + qcEst;
        var request = {
            type: "POST",
            withCredentials: true,
            url: YOUTRACK_BASE_URL + "issue/"+createdItemId+"/execute",
            headers: {
                'Accept': 'application/json',
                "Authorization": "Basic " + btoa(user.profile.email + ":" + user.profile.pass)
            },
            data: {
                command: "Dev Estimate "+devEst+" QC Estimate "+qcEst+" Estimation "+estimation+" "
            }
        };
        return jQuery.ajax(request);
    },
    setAssigne: function(createdItemId, dev, qc, user){
        var deferred = jQuery.Deferred();
        var request = {
            type: "POST",
            withCredentials: true,
            url: YOUTRACK_BASE_URL + "issue/"+createdItemId+"/execute",
            headers: {
                'Accept': 'application/json',
                "Authorization": "Basic " + btoa(user.profile.email + ":" + user.profile.pass)
            },
            data: {
                command: "Assignee "+dev+" add Assignee "+ qc +" add Assignee "+ user.profile.email +" "
            }
        };
        if(settings.assignee){
            return jQuery.ajax(request);
        }
        else{
            deferred.resolve();
            return deferred.promise();
        }
    },
    putToBacklogAndAssignToMainTicket: function(createdItemId, mainTicketId, user){
        var request = {
            type: "POST",
            withCredentials: true,
            url: YOUTRACK_BASE_URL + "issue/"+createdItemId+"/execute",
            headers: {
                'Accept': 'application/json',
                "Authorization": "Basic " + btoa(user.profile.email + ":" + user.profile.pass)
            },
            data: {
                command: "subtask of "+mainTicketId+" Global State Backlog"
            }
        };
        return jQuery.ajax(request);
    },
    setWorkitemState: function(createdItemId,user){
        var deferred = jQuery.Deferred();
        var request = {
            type: "POST",
            withCredentials: true,
            url: YOUTRACK_BASE_URL + "issue/"+createdItemId+"/execute",
            headers: {
                'Accept': 'application/json',
                "Authorization": "Basic " + btoa(user.profile.email + ":" + user.profile.pass)
            },
            data: {
                command: "Work Item State Backlog"
            }
        };
        if(settings.workItemState){
            return jQuery.ajax(request);
        }
        else{
            deferred.resolve();
            return deferred.promise();
        }
    },
    setSummary: function(createdItemId, summary, user){
        var request = {
            type: "POST",
            withCredentials: true,
            url: YOUTRACK_BASE_URL + "issue/"+createdItemId,
            headers: {
                'Accept': 'application/json',
                "Authorization": "Basic " + btoa(user.profile.email + ":" + user.profile.pass)
            },
            data: {
                summary: summary,
                description: ""
            }
        };
        return jQuery.ajax(request);
    },
    assignDevAndQc: function(createdItemId, dev, qc, user){
        var request = {
            type: "POST",
            withCredentials: true,
            url: YOUTRACK_BASE_URL + "issue/"+createdItemId+"/execute",
            headers: {
                'Accept': 'application/json',
                "Authorization": "Basic " + btoa(user.profile.email + ":" + user.profile.pass)
            },
            data: {
                command: "Developer "+dev+" QC Member "+qc+" "
            }
        };
        return jQuery.ajax(request);
    },
    setCurrentOwner: function(createdItemId, owner, user){
        var deferred = jQuery.Deferred();
        var request = {
            type: "POST",
            withCredentials: true,
            url: YOUTRACK_BASE_URL + "issue/"+createdItemId+"/execute",
            headers: {
                'Accept': 'application/json',
                "Authorization": "Basic " + btoa(user.profile.email + ":" + user.profile.pass)
            },
            data: {
                command: "Current Owner "+owner+" "
            }
        };
        if(settings.currentOwner){
            return jQuery.ajax(request);
        }
        else{
            deferred.resolve();
            return deferred.promise();
        }
    }
};