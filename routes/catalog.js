const express = require("express");
const router = express.Router();

// Require controller modules.
const shoe_controller = require("../controllers/shoeController");
const brand_controller = require("../controllers/brandController");
const type_controller = require("../controllers/typeController");
const shoe_instance_controller = require("../controllers/shoeinstanceController");

/// SHOE ROUTES ///

// GET catalog home page.
router.get("/", shoe_controller.index);

// GET request for creating a Shoe. NOTE This must come before routes that display Shoe (uses id).
router.get("/shoe/create", shoe_controller.shoe_create_get);

// POST request for creating Shoe.
router.post("/shoe/create", shoe_controller.shoe_create_post);

// GET request to delete Shoe.
router.get("/shoe/:id/delete", shoe_controller.shoe_delete_get);

// POST request to delete Shoe.
router.post("/shoe/:id/delete", shoe_controller.shoe_delete_post);

// GET request to update Shoe.
router.get("/shoe/:id/update", shoe_controller.shoe_update_get);

// POST request to update Shoe.
router.post("/shoe/:id/update", shoe_controller.shoe_update_post);

// GET request for one Shoe.
router.get("/shoe/:id", shoe_controller.shoe_detail);

// GET request for list of all Shoe items.
router.get("/shoes", shoe_controller.shoe_list);

/// BRAND ROUTES ///

// GET request for creating Brand. NOTE This must come before route for id (i.e. display brand).
router.get("/brand/create", brand_controller.brand_create_get);

// POST request for creating Brand.
router.post("/brand/create", brand_controller.brand_create_post);

// GET request to delete Brand.
router.get("/brand/:id/delete", brand_controller.brand_delete_get);

// POST request to delete Brand.
router.post("/brand/:id/delete", brand_controller.brand_delete_post);

// GET request to update Brand.
router.get("/brand/:id/update", brand_controller.brand_update_get);

// POST request to update Brand.
router.post("/brand/:id/update", brand_controller.brand_update_post);

// GET request for one Brand.
router.get("/brand/:id", brand_controller.brand_detail);

// GET request for list of all Brands.
router.get("/brands", brand_controller.brand_list);

/// TYPE ROUTES ///

// GET request for creating a Type. NOTE This must come before route that displays Type (uses id).
router.get("/type/create", type_controller.type_create_get);

//POST request for creating Type.
router.post("/type/create", type_controller.type_create_post);

// GET request to delete Type.
router.get("/type/:id/delete", type_controller.type_delete_get);

// POST request to delete Type.
router.post("/type/:id/delete", type_controller.type_delete_post);

// GET request to update Type.
router.get("/type/:id/update", type_controller.type_update_get);

// POST request to update Type.
router.post("/type/:id/update", type_controller.type_update_post);

// GET request for one Type.
router.get("/type/:id", type_controller.type_detail);

// GET request for list of all Type.
router.get("/types", type_controller.type_list);

/// SHOEINSTANCE ROUTES ///

// GET request for creating a ShoeInstance. NOTE This must come before route that displays ShoeInstance (uses id).
router.get(
    "/shoeinstance/create",
    shoe_instance_controller.shoeinstance_create_get
);

// POST request for creating ShoeInstance.
router.post(
    "/shoeinstance/create",
    shoe_instance_controller.shoeinstance_create_post
);

// GET request to delete ShoeInstance.
router.get(
    "/shoeinstance/:id/delete",
    shoe_instance_controller.shoeinstance_delete_get
);

// POST request to delete ShoeInstance.
router.post(
    "/shoeinstance/:id/delete",
    shoe_instance_controller.shoeinstance_delete_post
);

// GET request to update ShoeInstance.
router.get(
    "/shoeinstance/:id/update",
    shoe_instance_controller.shoeinstance_update_get
);

// POST request to update ShoeInstance.
router.post(
    "/shoeinstance/:id/update",
    shoe_instance_controller.shoeinstance_update_post
);

// GET request for one ShoeInstance.
router.get("/shoeinstance/:id", shoe_instance_controller.shoeinstance_detail);

// GET request for list of all ShoeInstance.
router.get("/shoeinstances", shoe_instance_controller.shoeinstance_list);

module.exports = router;
