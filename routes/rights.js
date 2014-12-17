var Right = require('../models/right');
var User = require('../models/user');

exports.create = function (req, res) {

    var name = req.body.right.name || '';

    if (name == '') {
        return res.status(400).send("Objet droit mal formé.");
    }

    var right = new Right();
    right.name = name;

    right.save(function (err) {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        } else {
            console.log("right created")
        }
        return res.status(200).send("Le droit " + right.name + " a bien été ajouté.");
    });
};

exports.update = function(req, res){

/*    User.find({"right._id": req.params.id}, function(err, users) {

        if (err) {
            return res.status(400).send(err);
        } else {

            if(users.length > 0) {
                return res.status(409).send("Ce droit est attribué a des utilisateurs et ne peut être supprimé.");
            } else {*/
                console.log("Request body update right : " + req.body);
                var name = req.body.right.name || '';

                if (name == '') {
                    return res.send(400);
                }

                Right.findById(req.params.id, function (err, right) {

                    if (err) {
                        console.log(err);
                        return res.status(500).send(err);
                    }

                    if(right != null) {
                        right.name = name;

                        return right.save(function (err) {
                            if (!err) {

                                User.find({"right._id": req.params.id}, function(err, users) {

                                    if (err) {
                                        return res.status(500).send(err);
                                    } else {
                                        for(var u in users){
                                            users[u].right = right;
                                            users[u].save(function (err) {
                                                if (err)
                                                    console.log(err);
                                            });
                                        }
                                    }

                                    return res.status(200).send("Le droit " + right.name + " a bien été mis à jour.");
                                });
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
/*            }
        }

    });*/
};

exports.delete = function(req, res){

    User.find({"right._id": req.params.id}, function(err, users) {

        if (err) {
            console.log(err);
            return res.status(400).send(err);
        } else {

            if(users.length > 0) {
                return res.status(409).send("Ce droit est attribué a des utilisateurs et ne peut être supprimé.");
            } else {
                Right.findById(req.params.id, function (err, right) {

                    if (err) {
                        console.log(err);
                        return res.status(500).send(err);
                    }

                    if(right != null) {

                        return right.remove(function (err) {
                            if (!err) {
                                return res.send(right);
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

exports.list = function(req, res){
    Right.find( function(err, rights) {
        if (err)
            res.status(400).send(err);

        res.status(200).json(rights);
    });
};
