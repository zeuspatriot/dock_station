export var workitemsApi = {
    summEstimate: function(test){
        var result = {};
        if(test.length){
            var lastEstimate = test;
            lastEstimate.forEach(function(item,ind){
                if(result[item.group]){
                    result[item.group].name += ", " + item.name;
                    result[item.group].devEst += item.devEst;
                    result[item.group].qcEst += item.qcEst;
                    result[item.group].owner = item.owner;
                }
                else{
                    result[item.group] = {
                        name: item.name,
                        devEst: item.devEst,
                        qcEst: item.qcEst,
                        owner: item.owner
                    };
                }
            });
        }
        return result
    }
};