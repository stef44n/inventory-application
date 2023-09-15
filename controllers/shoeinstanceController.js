const ShoeInstance = require("../models/shoeinstance");
const asyncHandler = require("express-async-handler");

// Display list of all ShoeInstances.
exports.shoeinstance_list = asyncHandler(async (req, res, next) => {
    const allShoeInstances = await ShoeInstance.find().populate("shoe").exec();

    res.render("shoeinstance_list", {
        title: "Shoe Instance List",
        shoeinstance_list: allShoeInstances,
    });
});

// Display detail page for a specific ShoeInstance.
exports.shoeinstance_detail = asyncHandler(async (req, res, next) => {
    const shoeInstance = await ShoeInstance.findById(req.params.id)
        .populate("shoe")
        .exec();

    if (shoeInstance === null) {
        // No results.
        const err = new Error("Shoe not found");
        err.status = 404;
        return next(err);
    }

    res.render("shoeinstance_detail", {
        title: "Shoe:",
        shoeinstance: shoeInstance,
    });
});

// Display ShoeInstance create form on GET.
exports.shoeinstance_create_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: ShoeInstance create GET");
});

// Handle ShoeInstance create on POST.
exports.shoeinstance_create_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: ShoeInstance create POST");
});

// Display ShoeInstance delete form on GET.
exports.shoeinstance_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: ShoeInstance delete GET");
});

// Handle ShoeInstance delete on POST.
exports.shoeinstance_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: ShoeInstance delete POST");
});

// Display ShoeInstance update form on GET.
exports.shoeinstance_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: ShoeInstance update GET");
});

// Handle shoeinstance update on POST.
exports.shoeinstance_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: ShoeInstance update POST");
});
