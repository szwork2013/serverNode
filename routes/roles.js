var Role = require('../models/role');

exports.create = function (req, res) {

    console.log(req.body);
    var name = req.body.name || '';

    if (name == '') {
        return res.status(400).send("Objet role mal formé.");
    }

    var role = new Role();
    role.name = name;

    role.save(function (err) {
        if (err) {
            console.log(err);
            return res.send(500);
        } else {
            console.log("role created")
        }

        return res.send(role);
    });
};

exports.list = function(req, res){
    User.find( function(err, roles) {
        if (err)
            res.status(400).send(err);

        res.json(roles);
    });
};
