const { DateTime } = require("luxon");

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BrandSchema = new Schema({
    name: { type: String, required: true, maxLength: 100 },
    country: { type: String, required: true, maxLength: 100 },
    established: { type: Date },
    // date_of_death: { type: Date },
});

// Virtual for brand's full name
// BrandSchema.virtual("name").get(function () {
//     // To avoid errors in cases where an brand does not have either a family name or first name
//     // We want to make sure we handle the exception by returning an empty string for that case
//     let fullname = "";
//     if (this.name && this.country) {
//         fullname = `${this.country}, ${this.name}`;
//     }

//     return fullname;
// });

// Virtual for brand's URL
BrandSchema.virtual("url").get(function () {
    // We don't use an arrow function as we'll need the this object
    return `/catalog/brand/${this._id}`;
});

BrandSchema.virtual("est_formatted").get(function () {
    return DateTime.fromJSDate(this.established).toLocaleString(
        DateTime.DATE_MED
    );
});

// Export model
module.exports = mongoose.model("Brand", BrandSchema);
