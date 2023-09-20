const { body, validationResult } = require("express-validator");
const Shoe = require("../models/shoe");
const ShoeInstance = require("../models/shoeinstance");
const asyncHandler = require("express-async-handler");

// Display list of all ShoeInstances.
exports.shoeinstance_list = asyncHandler(async (req, res, next) => {
    const allShoeInstances = await ShoeInstance.find()
        .populate("shoe")
        .sort({ size: 1 })
        .exec();

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
    const allShoes = await Shoe.find({}, "name").exec();

    res.render("shoeinstance_form", {
        title: "Create ShoeInstance",
        shoe_list: allShoes,
    });
});

// Handle ShoeInstance create on POST.
exports.shoeinstance_create_post = [
    // Validate and sanitize fields.
    body("shoe", "Shoe must be specified").trim().isLength({ min: 1 }).escape(),
    body("color", "Color must be specified")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    // body("status").escape(),
    body("size", "Invalid size").optional({ values: "falsy" }),
    // .isISO8601()
    // .toDate(),

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a ShoeInstance object with escaped and trimmed data.
        const shoeInstance = new ShoeInstance({
            shoe: req.body.shoe,
            color: req.body.color,
            // status: req.body.status,
            size: req.body.size,
        });

        if (!errors.isEmpty()) {
            // There are errors.
            // Render form again with sanitized values and error messages.
            const allShoes = await Shoe.find({}, "name").exec();

            res.render("shoeinstance_form", {
                title: "Create ShoeInstance",
                shoe_list: allShoes,
                selected_shoe: shoeInstance.shoe._id,
                errors: errors.array(),
                shoeinstance: shoeInstance,
            });
            return;
        } else {
            // Data from form is valid
            await shoeInstance.save();
            res.redirect(shoeInstance.url);
        }
    }),
];

// Display ShoeInstance delete form on GET.
exports.shoeinstance_delete_get = asyncHandler(async (req, res, next) => {
    const shoeInstance = await ShoeInstance.findById(req.params.id)
        .populate("shoe")
        .exec();

    if (shoeInstance === null) {
        // No results.
        res.redirect("/catalog/shoeinstances");
    }

    res.render("shoeinstance_delete", {
        title: "Delete ShoeInstance",
        shoeinstance: shoeInstance,
    });
});

// Handle ShoeInstance delete on POST.
exports.shoeinstance_delete_post = asyncHandler(async (req, res, next) => {
    // Assume valid ShoeInstance id in field.
    await ShoeInstance.findByIdAndRemove(req.body.id);
    res.redirect("/catalog/shoeinstances");
});

// Display ShoeInstance update form on GET.
exports.shoeinstance_update_get = asyncHandler(async (req, res, next) => {
    // Get shoe, all shoes for form (in parallel)
    const [shoeInstance, allShoes] = await Promise.all([
        ShoeInstance.findById(req.params.id).populate("shoe").exec(),
        Shoe.find(),
    ]);

    if (shoeInstance === null) {
        // No results.
        const err = new Error("Shoe copy not found");
        err.status = 404;
        return next(err);
    }

    res.render("shoeinstance_form", {
        title: "Update ShoeInstance",
        shoe_list: allShoes,
        selected_shoe: shoeInstance.shoe._id,
        shoeinstance: shoeInstance,
    });
});

// Handle shoeinstance update on POST.
exports.shoeinstance_update_post = [
    // Validate and sanitize fields.
    body("shoe", "Shoe must be specified").trim().isLength({ min: 1 }).escape(),
    body("color", "Color must be specified")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    // body("status").escape(),
    body("size", "Invalid size").trim().isLength({ min: 1 }).escape(),
    // .optional({ values: "falsy" })
    // .isISO8601()
    // .toDate(),

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a ShoeInstance object with escaped/trimmed data and current id.
        const shoeInstance = new ShoeInstance({
            shoe: req.body.shoe,
            color: req.body.color,
            // status: req.body.status,
            size: req.body.size,
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            // There are errors.
            // Render the form again, passing sanitized values and errors.

            const allShoes = await Shoe.find({}, "name").exec();

            res.render("shoeinstance_form", {
                title: "Update ShoeInstance",
                shoe_list: allShoes,
                selected_shoe: shoeInstance.shoe._id,
                errors: errors.array(),
                shoeinstance: shoeInstance,
            });
            return;
        } else {
            // Data from form is valid.
            await ShoeInstance.findByIdAndUpdate(
                req.params.id,
                shoeInstance,
                {}
            );
            // Redirect to detail page.
            res.redirect(shoeInstance.url);
        }
    }),
];
