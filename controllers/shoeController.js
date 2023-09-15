const Shoe = require("../models/shoe");
const Brand = require("../models/brand");
const Type = require("../models/type");
const ShoeInstance = require("../models/shoeinstance");

const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
    // Get details of shoes, shoe instances, brands and type counts (in parallel)
    const [
        numShoes,
        numShoeInstances,
        numAvailableShoeInstances,
        numBrands,
        numTypes,
    ] = await Promise.all([
        Shoe.countDocuments({}).exec(),
        ShoeInstance.countDocuments({}).exec(),
        ShoeInstance.countDocuments({ status: "Available" }).exec(),
        Brand.countDocuments({}).exec(),
        Type.countDocuments({}).exec(),
    ]);

    res.render("index", {
        title: "Inventory Application Home",
        shoe_count: numShoes,
        shoe_instance_count: numShoeInstances,
        shoe_instance_available_count: numAvailableShoeInstances,
        brand_count: numBrands,
        type_count: numTypes,
    });
});

// Display list of all shoes.
exports.shoe_list = asyncHandler(async (req, res, next) => {
    const allShoes = await Shoe.find({}, "name brand")
        .sort({ name: 1 })
        .populate("brand")
        .exec();

    res.render("shoe_list", { title: "Shoe List", shoe_list: allShoes });
});

// Display detail page for a specific shoe.
exports.shoe_detail = asyncHandler(async (req, res, next) => {
    // Get details of shoes, shoe instances for specific book
    const [shoe, shoeInstances] = await Promise.all([
        Shoe.findById(req.params.id).populate("brand").populate("type").exec(),
        ShoeInstance.find({ shoe: req.params.id }).exec(),
    ]);

    if (shoe === null) {
        // No results.
        const err = new Error("Shoe not found");
        err.status = 404;
        return next(err);
    }

    res.render("shoe_detail", {
        title: shoe.name,
        shoe: shoe,
        shoe_instances: shoeInstances,
    });
});

// Display shoe create form on GET.
exports.shoe_create_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Shoe create GET");
});

// Handle shoe create on POST.
exports.shoe_create_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Shoe create POST");
});

// Display shoe delete form on GET.
exports.shoe_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Shoe delete GET");
});

// Handle shoe delete on POST.
exports.shoe_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Shoe delete POST");
});

// Display shoe update form on GET.
exports.shoe_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Shoe update GET");
});

// Handle shoe update on POST.
exports.shoe_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Shoe update POST");
});
