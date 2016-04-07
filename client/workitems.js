function summEstimate(test){
    var result = {};
    if(test.estimate){
        var lastEstimate = test.estimate[test.estimate.length-1].items;
        lastEstimate.forEach(function(item){
            if(result[item.group]){
                result[item.group].name += ", " + item.name;
                result[item.group].devEst += item.devEst;
                result[item.group].qcEst += item.qcEst;
            }
            else{
                result[item.group] = {
                    name: item.name,
                    devEst: item.devEst,
                    qcEst: item.qcEst
                };
            }
        });
    }

    return result
}
function youtrackReq (type, URL){
    var youtrackBaseUrl = "https://maxymiser.myjetbrains.com/youtrack/rest/";
    var currUser = Meteor.user();
    var request = {
        type: type,
        withCredentials: true,
        url: youtrackBaseUrl + URL,
        headers: {
            'Accept':'application/json',
            "Authorization": "Basic " + btoa(currUser.profile.email+":"+currUser.profile.pass)
        }
    };
    return jQuery.ajax(request);
}

Template.workitems.helpers({
    "developers": function(){
        //var userSector = "";
        //if(Meteor.user()) userSector = Meteor.user().profile.sector;
        return Meteor.users.find({"profile.role":'dev'});
    },
    "qcs": function(){
        //var userSector = "";
        //if(Meteor.user()) userSector = Meteor.user().profile.sector;
        return Meteor.users.find({"profile.role":'qc'});
    },
    "test": function(){
        return this;
    },
    "currentWorkitems": function(){
        Session.get("eventTrigger");
        if(this.estimate){
            return _.sortBy(this.estimate[this.estimate.length-1].items,"group");
        }
        else{
            return false;
        }
    },
    "groupedLastWorkItems": function(){
        Session.get("eventTrigger");
        if(this.estimate){
            var result = summEstimate(this);
            return _.map(result, function(val,key){return {group: key, value: val}});
        }
        else{
            return false;
        }
    },
    "isTa": function(){
        var isTa = false;
        if (Meteor.user()) isTa = Meteor.user().profile.role == "ta";
        return isTa;
    },
    "formatDate": function(date){
        var formatedDate = date.getDay() +"-"+ date.getMonth() +"-"+ date.getFullYear() +": "+date.getHours()+":"+date.getMinutes();
        return formatedDate;
    },
    "estimates": function(){
        var estimates = this.estimate;
        if(estimates) _.extend(_.last(estimates), {"active": true});
        return estimates.reverse();
    },
    "presetItems": function(){
        var items = [
            {
                name: "",
                group: 1
            },
            {
                name: "Publish Instruction",
                group: 55
            },
            {
                name: "GIT Merge request",
                group: 56
            },
            {
                name: "Qa Report",
                group: 57
            },
            {
                name: "System testing",
                group: 58
            }
        ];
        return items;
    },
    "estimateTotals": function(){
        Session.get("eventTrigger");
        var estimates = summEstimate(this);
        var result = {
            devTotal: 0,
            qcTotal: 0,
            total: 0
        };
        console.log(estimates);
        if(estimates){
            Object.keys(estimates).forEach(function(key){
                var workitem = estimates[key];
                result["devTotal"] ? result["devTotal"] += workitem.devEst : result["devTotal"] = workitem.devEst;
                result["qcTotal"] ? result["qcTotal"] += workitem.qcEst : result["qcTotal"] = workitem.qcEst;
            });
            result["total"] = (result.devTotal + result.qcTotal);
        }

        return result;
    }
});

Template.workitems.events({
    'click #addNewItem': function(){
        var row = '<tr class="added"><td><input type="text" required id="workitemName" name="name" class="form-control" title="Workitme Name"></td><td><input type="number" required step="1" min="0" id="devEst" name="devEst" class="form-control" title="Dev estimate" value="0"></td><td><input type="number" required step="1" min="0" id="qcEst" name="qcEst" class="form-control" title="Qc estimate" value="0"></td><td><input type="number" required step="1" min="1" id="group" name="group" class="form-control" title="Group id"></td><td><a href="#" class="remove"><span class="glyphicon glyphicon-remove"></span></a></td></tr>';
        jQuery("table#workitemsTable tbody").append(row);
    },
    'click a.remove': function(event){
        jQuery(event.target).parent().parent().parent().remove();
    },
    'submit form#generate': function(event, global){
        event.preventDefault();
        var rows = jQuery("table#workitemsTable tbody tr");
        var workitems = [];
        var comment = jQuery("#submitComment").val();
        rows.each(function(ind){
            var name = jQuery(rows[ind]).find("#workitemName").val();
            var devEst = jQuery(rows[ind]).find("#devEst").val();
            var qcEst = jQuery(rows[ind]).find("#qcEst").val();
            var group = jQuery(rows[ind]).find("#group").val();
            var item = {
                name: name,
                devEst: parseFloat(devEst),
                qcEst: parseFloat(qcEst),
                group: parseInt(group)
            };
            workitems.push(item);

        });
        var packedData = {
            workitems : workitems,
            comment : comment
        };
        jQuery("#estimateHistory a").removeClass("active");
        jQuery("table#workitemsTable tbody tr.added").remove();
        Meteor.call("formWorkItems",global.data._id,packedData);
        //Tests.update(global.data._id,{$addToSet:{estimate:{items:workitems,comment: comment, updater: Meteor.user().profile.name,date: new Date()}}});
        jQuery("#estimateHistory a:eq(0)").addClass("active")
    },
    "click li.devName": function(event, global){
        jQuery("div#settings input#devName").val(this.profile.email);
        Meteor.call("updateTestById",global.data._id,{dev:this});
        //Tests.update(global.data._id,{$set:{dev:this}});
    },
    "click li.qcName": function(event,global){
        jQuery("div#settings input#qcName").val(this.profile.email);
        Meteor.call("updateTestById",global.data._id,{qc:this});
        //Tests.update(global.data._id,{$set:{qc:this}});
    },
    "click #setNewCampId": function(event, global){
        var newCampId = jQuery("#campaignId").val();
        if(newCampId){
            youtrackReq("GET","issue/"+newCampId).fail(function(reason){
                sAlert.error(JSON.parse(reason.responseText).value);
            }).done(function(data){
                if(_.find(data.field,function(key){return key.name == "Type"}).value[0] == "New Campaign"){
                    Meteor.call("updateTestById",global.data._id,{testId: newCampId});
                    //Tests.update(global.data._id,{$set:{testId: newCampId}});
                }
                else{
                    sAlert.error("Ticket is not New Campaign. Only New Campaign tickets are allowed");
                }
            });
        }
    },
    "click #createWorkItems": function(event, global){
        var workitems = summEstimate(global.data);
        var createdItemId;
        var dev,qc;
        if(global.data.dev) dev = global.data.dev.profile;
        else{
            dev = "undefined";
        }
        if(global.data.qc) qc = global.data.qc.profile;
        else{
            qc = "undefined";
        }
        var mainTicketId =  global.data.testId;
        var promise;
        var counter = Object.keys(workitems).length;
        function ajaxErrorDisplay(reason){

            jQuery("#postsToYoutrackProgress .panel-heading").css("background-color","orangered");
            jQuery("#postsToYoutrackProgress .panel-heading").css("color","white");
            jQuery("#postsToYoutrackProgress .panel-heading").text("Oh snap! Something went wrong!");
            jQuery(".panel-body span#holder").text("Status: "+reason.status+","+JSON.parse(reason.responseText).value+". If you do not understand the reason -- contact dmitriy.gorbachev@hotmail.com");

        }
        jQuery("#postsToYoutrackProgress").show();
        jQuery(".greyout").show();
        jQuery("#postsToYoutrackProgress span#counter").text(counter);
        jQuery("#postsToYoutrackProgress span#generalCount").text(counter);

        Object.keys(workitems).sort().forEach(function(key){
            var item = workitems[key];
            var devEst = item.devEst;
            var qcEst = item.qcEst;
            var estimation = (item.devEst+item.qcEst);
            if(key === "1"){
                promise = youtrackReq("POST","issue/"+mainTicketId+"/execute?command=clone");
                promise = promise.then(function(data){
                    return youtrackReq("GET", "issue/?filter=created%3A+Today+created+by%3A+me+sort+by%3A+created+")
                }).then(function(data){
                    createdItemId = data.issue[0].id;
                    return youtrackReq("POST","issue/"+createdItemId+"/execute?command=Type Work Item Assignee "+dev.email+" add Assignee "+qc.email+" Dev Estimate "+devEst+" QC Estimate "+qcEst+" Estimation "+estimation+" ");
                })
                .then(function(data){
                    return youtrackReq("POST","issue/"+createdItemId+"/execute?command=Work Item State Backlog subtask of "+mainTicketId+" ");
                }).then(function(data){
                    return youtrackReq("POST","issue/"+createdItemId+"?summary="+item.name+"&description="+item.name+"");
                }).then(function(data){
                    return youtrackReq("POST","issue/"+createdItemId+"/execute?command=Developer "+dev.email+" QC Member "+qc.email+" ");
                }).fail(function(reason){
                    ajaxErrorDisplay(reason);
                }).done(function(){
                    counter -= 1;
                    jQuery("#postsToYoutrackProgress span#counter").text(counter);
                });
            }
            else{
                promise = promise.then(function(data){
                    return youtrackReq("POST","issue/"+mainTicketId+"/execute?command=clone")
                }).then(function(data) {
                    return youtrackReq("GET", "issue/?filter=created%3A+Today+created+by%3A+me+Type%3A+%7BNew+Campaign%7D+");
                })
                .then(function(data){
                    createdItemId = data.issue[0].id;
                    return youtrackReq("POST","issue/"+createdItemId+"/execute?command=Type Work Item Assignee "+dev.email+" add Assignee "+qc.email+" Dev Estimate "+devEst+" QC Estimate "+qcEst+" Estimation "+estimation+" ");
                })
                .then(function(data){
                    return youtrackReq("POST","issue/"+createdItemId+"/execute?command=Work Item State Backlog subtask of "+mainTicketId+" ");
                })
                .then(function(data){
                    return youtrackReq("POST","issue/"+createdItemId+"?summary="+item.name+"&description="+item.name+"");
                })
                .then(function(data){
                    return youtrackReq("POST","issue/"+createdItemId+"/execute?command=Developer "+dev.email+" QC Member "+qc.email+" ")
                })
                .fail(function(reason){
                    ajaxErrorDisplay(reason);
                }).done(function(){
                    counter -= 1;
                    jQuery("#postsToYoutrackProgress span#counter").text(counter);
                    if(!counter) {
                        jQuery(".panel-body span#holder").text("Yaay! Everything went smoothly! Youtrack Gods treated you well.");
                        jQuery("#postsToYoutrackProgress .panel-heading").css("background-color","rgb(168, 224, 51)");
                        jQuery("#postsToYoutrackProgress .panel-heading").text("Workitems successfully created");
                    }
                });
            }
        });
    },
    "click #estimateHistory a": function(event, global){
        var activeEst = _.extend(global.data.estimate.splice(_.indexOf(global.data.estimate, this),1),{"active":true});
        global.data.estimate.push(activeEst[0]);
        var counter = Session.get("eventTrigger") + 1 || 0;
        Session.set("eventTrigger",counter);
        var target = jQuery(event.target).closest("a").length
            ? jQuery(event.target).closest("a")
            : jQuery(event.target);
        jQuery("#estimateHistory a").removeClass("active");
        target.addClass("active");
    },
    "click #ok": function(){
        jQuery("#postsToYoutrackProgress").hide();
        jQuery(".greyout").hide();
        jQuery("#postsToYoutrackProgress").text("");
        jQuery("#postsToYoutrackProgress").append('<div class="panel panel-default center-block"><div class="panel-heading">Workitems are in a process of creation</div><div class="panel-body"><span id="holder">You have <span id="counter">n</span> out of <span id="generalCount"></span> workitems left to create.</span><button class="btn btn-primary center-block" id="ok" style="margin-top: 10px">Ok</button></div></div>')
    }

});