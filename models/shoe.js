const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ShoeSchema = new Schema({
    name: { type: String, required: true },
    brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    type: [{ type: Schema.Types.ObjectId, ref: "Type" }],
});

// Virtual for shoe's URL
ShoeSchema.virtual("url").get(function () {
    // We don't use an arrow function as we'll need the this object
    return `/catalog/shoe/${this._id}`;
});

// Export model
module.exports = mongoose.model("Shoe", ShoeSchema);
