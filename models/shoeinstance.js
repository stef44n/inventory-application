const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ShoeInstanceSchema = new Schema({
    shoe: { type: Schema.Types.ObjectId, ref: "Shoe", required: true }, // reference to the associated shoe
    // imprint: { type: String, required: true },
    color: {
        type: String,
        required: true,
        enum: ["Black", "White", "Red", "Blue"],
        default: "Black",
    },
    size: {
        type: Number,
        required: true,
        enum: [8, 9, 10, 11],
        default: 11,
    },
    // due_back: { type: Date, default: Date.now },
});

// Virtual for shoeinstance's URL
ShoeInstanceSchema.virtual("url").get(function () {
    // We don't use an arrow function as we'll need the this object
    return `/catalog/shoeinstance/${this._id}`;
});

// Export model
module.exports = mongoose.model("ShoeInstance", ShoeInstanceSchema);
