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

Template.workitems.helpers({
    "developers": function(){
      return People.find({role:'dev'});
    },
    "qcs": function(){
      return People.find({role:'qc'});
    },
    "test": function(){
        return this;
    },
    "currentWorkitems": function(){
        if(this.estimate){
            return this.estimate[this.estimate.length-1].items;
        }
        else{
            return false;
        }
    },
    "groupedLastWorkItems": function(){
        if(this.estimate){
            var result = summEstimate(this);
            return _.map(result, function(val,key){return {group: key, value: val}});
        }
        else{
            return false;
        }
    }
});

Template.workitems.events({
    'click #addNewItem': function(){

        var row = jQuery("tbody tr").first().clone();
        jQuery("table tbody").append(row);
    },
    'click a.remove': function(event){
        jQuery(event.target).parent().parent().parent().remove();
    },
    'click #generate': function(event, global){
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
                devEst: parseInt(devEst),
                qcEst: parseInt(qcEst),
                group: parseInt(group)
            };
            workitems.push(item);

        });
        Tests.update(global.data._id,{$addToSet:{estimate:{items:workitems,comment: comment}}});
    },
    "click li.devName": function(event, global){
        jQuery("div#settings input#devName").val(this.email);
        //jQuery("div#settings button#devNameBtn span#text").text(event.target.text);
        Tests.update(global.data._id,{$set:{dev:this}});
    },
    "click li.qcName": function(event,global){
        jQuery("div#settings input#qcName").val(this.email);
        //jQuery("div#settings button#qcNameBtn span#text").text(event.target.text);
        Tests.update(global.data._id,{$set:{qc:this}});
    },
    "click #setNewCampId": function(event, global){
        var newCampId = jQuery("#campaignId").val();
        Tests.update(global.data._id,{$set:{testId: newCampId}});
    },
    "click #createWorkItems": function(event, global){
        var workitems = summEstimate(global.data);
        var dev = global.data.dev;
        var qc = global.data.qc;
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
    }

});