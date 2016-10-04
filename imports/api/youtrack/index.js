import {bootboxjs} from 'meteor/mizzao:bootboxjs';
import {YOUTRACK_BASE_URL} from '/imports/constants/urls';
import { Settings } from "/imports/api/collections";

var settings;
var memoPass = '';

//User is a required argument
function getPassHook(user, pure) {
    var defer = jQuery.Deferred();
    function prompt() {
        bootbox.dialog({
            title: "Please enter your Youtrack password. (We don't store it.)",
            message: `
                <input type="password" name="passwordHook" autocomplete="off" class="bootbox-input bootbox-input-text form-control">
            `,
            buttons: {
                success: {
                    label: 'Confirm',
                    className: 'btn-success',
                    callback: function () {
                        var passwordHook = $('input[name="passwordHook"]').val();

                        passwordHook = jQuery.trim(passwordHook);

                        if (passwordHook) {
                            memoPass = passwordHook;
                            defer.resolve(pure ? memoPass : btoa(user.profile.email + ":" +memoPass));
                        } else {
                            prompt();
                        }
                    }
                }
            }
        });
    }

    if (memoPass) {
        defer.resolve(pure ? memoPass : btoa(user.profile.email + ":" + memoPass));
    } else {
        prompt();
    }

    return defer.promise();
}

function flushPass() {
    memoPass = '';
}

export var youtrackApi = {
    setSettings: function(userSector){
        settings = Settings.findOne({sector: userSector});
        console.log(settings);
    },
    call: function(type, url, user, data){
        return getPassHook(user).then(function (youtrackPass) {
            if (!user) throw new Error("User is required argument");
            var request = {
                type: type,
                withCredentials: true,
                url: YOUTRACK_BASE_URL + url,
                headers: {
                    'Accept':'application/json',
                    "Authorization": "Basic " + youtrackPass
                }
            };
            if(data) request.data = data;
            return jQuery.ajax(request);
        });
    },
    loginToYoutrack: function(userName, user){
        var defer = jQuery.Deferred();

        getPassHook(user, true).then(function (youtrackPurePass) {
            var request = {
                type: "POST",
                withCredentials: true,
                url: YOUTRACK_BASE_URL + 'user/login',
                headers: {
                    'Accept':'application/json'
                },
                data: {
                    login: userName,
                    password: youtrackPurePass
                }
            };

            jQuery.ajax(request).always(function(res){
                if(res.status == 200){
                    defer.resolve(res);
                } else{
                    setTimeout(flushPass, 0);
                    defer.reject(res);
                }
            });
        });

        return defer.promise();

    },
    getTicket: function(ticketId,user){
        return getPassHook(user).then(function (youtrackPass) {
            var request = {
                type: "GET",
                withCredentials: true,
                url: YOUTRACK_BASE_URL + 'issue/'+ticketId,
                headers: {
                    'Accept':'application/json',
                    "Authorization": "Basic " + youtrackPass
                }
            };
            return jQuery.ajax(request);
        });
    },
    createNewWorkItem: function(newItemData, user){
        return getPassHook(user).then(function (youtrackPass) {
            var request = {
                type: "POST",
                withCredentials: true,
                url: YOUTRACK_BASE_URL + 'issue/',
                headers: {
                    'Accept':'application/json',
                    "Authorization": "Basic " + youtrackPass
                },
                data: newItemData
            };
            return jQuery.ajax(request);
        });
    },
    changeEstimate: function(createdItemId, devEst, qcEst, user){
        return getPassHook(user).then(function (youtrackPass) {
            var estimation = devEst + qcEst;
            var request = {
                type: "POST",
                withCredentials: true,
                url: YOUTRACK_BASE_URL + "issue/"+createdItemId+"/execute",
                headers: {
                    'Accept': 'application/json',
                    "Authorization": "Basic " + youtrackPass
                },
                data: {
                    command: "Dev Estimate "+devEst+" QC Estimate "+qcEst+" Estimation "+estimation+" "
                }
            };
            return jQuery.ajax(request);
        });
    },
    setAssigne: function(createdItemId, dev, qc, user){
        return getPassHook(user).then(function (youtrackPass) {
            var deferred = jQuery.Deferred();
            var participants = {
                dev: dev !== undefined ? " add Assignee " + dev : "",
                qc: qc !== undefined ? " add Assignee " + qc : ""
            };
            var request = {
                type: "POST",
                withCredentials: true,
                url: YOUTRACK_BASE_URL + "issue/"+createdItemId+"/execute",
                headers: {
                    'Accept': 'application/json',
                    "Authorization": "Basic " + youtrackPass
                },
                data: {
                    command: "Assignee " + user.profile.email + participants.dev + participants.qc
                }
                // data: {
                //     command: "Assignee "+dev+" add Assignee "+ qc +" add Assignee "+ user.profile.email +" "
                // }
            };
            if(settings.assignee){
                return jQuery.ajax(request);
            }
            else{
                deferred.resolve();
                return deferred.promise();
            }
        });
    },
    putToBacklogAndAssignToMainTicket: function(createdItemId, mainTicketId, user){
        return getPassHook(user).then(function (youtrackPass) {
            var request = {
                type: "POST",
                withCredentials: true,
                url: YOUTRACK_BASE_URL + "issue/"+createdItemId+"/execute",
                headers: {
                    'Accept': 'application/json',
                    "Authorization": "Basic " + youtrackPass
                },
                data: {
                    command: "subtask of "+mainTicketId+" Global State Backlog"
                }
            };
            return jQuery.ajax(request);
        });
    },
    setWorkitemState: function(createdItemId,user){
        return getPassHook(user).then(function (youtrackPass) {
            var deferred = jQuery.Deferred();
            var request = {
                type: "POST",
                withCredentials: true,
                url: YOUTRACK_BASE_URL + "issue/"+createdItemId+"/execute",
                headers: {
                    'Accept': 'application/json',
                    "Authorization": "Basic " + youtrackPass
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
        });
    },
    setSummary: function(createdItemId, summary, user){
        return getPassHook(user).then(function (youtrackPass) {
            var request = {
                type: "POST",
                withCredentials: true,
                url: YOUTRACK_BASE_URL + "issue/"+createdItemId,
                headers: {
                    'Accept': 'application/json',
                    "Authorization": "Basic " + youtrackPass
                },
                data: {
                    summary: summary,
                    description: ""
                }
            };
            return jQuery.ajax(request);
        });
    },
    assignDevAndQc: function(createdItemId, dev, qc, user){
        return getPassHook(user).then(function (youtrackPass) {
            var request = {
                type: "POST",
                withCredentials: true,
                url: YOUTRACK_BASE_URL + "issue/"+createdItemId+"/execute",
                headers: {
                    'Accept': 'application/json',
                    "Authorization": "Basic " + youtrackPass
                },
                data: {
                    command: "Developer "+dev+" QC Member "+qc+" "
                }
            };
            return jQuery.ajax(request);
        });
    },
    setCurrentOwner: function(createdItemId, owner, user){
        return getPassHook(user).then(function (youtrackPass) {
            var deferred = jQuery.Deferred();
            var request = {
                type: "POST",
                withCredentials: true,
                url: YOUTRACK_BASE_URL + "issue/"+createdItemId+"/execute",
                headers: {
                    'Accept': 'application/json',
                    "Authorization": "Basic " + youtrackPass
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
        });
    }
};