const Shoe = require("../models/shoe");
const Type = require("../models/type");
const asyncHandler = require("express-async-handler");

// Display list of all Type.
exports.type_list = asyncHandler(async (req, res, next) => {
    const allTypes = await Type.find().sort({ name: 1 }).exec();
    res.render("type_list", {
        title: "Type List",
        list_types: allTypes,
    });
});

// Display detail page for a specific Type.
exports.type_detail = asyncHandler(async (req, res, next) => {
    // Get details of type and all associated shoes (in parallel)
    const [type, shoesInType] = await Promise.all([
        Type.findById(req.params.id).exec(),
        Shoe.find({ type: req.params.id }, "name description price").exec(),
    ]);
    if (type === null) {
        // No results.
        const err = new Error("Type not found");
        err.status = 404;
        return next(err);
    }

    res.render("type_detail", {
        title: "Type Detail",
        type: type,
        type_shoes: shoesInType,
    });
});

// Display Type create form on GET.
exports.type_create_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Type create GET");
});

// Handle Type create on POST.
exports.type_create_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Type create POST");
});

// Display Type delete form on GET.
exports.type_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Type delete GET");
});

// Handle Type delete on POST.
exports.type_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Type delete POST");
});

// Display Type update form on GET.
exports.type_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Type update GET");
});

// Handle Type update on POST.
exports.type_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Type update POST");
});
