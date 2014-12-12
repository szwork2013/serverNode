var Project = require('../models/project');

exports.list = function(req, res){
    Project.find(function(err, projects) {
        if (err)
            res.send(err);

        res.json(projects);
    });
};

exports.one = function(req, res){
    Project.findById(req.params.id, function (err, project) {
        if (!err) {
            return res.send(project);
        } else {
            return console.log(err);
        }
    });
};
