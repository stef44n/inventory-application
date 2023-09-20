const { body, validationResult } = require("express-validator");
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
        // numAvailableShoeInstances,
        numBrands,
        numTypes,
    ] = await Promise.all([
        Shoe.countDocuments({}).exec(),
        ShoeInstance.countDocuments({}).exec(),
        // ShoeInstance
        //     .countDocuments
        //     // { status: "Available" }
        //     ()
        //     .exec(),
        Brand.countDocuments({}).exec(),
        Type.countDocuments({}).exec(),
    ]);

    res.render("index", {
        title: "Inventory Application Home",
        shoe_count: numShoes,
        shoe_instance_count: numShoeInstances,
        // shoe_instance_available_count: numAvailableShoeInstances,
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
    // Get details of shoes, shoe instances for specific shoe
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
    // Get all brands and types, which we can use for adding to our shoe.
    const [allBrands, allTypes] = await Promise.all([
        Brand.find().exec(),
        Type.find().exec(),
    ]);

    res.render("shoe_form", {
        title: "Create Shoe",
        brands: allBrands,
        types: allTypes,
    });
});

// Handle shoe create on POST.
exports.shoe_create_post = [
    // Convert the type to an array.
    (req, res, next) => {
        if (!(req.body.type instanceof Array)) {
            if (typeof req.body.type === "undefined") req.body.type = [];
            else req.body.type = new Array(req.body.type);
        }
        next();
    },

    // Validate and sanitize fields.
    body("name", "Name must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("brand", "Brand must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("description", "Description must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("price", "Price must not be empty")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("type.*").escape(),
    // Process request after validation and sanitization.

    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Shoe object with escaped and trimmed data.
        const shoe = new Shoe({
            name: req.body.name,
            brand: req.body.brand,
            description: req.body.description,
            price: req.body.price,
            type: req.body.type,
        });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all brands and types for form.
            const [allBrands, allTypes] = await Promise.all([
                Brand.find().exec(),
                Type.find().exec(),
            ]);

            // Mark our selected types as checked.
            for (const type of allTypes) {
                if (shoe.type.includes(type._id)) {
                    type.checked = "true";
                }
            }
            res.render("shoe_form", {
                title: "Create Shoe",
                brands: allBrands,
                types: allTypes,
                shoe: shoe,
                errors: errors.array(),
            });
        } else {
            // Data from form is valid. Save shoe.
            await shoe.save();
            res.redirect(shoe.url);
        }
    }),
];

// Display shoe delete form on GET.
exports.shoe_delete_get = asyncHandler(async (req, res, next) => {
    const [shoe, shoeInstances] = await Promise.all([
        Shoe.findById(req.params.id).populate("brand").populate("type").exec(),
        ShoeInstance.find({ shoe: req.params.id }).exec(),
    ]);

    if (shoe === null) {
        // No results.
        res.redirect("/catalog/shoes");
    }

    res.render("shoe_delete", {
        title: "Delete Shoe",
        shoe: shoe,
        shoe_instances: shoeInstances,
    });
});

// Handle shoe delete on POST.
exports.shoe_delete_post = asyncHandler(async (req, res, next) => {
    // Assume the post has valid id (ie no validation/sanitization).

    const [shoe, shoeInstances] = await Promise.all([
        Shoe.findById(req.params.id).populate("brand").populate("type").exec(),
        ShoeInstance.find({ shoe: req.params.id }).exec(),
    ]);

    if (shoe === null) {
        // No results.
        res.redirect("/catalog/shoes");
    }

    if (shoeInstances.length > 0) {
        // Shoe has shoe_instances. Render in same way as for GET route.
        res.render("shoe_delete", {
            title: "Delete Shoe",
            shoe: shoe,
            shoe_instances: shoeInstances,
        });
        return;
    } else {
        // Shoe has no ShoeInstance objects. Delete object and redirect to the list of shoes.
        await Shoe.findByIdAndRemove(req.body.id);
        res.redirect("/catalog/shoes");
    }
});

// Display shoe update form on GET.
exports.shoe_update_get = asyncHandler(async (req, res, next) => {
    // Get shoe, brands and types for form.
    const [shoe, allBrands, allTypes] = await Promise.all([
        Shoe.findById(req.params.id).populate("brand").populate("type").exec(),
        Brand.find().exec(),
        Type.find().exec(),
    ]);

    if (shoe === null) {
        // No results.
        const err = new Error("Shoe not found");
        err.status = 404;
        return next(err);
    }

    // Mark our selected types as checked.
    for (const type of allTypes) {
        for (const shoe_t of shoe.type) {
            if (type._id.toString() === shoe_t._id.toString()) {
                type.checked = "true";
            }
        }
    }

    res.render("shoe_form", {
        title: "Update Shoe",
        brands: allBrands,
        types: allTypes,
        shoe: shoe,
    });
});

// Handle shoe update on POST.
exports.shoe_update_post = [
    // Convert the type to an array.
    (req, res, next) => {
        if (!(req.body.type instanceof Array)) {
            if (typeof req.body.type === "undefined") {
                req.body.type = [];
            } else {
                req.body.type = new Array(req.body.type);
            }
        }
        next();
    },

    // Validate and sanitize fields.
    body("name", "Name must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("brand", "Brand must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("description", "Description must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("price", "Price must not be empty")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("type.*").escape(),

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Shoe object with escaped/trimmed data and old id.
        const shoe = new Shoe({
            title: req.body.name,
            brand: req.body.brand,
            description: req.body.description,
            price: req.body.price,
            type: typeof req.body.type === "undefined" ? [] : req.body.type,
            _id: req.params.id, // This is required, or a new ID will be assigned!
        });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all brands and types for form
            const [allBrands, allTypes] = await Promise.all([
                Brand.find().exec(),
                Type.find().exec(),
            ]);

            // Mark our selected types as checked.
            for (const type of allTypes) {
                if (shoe.type.indexOf(type._id) > -1) {
                    type.checked = "true";
                }
            }
            res.render("shoe_form", {
                title: "Update Shoe",
                brands: allBrands,
                types: allTypes,
                shoe: shoe,
                errors: errors.array(),
            });
            return;
        } else {
            // Data from form is valid. Update the record.
            const updatedShoe = await Shoe.findByIdAndUpdate(
                req.params.id,
                shoe,
                {}
            );
            // Redirect to shoe detail page.
            res.redirect(updatedShoe.url);
        }
    }),
];
