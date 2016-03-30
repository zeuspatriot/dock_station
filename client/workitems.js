function summEstimate(test){
    var lastEstimate = test.estimate[test.estimate.length-1].items;
    var result = {};
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
    return result
}
function youtrackReq (type, URL, data, headers){
    var youtrackBaseUrl = "https://maxymiser.myjetbrains.com/youtrack/rest/";
    var currUser = Meteor.user();
    var request = {
        type: type,
        withCredentials: true,
        url: youtrackBaseUrl + URL,
        headers: {
            'Accept':'application/json',
            "Authorization": "Basic " + btoa(currUser.profile.email+":"+currUser.profile.pass)
        },
        data: data
    };
    return jQuery.ajax(request);
}
Template.workitems.helpers({
    "developers": function(){
      return Meteor.users.find({"profile.role":'dev'});
    },
    "qcs": function(){
      return Meteor.users.find({"profile.role":'qc'});
    },
    "test": function(){
        return this;
    },
    "currentWorkitems": function(){
        Session.get("eventTrigger");
        if(this.estimate){
            return this.estimate[this.estimate.length-1].items;
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
        var formatedDate = date.getDay() +"-"+ date.getMonth() +"-"+ date.getFullYear() +": "+date.getHours()+"."+date.getMinutes();
        return formatedDate;
    },
    "estimates": function(){
        var estimates = this.estimate;
        if(estimates) _.extend(_.last(estimates), {"active": true});
        return estimates;
    }
});

Template.workitems.events({
    'click #addNewItem': function(){

        var row = '<tr><td><input type="text" required id="workitemName" name="name" class="form-control" title="Workitme Name"></td><td><input type="number" required step="0.1" min="0" id="devEst" name="devEst" class="form-control" title="Dev estimate" value="0"></td><td><input type="number" required step="0.1" min="0" id="qcEst" name="qcEst" class="form-control" title="Qc estimate" value="0"></td><td><input type="number" required step="1" min="1" id="group" name="group" class="form-control" title="Group id"></td><td><a href="#" class="remove"><span class="glyphicon glyphicon-remove"></span></a></td></tr>';
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
        jQuery("#estimateHistory a").removeClass("active");
        Tests.update(global.data._id,{$addToSet:{estimate:{items:workitems,comment: comment, updater: Meteor.user().profile.name,date: new Date()}}});
    },
    "click li.devName": function(event, global){
        console.log(this);
        jQuery("div#settings input#devName").val(this.profile.email);
        Tests.update(global.data._id,{$set:{dev:this}});
    },
    "click li.qcName": function(event,global){
        jQuery("div#settings input#qcName").val(this.profile.email);
        Tests.update(global.data._id,{$set:{qc:this}});
    },
    "click #setNewCampId": function(event, global){
        var newCampId = jQuery("#campaignId").val();
        Tests.update(global.data._id,{$set:{testId: newCampId}});
    },
    "click #createWorkItems": function(event, global){
        var workitems = summEstimate(global.data);
        var dev = global.data.dev.profile.email;
        var qc = global.data.qc.profile.email;
        var mainTicketId =  global.data.testId;
        var promise;
        Object.keys(workitems).forEach(function(key){
            var item = workitems[key];
            var createdItemId;
            if(key == 1){
                promise = youtrackReq("POST","issue/"+mainTicketId+"/execute?command=clone");
                        promise.then(function() {
                            console.log("Issue cloned");
                            return youtrackReq("GET", "issue/?filter=created%3A+Today+created+by%3A+me+sort+by%3A+created+")
                        })
                        .then(function(data){
                            console.log("data: ", data);
                            console.log("this: ", this);
                            createdItemId = data.issue[0].id;
                            return youtrackReq("POST","issue/"+createdItemId+"/execute?command=Type Work Item Assignee "+dev.email+" Dev Estimate "+item.devEst+" QC Estimate "+item.qcEst+" Estimation "+(item.devEst+item.qcEst)+" Work Item State Backlog subtask of "+mainTicketId+" Developer "+dev.email+" QC Member "+qc.email+" ")
                        })
                        .then(function(){
                            return youtrackReq("POST","issue/"+createdItemId+"?summary="+item.name+"&description="+item.name+"");
                        });
            }
            else{
                promise.then(function(){
                    return youtrackReq("POST","issue/"+mainTicketId+"/execute?command=clone")
                }).then(function() {
                        console.log("Issue cloned");
                        return youtrackReq("GET", "issue/?filter=created%3A+Today+created+by%3A+me+sort+by%3A+created+")
                    })
                    .then(function(data){
                        console.log("data: ", data);
                        console.log("this: ", this);
                        createdItemId = data.issue[0].id;
                        return youtrackReq("POST","issue/"+createdItemId+"/execute?command=Type Work Item Assignee "+dev.email+" Dev Estimate "+item.devEst+" QC Estimate "+item.qcEst+" Estimation "+(item.devEst+item.qcEst)+" Work Item State Backlog subtask of "+mainTicketId+" Developer "+dev.email+" QC Member "+qc.email+" ");
                    })
                    .then(function(){
                        return youtrackReq("POST","issue/"+createdItemId+"?summary="+item.name+"&description="+item.name+"");
                    });
            }
        });
    },
    "click #estimateHistory a": function(event, global){
        var activeEst = _.extend(global.data.estimate.splice(_.indexOf(global.data.estimate, this),1),{"active":true});
        global.data.estimate.push(activeEst[0]);
        var counter = Session.get("eventTrigger") + 1 || 0;
        Session.set("eventTrigger",counter);
        console.log(event.target);
        var target = jQuery(event.target).closest("a").length
            ? jQuery(event.target).closest("a")
            : jQuery(event.target);
        jQuery("#estimateHistory a").removeClass("active");
        target.addClass("active");
    }

});