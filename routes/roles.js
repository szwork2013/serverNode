var Role = require('../models/role');
var User = require('../models/user');
var ObjectId = require('mongoose').Types.ObjectId;

exports.create = function (req, res) {

    var name = req.body.role.name || '';

    if (name == '') {
        return res.status(400).send("Objet droit mal formé.");
    }

    var role = new Role();
    role.name = name;

    role.save(function (err) {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        } else {
            console.log("role created")
        }
        return res.status(200).send("Le droit " + role.name + " a bien été ajouté.");
    });
};

exports.update = function (req, res) {

    var name = req.body.role.name || '';

    if (name == '') {
        return res.send(400);
    }

    Role.findById(req.params.id, function (err, role) {

        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }

        if (role != null) {
            role.name = name;

            return role.save(function (err) {
                if (!err) {
                    User.find({"roles.role._id": new ObjectId(req.params.id)}, function (err, users) {
                        if (err) {
                            return res.status(500).send(err);
                        } else {
                            for (var u in users) {
                                User.update({"_id": users[u]._id, "roles.role._id": new ObjectId(req.params.id)}, {'$set': {
                                    'roles.$.role.name': role.name
                                }}, function (err) {

                                });
                            }
                        }
                    });
                    return res.status(200).send("Le rôle " + role.name + " a bien été mis à jour.");
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

exports.delete = function (req, res) {
    User.find({"role._id": req.params.id}, function (err, users) {
        if (err) {
            console.log(err);
            return res.status(400).send(err);
        } else {
            if (users.length > 0) {
                return res.status(409).send("Ce droit est attribué a des utilisateurs et ne peut être supprimé.");
            } else {
                Role.findById(req.params.id, function (err, role) {
                    if (err) {
                        console.log(err);
                        return res.status(500).send(err);
                    }
                    if (role != null) {
                        return role.remove(function (err) {
                            if (!err) {
                                return res.send(role);
                            } else {
                                console.log(err);
                            }
                        });
                    }
                });
            }
        }
    });
};

exports.all = function (req, res) {
    Role.find(function (err, roles) {
        if (err)
            res.status(400).send(err);

        res.status(200).json(roles);
    });
};
