var User = require('../models/user');
var Project = require('../models/project');
var Notification = require('../models/notification');

var Helper = require('../helper/helpers');

var jwt = require('jsonwebtoken');
var secret = require('../config/secret');
var tokenManager = require('../config/token_manager');
var ObjectId = require('mongoose').Types.ObjectId;

// AUTHENTICATION
exports.login = function (req, res) {
    var username = req.body.username || '';
    var password = req.body.password || '';

    if (username == '' || password == '') {
        return res.status(401).send("Le password ou le login est vide.");
    }

    User.findOne({username: username, active: true}, function (err, user) {

        if (err)
            return res.status(401).send("Une erreur s'est produite durant l'authentification.");
        else if (!user)
            return res.status(401).send("L'utilisateur n'a pas été trouvé.");

        user.comparePassword(password, function (isMatch) {
            if (!isMatch) {
                console.log("Attempt failed to login with " + user.username);
                return res.status(401).send("Le mot de passe ou le login est erroné.");
            }

            var token = jwt.sign({id: user._id}, secret.secretToken, { expiresInMinutes: tokenManager.TOKEN_EXPIRATION });

            return res.json({token: token, currentUser: user});
        });

    });
};

exports.logout = function (req, res) {
    if (req.user) {
        tokenManager.expireToken(req.headers);

        delete req.user;
        return res.send(200);
    }
    else {
        return res.send(401);
    }
};

exports.register = function (req, res) {
    var username = req.body.username || '';
    var password = req.body.password || '';
    var passwordConfirmation = req.body.passwordConfirmation || '';

    if (username == '' || password == '' || password != passwordConfirmation) {
        return res.send(400);
    }

    var user = new User();
    user.username = username;
    user.password = password;

    user.save(function (err) {
        if (err) {
            console.log(err);
            return res.send(500);
        }

        User.count(function (err, counter) {
            if (err) {
                console.log(err);
                return res.send(500);
            }

            if (counter == 1) {
                User.update({username: user.username}, {is_admin: true}, function (err, nbRow) {
                    if (err) {
                        console.log(err);
                        return res.send(500);
                    }

                    console.log('First user created as an Admin');
                    return res.send(200);
                });
            }
            else {
                return res.send(200);
            }
        });
    });
};

// USER
exports.create = function (req, res) {
    var username = req.body.user.username || '';
    var password = req.body.user.password || '';
    var passwordConfirmation = req.body.user.passwordConfirmation || '';
    var firstName = req.body.user.firstName || '';
    var lastName = req.body.user.lastName || '';
    var mail = req.body.user.mail || '';
    var right = req.body.user.right || '';
    var roles = req.body.user.roles;
    var active = req.body.user.active;

    if (active == '' || roles == '' || right == '' || username == '' || password == '' || password != passwordConfirmation) {
        return res.status(400).send("Le formulaire à mal été rempli.");
    }

    var user = new User();
    user.username = username;
    user.password = password;
    user.firstName = firstName;
    user.lastName = lastName;
    user.mail = mail;
    user.right = right;
    user.roles = roles;
    user.active = active;

    user.save(function (err) {
        if (err) {
            console.log(err);
            return res.status(500).send("Une erreur s'est produite durant l'ajout d'un utilisateur.");
        } else {
            return res.status(200).send("L'utilisateur " + user.username + " a bien été ajouté.");
        }
    });
};

exports.delete = function (req, res) {

    User.findById(req.params.id, function (err, user) {

        if (err) {
            console.log(err);
            return res.send(500).send("Une erreur s'est produite durant la suppression de l'utilisateur.");
        }

        if (user != null) {
            return user.remove(function (err) {
                if (!err) {
                    console.log("removed");
                    return res.status(200).send("L'utilisateur " + user.username + " a bien été supprimé.");
                } else {
                    return res.status(500).send("Une erreur s'est produite durant la suppression d'un utilisateur.");
                }
            });
        }
    });
};

exports.update = function (req, res) {

    var username = req.body.user.username || '';
    var password = req.body.user.password || '';
    var passwordConfirmation = req.body.user.passwordConfirmation || '';
    var firstName = req.body.user.firstName || '';
    var lastName = req.body.user.lastName || '';
    var mail = req.body.user.mail || '';
    var notifications = req.body.user.notifications || null;
    var right = req.body.user.right || '';
    var roles = req.body.user.roles;
    var active = req.body.user.active;

    if (username == '' || password == '' || password != passwordConfirmation) {
        return res.send(400);
    }

    User.findById(req.params.id, function (err, user) {

        if (err) {
            console.log(err);
            return res.status(500);
        }

        if (user != null) {
            user.username = username;
            user.password = password;
            user.firstName = firstName;
            user.lastName = lastName;
            user.mail = mail;
            user.notifications = notifications;
            user.right = right;
            user.roles = roles;
            user.active = active;

            return user.save(function (err) {
                if (!err) {
                    console.log("updated");
                    return res.status(200).send("L'utilisateur " + user.username + " a bien été mis à jour.");
                } else {
                    return res.status(500).send("Une erreur s'est produite durant la modification d'un utilisateur.");
                }
            });
        }
    });
};

exports.one = function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) {
            console.log(err);
            return res.send(500);
        }
        if (user != null) {
            return res.status(200).send(user);
        }
    });
};

exports.all = function (req, res) {
    User.find(function (err, users) {
        if (err) {
            console.log(err);
            res.send(err);
        }

        res.json(users);
    });
};

exports.list = function (req, res) {
    var ids = req.body.ids || null;
    if (ids != null) {
        var objectIds = [];
        for (id in ids) {
            objectIds.push(new ObjectId(ids[id]));
        }
        User.find({
            '_id': { $in: objectIds}
        }, function (err, users) {
            if (!err) {
                return res.json(users);
            } else {
                return res.status(500).send("Une erreur s'est produite durant la suppression d'un utilisateur.");
            }

        });
    } else {
        return res.status(400).send("Ids incorrects");
    }
};

// ROLES
exports.deleteRole = function (req, res) {
    var userId = req.params.userId || '';
    var roleId = req.params.roleId || '';
    var projectId = req.body.project || '';

    if (userId == '' || roleId == '' || projectId == '') {
        return res.send(400);
    }

    User.findById(userId, function (err, user) {
        if (err) {
            console.log(err);
            return res.send(500);
        }

        if (user != null) {
            user.roles.id(new ObjectId(roleId)).remove(function (err) {
                if (!err) {

                    user.save(function (err) {
                        if (!err) {
                            console.log("Role removed");
                            Project.findById(projectId, function (err, project) {
                                if (err) {
                                    console.log(err);
                                    return res.send(500);
                                }

                                project.resources.remove(user._id);

                                project.save(function (err) {
                                    if (!err) {
                                        console.log("resource removed from project");
                                        return res.send(user);
                                    } else {
                                        console.log(err);
                                    }
                                });
                            });
                        } else {
                            console.log(err);
                        }
                    });
                } else {
                    console.log(err);
                }
            });
        }
    });
};

exports.addRole = function (req, res) {
    var role = req.body.role.role || '';
    var project = req.body.role.project || '';
    var userId = req.params.id || '';

    if (userId == '' || project == '' || role == '') {
        return res.send(400);
    }

    User.findById(userId, function (err, user) {
        if (err) {
            console.log(err);
            return res.send(500);
        }

        if (user != null) {

            var newRole = {role: { _id: role._id, name: role.name}, project: { _id: project._id, name: project.name}};

            /*            if(Helper.containsObject(newRole, user.roles)){
             console.log("déjà en base");
             return res.send(400);
             }*/

            user.roles.push(newRole);

            user.save(function (err) {
                if (!err) {
                    console.log("role added");

                    Project.findById(project._id, function (err, project) {
                        if (err) {
                            console.log(err);
                            return res.send(500);
                        }

                        if (project != null) {
                            project.resources.push(userId);
                            project.save(function (err) {
                                if (!err) {
                                    console.log("project resources updated");
                                } else {
                                    console.log(err);
                                }
                            });
                        }
                    });

                } else {
                    console.log(err);
                }
                return res.send(user);
            });
        }
    });

};

// NOTIFICATIONS
exports.addNotification = function (req, res) {

    var type = req.body.notification.type || '';
    var message = req.body.notification.message || '';
    var userId = req.params.id;

    if (type == '' || message == '' || userId == '') {
        return res.send(400);
    }

    User.findById(userId, function (err, user) {

        if (err) {
            console.log(err);
            return res.send(500);
        }

        if (user != null) {

            var notification = new Notification();
            notification.type = type;
            notification.message = message;
            user.notifications.push(notification);

            return user.save(function (err) {
                if (!err) {
                    console.log("Notification added");
                } else {
                    console.log(err);
                }
                return res.send(user);
            });
        }
    });
};

exports.deleteNotification = function (req, res) {

    User.findById(req.params.userId, function (err, user) {
        if (err) {
            console.log(err);
            return res.send(500);
        }
        if (user != null) {

            var notification = user.notifications.id(req.params.notificationId);

            if (notification != null) {
                user.notifications.id(notification._id).remove(function (err) {
                    if (!err) {

                        user.save(function (err) {
                            if (!err) {
                                console.log("Notification removed");
                            } else {
                                console.log(err);
                            }
                        });

                        return res.send(user);
                    } else {
                        console.log(err);
                    }
                });
            }
        }
    });
};

exports.projects = function (req, res) {
    var id = new ObjectId(req.params.id);
    Project.find({resources: id}, function (err, projects) {
        if (err)
            return res.status(500).send(err);

        return res.status(200).send(projects);
    });
};