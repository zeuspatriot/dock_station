
Template.workitems.helpers({
    "developers": function(){
      return Users.find({role:'dev'});
    },
    "qcs": function(){
      return Users.find({role:'qc'});
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
            var lastEstimate = this.estimate[this.estimate.length-1].items;
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
            return _.map(result, function(val,key){return {name: key, value: val}});
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
        jQuery("div#settings button#devNameBtn span#text").text(event.target.text);
        Tests.update(global.data._id,{$set:{dev:this}});
    },
    "click li.qcName": function(event,global){
        jQuery("div#settings input#qcName").val(this.email);
        jQuery("div#settings button#qcNameBtn span#text").text(event.target.text);
        Tests.update(global.data._id,{$set:{qc:this}});
    },
    "click #setNewCampId": function(event, global){
        var newCampId = jQuery("#campaignId").val();
        Tests.update(global.data._id,{$set:{testId: newCampId}});
    }

});