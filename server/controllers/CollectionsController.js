const Collection = require("../models/Collection");

module.exports.getCollection = async (req, res, next) => {
  try {
    const { collectionId } = req.params;

    const collection = await Collection.findOne({ _id: collectionId });

    res.send(collection);
  } catch (error) {
    next(error);
  }
};
