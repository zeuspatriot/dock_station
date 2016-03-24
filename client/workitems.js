
Template.workitems.helpers({
    "developers": function(){
      return Users.find({role:'dev'});
    },
    "qcs": function(){
      return Users.find({role:'qc'});
    },
    "workitems": function(){
        return Session.get("workitems");
    }
});

Template.workitems.events({
    'click #addNewItem': function(){
        var row = '<tr><td><input type="text" required id="workitemName" class="form-control" title="Workitme Name"></td><td><input type="number" required step="0.1" id="devEst" class="form-control" title="Dev estimate"></td><td><input type="number" required step="0.1" id="qcEst" class="form-control" title="Qc estimate"></td><td><input type="number" required step="1" id="group" class="form-control" title="Group id"></td><td><a href="#" class="remove"><span class="glyphicon glyphicon-remove"></span></a></td></tr>';
        jQuery("table tbody").append(row);
    },
    'click a.remove': function(event){
        jQuery(event.target).parent().parent().parent().remove();
    },
    'click #generate': function(){
        var rows = jQuery("table#workitemsTable tbody tr");
        rows.each(function(ind){
            console.log(rows[ind]);
        })
    }

});