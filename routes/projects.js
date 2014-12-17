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


exports.create = function(req, res){

    console.log(req.body.project);
    var name = req.body.project.name || '';
    var duration = req.body.project.duration || 0;
    var begin = req.body.project.begin || '';
    var end = req.body.project.end || '';
    var resources = req.body.project.resources;

    if (name == '' || begin == '') {
       return res.status(400).send("Objet projet mal formé.");
    }

    var project = new Project();
    project.name = name;
    project.duration = duration;
    project.begin = begin;
    project.end = end;
    project.resources = resources;

    console.log(resources[0])

    project.save(function(err) {
        if (err) {
            console.log(err);
            return res.send(500);
        } else {
            console.log("project created")
        }

        return res.send(project);
    });
};
