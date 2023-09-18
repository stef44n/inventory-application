const { body, validationResult } = require("express-validator");
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
exports.type_create_get = (req, res, next) => {
    res.render("type_form", { title: "Create Type" });
};

// Handle Type create on POST.
exports.type_create_post = [
    // Validate and sanitize the name field.
    body("name", "Type name must contain at least 3 characters")
        .trim()
        .isLength({ min: 3 })
        .escape(),

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a type object with escaped and trimmed data.
        const type = new Type({ name: req.body.name });

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render("type_form", {
                title: "Create Type",
                type: type,
                errors: errors.array(),
            });
            return;
        } else {
            // Data from form is valid.
            // Check if Type with same name already exists.
            const typeExists = await Type.findOne({
                name: req.body.name,
            }).exec();
            if (typeExists) {
                // Type exists, redirect to its detail page.
                res.redirect(typeExists.url);
            } else {
                await type.save();
                // New type saved. Redirect to type detail page.
                res.redirect(type.url);
            }
        }
    }),
];

// Display Type delete form on GET.
exports.type_delete_get = asyncHandler(async (req, res, next) => {
    // Get details of type and all associated shoes (in parallel)
    const [type, shoesInType] = await Promise.all([
        Type.findById(req.params.id).exec(),
        Shoe.find({ type: req.params.id }, "name description").exec(),
    ]);
    if (type === null) {
        // No results.
        res.redirect("/catalog/types");
    }

    res.render("type_delete", {
        title: "Delete Type",
        type: type,
        type_shoes: shoesInType,
    });
});

// Handle Type delete on POST.
exports.type_delete_post = asyncHandler(async (req, res, next) => {
    // Get details of type and all associated shoes (in parallel)
    const [type, shoesInType] = await Promise.all([
        Type.findById(req.params.id).exec(),
        Shoe.find({ type: req.params.id }, "name description").exec(),
    ]);

    if (shoesInType.length > 0) {
        // Type has shoes. Render in same way as for GET route.
        res.render("type_delete", {
            title: "Delete Type",
            type: type,
            type_shoes: shoesInType,
        });
        return;
    } else {
        // Type has no shoes. Delete object and redirect to the list of types.
        await Type.findByIdAndRemove(req.body.id);
        res.redirect("/catalog/types");
    }
});

// Display Type update form on GET.
exports.type_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Type update GET");
});

// Handle Type update on POST.
exports.type_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Type update POST");
});
