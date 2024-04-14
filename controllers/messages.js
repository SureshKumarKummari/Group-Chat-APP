const messagemodel = require('../models/messages');

exports.postMessage = async (req, res, next) => {
    try {
        console.log("I am in POST message!", req.body.message, req.user.id);
        const result = await messagemodel.create({
            message: req.body.message,
            userId: Number(req.user.id)
        });
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Can't send message" });
    }
}
