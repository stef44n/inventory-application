const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TypeSchema = new Schema({
    name: { type: String, required: true, minLength: 3, maxLength: 100 },
});

// Virtual for this type instance URL.
TypeSchema.virtual("url").get(function () {
    return "/catalog/type/" + this._id;
});

// Export model.
module.exports = mongoose.model("Type", TypeSchema);
