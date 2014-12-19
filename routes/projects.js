var Project = require('../models/project');
var User = require('../models/user');
var ObjectId = require('mongoose').Types.ObjectId;

exports.list = function (req, res) {
    Project.find(function (err, projects) {
        if (err)
            return res.status(500).send(err);

        return res.status(200).send(projects);
    });
};

exports.one = function (req, res) {
    Project.findById(req.params.id, function (err, project) {
        if (!err) {
            return res.send(project);
        } else {
            console.log(err);
            return res.status(500).send(err);
        }
    });
};

exports.create = function (req, res) {

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

    project.save(function (err) {
        if (err) {
            console.log(err);
            return res.send(500);
        } else {
            console.log("project created")
        }
        return res.status(200).send(project);
    });
};

exports.update = function (req, res) {

    console.log("Request body update project : " + req.body);

    var name = req.body.project.name || '';
    var duration = req.body.project.duration || 0;
    var begin = req.body.project.begin || '';
    var end = req.body.project.end || '';

    var resources = req.body.project.resources;
    var sprints = req.body.project.resources;
    var items = req.body.project.resources;
    var comments = req.body.project.resources;

    if (name == '' || begin == '') {
        return res.send(400);
    }

    Project.findById(req.params.id, function (err, project) {

        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }

        if (project != null) {

            project.name = name;
            project.duration = duration;
            project.begin = begin;
            project.end = end;
            project.resources = resources;
            project.sprints = sprints;
            project.items = items;
            project.comments = comments;

            return project.save(function (err) {
                if (!err) {
                    User.find({"roles.project._id": new ObjectId(req.params.id)}, function (err, users) {
                        if (err) {
                            return res.status(500).send(err);
                        } else {
                            for (var u in users) {
                                console.log(users[u].roles[0].project.name);
                                User.update({"_id": users[u]._id, "roles.project._id": new ObjectId(req.params.id)}, {'$set': {
                                    'roles.$.project.name': project.name
                                }}, function (err) {

                                });
                            }
                        }
                    });
                    return res.status(200).send("Le projet " + project.name + " a bien été mis à jour.");
                } else {
                    console.log(err);
                    return res.status(500).send(err);
                }
            });
        } else {
            console.log(err);
            return res.status(500).send(err);
        }
    });
};
