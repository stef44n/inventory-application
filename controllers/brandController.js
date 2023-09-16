const { body, validationResult } = require("express-validator");
const Shoe = require("../models/shoe");
const Brand = require("../models/brand");
const asyncHandler = require("express-async-handler");

// Display list of all Brands.
exports.brand_list = asyncHandler(async (req, res, next) => {
    const allBrands = await Brand.find().sort({ name: 1 }).exec();
    res.render("brand_list", {
        title: "Brand List",
        brand_list: allBrands,
    });
});

// Display detail page for a specific Brand.
exports.brand_detail = asyncHandler(async (req, res, next) => {
    // Get details of brand and all their shoes (in parallel)
    const [brand, allShoesByBrand] = await Promise.all([
        Brand.findById(req.params.id).exec(),
        Shoe.find({ brand: req.params.id }, "name description price").exec(),
    ]);

    if (brand === null) {
        // No results.
        const err = new Error("Brand not found");
        err.status = 404;
        return next(err);
    }

    res.render("brand_detail", {
        title: "Brand Detail",
        brand: brand,
        brand_shoes: allShoesByBrand,
    });
});

// Display Brand create form on GET.
exports.brand_create_get = (req, res, next) => {
    res.render("brand_form", { title: "Create Brand" });
};

// Handle Brand create on POST.
exports.brand_create_post = [
    // Validate and sanitize fields.
    body("name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Name must be specified.")
        .isAlphanumeric()
        .withMessage("Name has non-alphanumeric characters."),
    body("country")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Country name must be specified.")
        .isAlphanumeric()
        .withMessage("Country name has non-alphanumeric characters."),
    body("established", "Invalid date")
        .optional({ values: "falsy" })
        .isISO8601()
        .toDate(),
    // body("date_of_death", "Invalid date of death")
    //     .optional({ values: "falsy" })
    //     .isISO8601()
    //     .toDate(),

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create Brand object with escaped and trimmed data
        const brand = new Brand({
            name: req.body.name,
            country: req.body.country,
            established: req.body.established,
            // date_of_death: req.body.date_of_death,
        });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render("brand_form", {
                title: "Create Brand",
                brand: brand,
                errors: errors.array(),
            });
            return;
        } else {
            // Data from form is valid.

            // Save brand.
            await brand.save();
            // Redirect to new brand record.
            res.redirect(brand.url);
        }
    }),
];

// Display Brand delete form on GET.
exports.brand_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Brand delete GET");
});

// Handle Brand delete on POST.
exports.brand_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Brand delete POST");
});

// Display Brand update form on GET.
exports.brand_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Brand update GET");
});

// Handle Brand update on POST.
exports.brand_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Brand update POST");
});
