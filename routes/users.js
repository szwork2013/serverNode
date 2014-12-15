var User = require('../models/user');
var Notification = require('../models/notification');
var jwt = require('jsonwebtoken');
var secret = require('../config/secret');
var tokenManager = require('../config/token_manager');

exports.login = function(req, res) {
	var username = req.body.username || '';
	var password = req.body.password || '';
	
	if (username == '' || password == '') { 
		return res.status(401).send("Le password ou le login est vide.");
	}

    User.findOne({username: username, active: true}, function (err, user) {

        if (err)
            return res.status(401).send("Une erreur s'est produite durant l'authentification.");
        else if (!user)
            return res.status(401).send("L'utilisateur n'a pas été trouvé.");
		
		user.comparePassword(password, function(isMatch) {
			if (!isMatch) {
				console.log("Attempt failed to login with " + user.username);
                return res.status(401).send("Le mot de passe ou le login est erroné.");
            }

			var token = jwt.sign({id: user._id}, secret.secretToken, { expiresInMinutes: tokenManager.TOKEN_EXPIRATION });
			
			return res.json({token:token, currentUser: user});
		});

	});
};

exports.logout = function(req, res) {
	if (req.user) {
		tokenManager.expireToken(req.headers);

		delete req.user;	
		return res.send(200);
	}
	else {
		return res.send(401);
	}
};

// DEPRECATED
exports.register = function(req, res) {
	var username = req.body.username || '';
	var password = req.body.password || '';
	var passwordConfirmation = req.body.passwordConfirmation || '';

	if (username == '' || password == '' || password != passwordConfirmation) {
		return res.send(400);
	}

	var user = new User();
	user.username = username;
	user.password = password;

	user.save(function(err) {
		if (err) {
			console.log(err);
			return res.send(500);
		}

        User.count(function(err, counter) {
			if (err) {
				console.log(err);
				return res.send(500);
			}

			if (counter == 1) {
                User.update({username:user.username}, {is_admin:true}, function(err, nbRow) {
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

exports.create = function(req, res) {
    var username = req.body.user.username || '';
    var password = req.body.user.password || '';
    var passwordConfirmation = req.body.user.passwordConfirmation || '';
    var firstName = req.body.user.firstName || '';
    var lastName = req.body.user.lastName || '';
    var mail = req.body.user.mail || '';
    var right = req.body.user.right || '';
    var roles = req.body.user.roles;

    var active = req.body.user.active;

    if (right == '' || username == '' || password == '' || password != passwordConfirmation) {
        return res.status(400).send("Le formulaire à mal été rempli.");
    }

    console.log(active);

    var user = new User();
    user.username = username;
    user.password = password;
    user.firstName = firstName;
    user.lastName = lastName;
    user.mail = mail;
    user.right = right;
    user.roles = roles;
    user.active = active;

    user.save(function(err) {
        if (err) {
            return res.status(500).send("Une erreur s'est produite durant l'ajout d'un utilisateur.");
        } else {
            return res.status(200).send("L'utilisateur " + user.username + " a bien été ajouté.");
        }
    });
};

exports.delete = function(req,res){

    console.log("/// DELETE ///");
    console.log(req.params.id);

    User.findById(req.params.id, function (err, user) {

        if (err) {
            console.log(err);
            return res.send(500);
        }

        if(user != null) {
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

exports.update = function(req, res){

    console.log("/// UPDATE USER///");
    console.log(req.body.user);
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
            return res.send(500);
        }

        if(user != null) {
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
                    console.log(err);
                }
            });
        }
    });
};

exports.one =  function(req, res){
    User.findById(req.params.id, function (err, user) {
        if (err) {
            console.log(err);
            return res.send(500);
        }
        if(user != null) {
            return res.status(200).send(user);
        }
    });
};

exports.addNotification = function(req, res){

    console.log("/// ADD NOTIF ///");
    console.log(req.body);
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

        if(user != null) {

            var notification = new Notification();
            notification.type = type;
            notification.message = message;
            user.notifications.push(notification);

            return user.save(function (err) {
                if (!err) {
                    console.log("notification added");
                } else {
                    console.log(err);
                }
                return res.send(user);
            });
        }
    });
};

exports.deleteNotification = function(req, res){

    console.log("/// REMOVE NOTIF ///");
    console.log(req.params.userId);
    console.log(req.params.notificationId);

    User.findById(req.params.userId, function (err, user) {
        if (err) {
            console.log(err);
            return res.send(500);
        }
        if(user != null) {

            var notification = user.notifications.id(req.params.notificationId);

            if(notification != null) {
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

exports.list = function(req, res){
    User.find( function(err, users) {
        if (err)
            res.send(err);

        res.json(users);
    });
};