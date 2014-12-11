var Notification = require('../models/bear');

exports.listByUserId = function(req, res){
    Notification.find(req.params.id, function(err, notifications) {
        if (err)
            res.send(err);

        res.json(notifications);
    });
};

exports.create = function(req, res){

    var type = req.body.notification.type;
    var message = req.body.notification.message;
    var user_id = req.body.notification.user_id;

    if (type == '' || message == '' || user_id == '') {
        return res.send(400);
    }

    var notification = new Notification();
    notification.type = type;
    notification.message = message;
    notification.user_id = user_id;

    notification.save(function(err) {
        if (err) {
            console.log(err);
            return res.send(500);
        } else {
            console.log("notification created")
        }

        return res.send(notification);
    });
};

exports.delete = function(req, res){
    Notification.findById(req.params.id, function (err, notification) {
        return notification.remove(function (err) {
            if (!err) {
                console.log("removed");
                return res.send(notification);
            } else {
                console.log(err);
            }
        });
    });
};
