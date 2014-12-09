var Bear = require('../models/bear');

exports.list = function(req, res){
    Bear.find(function(err, bears) {
        if (err)
            res.send(err);

        res.json(bears);
    });
};

exports.one = function(req, res){
    Bear.findById(req.params.id, function (err, bear) {
        if (!err) {
            return res.send(bear);
        } else {
            return console.log(err);
        }
    });
};

exports.create = function(req,res){
    var bear;
    console.log("POST: ");
    console.log(req.body);
    bear = new Bear({
        name: req.body.name
    });

    bear.save(function (err) {
        if (!err) {
            return console.log("created");
        } else {
            return console.log(err);
        }
    });

    return res.send(bear);
};

exports.update = function(req, res){
    Bear.findById(req.params.id, function (err, bear) {
        bear.name = req.body.name;
        return bear.save(function (err) {
            if (!err) {
                console.log("updated");
            } else {
                console.log(err);
            }
            return res.send(bear);
        });
    });
};

exports.delete = function(req,res){
    Bear.findById(req.params.id, function (err, bear) {
        return bear.remove(function (err) {
            if (!err) {
                console.log("removed");
                return res.send(bear);
            } else {
                console.log(err);
            }
        });
    });
};
