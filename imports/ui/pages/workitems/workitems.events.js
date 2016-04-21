import { Meteor } from 'meteor/meteor';
import { youtrackApi } from "/imports/api/youtrack";
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { ReactiveDict } from 'meteor/reactive-dict';
import { workitemsApi } from '/imports/api/workitems';

Template.workitems.events({
    'click #addNewItem': function(){
        var row = '<tr class="added"><td><div class="form-group"><div class="dropdown"><button class="btn btn-default dropdown-toggle owner" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><span id="text">None</span><span class="caret"></span></button><ul class="dropdown-menu" aria-labelledby="dropdownMenu1"><li class="owner"><a href="#">None</a></li><li class="owner"><a href="#">Dev</a></li><li class="owner"><a href="#">Qc</a></li></ul><input type="text" id="currOwner" class="form-control hidden" value="None"></div></div></td><td><input type="text" required id="workitemName" name="name" class="form-control" title="Workitme Name"></td><td><input type="number" required step="1" min="0" id="devEst" name="devEst" class="form-control" title="Dev estimate" value="0"></td><td><input type="number" required step="1" min="0" id="qcEst" name="qcEst" class="form-control" title="Qc estimate" value="0"></td><td><input type="number" required step="1" min="1" id="group" name="group" class="form-control" title="Group id"></td><td><a href="#" class="remove"><span class="glyphicon glyphicon-remove"></span></a></td></tr>';
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
            var owner = jQuery(rows[ind]).find("#currOwner").val();
            var item = {
                name: name,
                devEst: parseFloat(devEst),
                qcEst: parseFloat(qcEst),
                group: parseInt(group)
            };
            if(owner){
                item["owner"] = owner;
            }
            else{
                item["owner"] = "None";
            }
            workitems.push(item);

        });
        var packedData = {
            workitems : workitems,
            comment : comment
        };
        jQuery("#estimateHistory a").removeClass("active");
        jQuery("table#workitemsTable tbody tr.added").remove();
        Meteor.call("formWorkItems",global.data._id,packedData);
        jQuery("#estimateHistory a:eq(0)").addClass("active");
        jQuery("#submitComment").val("");
    },
    "click li.devName": function(event, global){
        jQuery("div#settings input#devName").val(this.profile.email);
        Meteor.call("updateTestById",global.data._id,{dev:this});
    },
    "click li.qcName": function(event,global){
        jQuery("div#settings input#qcName").val(this.profile.email);
        Meteor.call("updateTestById",global.data._id,{qc:this});
    },
    "click #setNewCampId": function(event, global){
        var newCampId = jQuery("#campaignId").val();
        if(newCampId){
            youtrackApi.getTicket(newCampId, Meteor.user())
            .fail(function(reason){
                sAlert.error(JSON.parse(reason.responseText).value);
            }).done(function(data){
                Meteor.call("updateTestById",global.data._id,{testId: newCampId}, function(err, res){
                    if(err) throw new Error("ticket was not assigned! "+ err);
                    sAlert.success("Ticket assigned to "+newCampId);
                });
            });
        }
    },
    "click #createWorkItems": function(event, instance){
        youtrackApi.setSettings(Meteor.user().profile.sector);
        var user = Meteor.user();
        var workitems = workitemsApi.summEstimate(instance.data.estimate[instance.data.estimate.length-1].items);
        var createdItemId;
        var dev,qc;
        if(instance.data.dev) dev = instance.data.dev.profile;
        else{
            dev = "undefined";
        }
        if(instance.data.qc) qc = instance.data.qc.profile;
        else{
            qc = "undefined";
        }
        var mainTicketId =  instance.data.testId;
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
        var mainTicketData = {};

        Object.keys(workitems).sort().forEach(function(key, ind){
            var item = workitems[key];
            var devEst = item.devEst;
            var qcEst = item.qcEst;
            var ref = {
                Dev: dev.email,
                Qc: qc.email,
                None: "Undefined"
            };
            var newItemData = {
                project: "",
                summary: "#ignore_required#" + item.name,
                type: "Work Item",
                field: {
                    'Client Account': {
                        value: "Maxymiser"
                    },
                    'Subtask Of':mainTicketId
                }
            };
            var owner = ref[item.owner];
            if(ind === 0){
                promise = youtrackApi.getTicket(mainTicketId, user);
                promise = promise.then(function(data) {

                        mainTicketData['Client Account'] = _.find(data.field,function(field){
                            return field.name == 'Client Account'
                        }).value[0];
                        mainTicketData['OA Name'] = _.find(data.field,function(field){
                            return field.name == 'OA Name'
                        }).value[0];
                        mainTicketData['Sector'] = _.find(data.field,function(field){
                            return field.name == 'Sector'
                        }).value[0];
                        mainTicketData['project'] = data.id.split('-')[0];
                        newItemData.project = mainTicketData.project;

                        return youtrackApi.createNewWorkItem(newItemData, user);
                    })
                    .then(function(data){
                        createdItemId = data.id;
                        return youtrackApi.changeEstimate(createdItemId, devEst, qcEst, user);
                    })
                    .then(function(data){
                        return youtrackApi.putToBacklogAndAssignToMainTicket(createdItemId, mainTicketId, user);
                    })
                    .then(function(data){
                        return youtrackApi.setSummary(createdItemId, item.name, user);
                    })
                    .then(function(data){
                        return youtrackApi.assignDevAndQc(createdItemId, dev.email, qc.email, user);
                    })
                    .then(function(data){
                        return youtrackApi.setAssigne(createdItemId, dev.email, qc.email, user);
                    })
                    .then(function(data){
                        return youtrackApi.setCurrentOwner(createdItemId,owner, user);
                    })
                    .then(function(data){
                        return youtrackApi.setWorkitemState(createdItemId,user);
                    })
                    .fail(function(reason){
                        ajaxErrorDisplay(reason);
                    })
                    .done(function(){
                        counter -= 1;
                        jQuery("#postsToYoutrackProgress span#counter").text(counter);
                        if(!counter) {
                            jQuery(".panel-body span#holder").text("Yaay! Everything went smoothly! Youtrack Gods treated you well.");
                            jQuery("#postsToYoutrackProgress .panel-heading").css("background-color","rgb(168, 224, 51)");
                            jQuery("#postsToYoutrackProgress .panel-heading").text("Workitems successfully created");
                        }
                    });
            }
            else{
                promise = promise.then(function(data) {
                        newItemData.project = mainTicketData.project;
                        return youtrackApi.createNewWorkItem(newItemData, user);
                    })
                    .then(function(data){
                        createdItemId = data.id;
                        return youtrackApi.changeEstimate(createdItemId, devEst, qcEst, user);
                    })
                    .then(function(data){
                        return youtrackApi.putToBacklogAndAssignToMainTicket(createdItemId, mainTicketId, user);
                    })
                    .then(function(data){
                        return youtrackApi.setSummary(createdItemId, item.name, user);
                    })
                    .then(function(data){
                        return youtrackApi.assignDevAndQc(createdItemId, dev.email, qc.email, user);
                    })
                    .then(function(data){
                        return youtrackApi.setAssigne(createdItemId, dev.email, qc.email, user);
                    })
                    .then(function(data){
                        return youtrackApi.setCurrentOwner(createdItemId,owner, user);
                    })
                    .then(function(data){
                        return youtrackApi.setWorkitemState(createdItemId,user);
                    })
                    .fail(function(reason){
                        ajaxErrorDisplay(reason);
                    })
                    .done(function(){
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
    },
    "click table div.dropdown li.owner": function(event){
        var role = jQuery(event.target).text();
        jQuery(event.target).parent().parent().parent().find("input#currOwner").val(role);
        if(this.owner){
            this.owner = role;
        }
        else {
            jQuery(event.target).parent().parent().parent().find("span#text").text(role);
        }

        var counter = Session.get("eventTrigger") + 1 || 0;
        Session.set("eventTrigger",counter);
    }

});