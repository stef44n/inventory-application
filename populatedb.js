#! /usr/bin/env node

console.log(
    'This script populates some test shoes, brands, types and shoeinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Shoe = require("./models/shoe");
const Brand = require("./models/brand");
const Type = require("./models/type");
const ShoeInstance = require("./models/shoeinstance");

const types = [];
const brands = [];
const shoes = [];
const shoeinstances = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createTypes();
    await createBrands();
    await createShoes();
    await createShoeInstances();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// type[0] will always be the Fantasy type, regardless of the order
// in which the elements of promise.all's argument complete.
async function typeCreate(index, name) {
    const type = new Type({ name: name });
    await type.save();
    types[index] = type;
    console.log(`Added type: ${name}`);
}

async function brandCreate(index, name, country, est) {
    const branddetail = { name: name, country: country };
    if (est != false) branddetail.established = est;
    // if (d_death != false) branddetail.date_of_death = d_death;

    const brand = new Brand(branddetail);

    await brand.save();
    brands[index] = brand;
    console.log(`Added brand: ${name} ${country}`);
}

async function shoeCreate(index, name, description, price, brand, type) {
    const shoedetail = {
        name: name,
        description: description,
        brand: brand,
        price: price,
    };
    if (type != false) shoedetail.type = type;

    const shoe = new Shoe(shoedetail);
    await shoe.save();
    shoes[index] = shoe;
    console.log(`Added shoe: ${name}`);
}

async function shoeInstanceCreate(index, shoe, color, size) {
    const shoeinstancedetail = {
        shoe: shoe,
        color: color,
    };
    if (size != false) shoeinstancedetail.size = size;
    // if (status != false) shoeinstancedetail.status = status;

    const shoeinstance = new ShoeInstance(shoeinstancedetail);
    await shoeinstance.save();
    shoeinstances[index] = shoeinstance;
    console.log(`Added shoeinstance: ${color}`);
}

async function createTypes() {
    console.log("Adding types");
    await Promise.all([
        typeCreate(0, "Football boot"),
        typeCreate(1, "Trainer"),
        typeCreate(2, "Slider"),
    ]);
}

async function createBrands() {
    console.log("Adding brands");
    await Promise.all([
        brandCreate(0, "Nike", "USA", "1964-01-25"),
        brandCreate(1, "Adidas", "Germany", "1949-08-18"),
        brandCreate(2, "Mizuno", "Japan", "1906-04-01"),
        brandCreate(3, "Dr Martens", "UK", false),
        brandCreate(4, "Vans", "USA", "1966-03-16"),
    ]);
}

async function createShoes() {
    console.log("Adding Shoes");
    await Promise.all([
        shoeCreate(
            0,
            "Morelia Neo IV Pro FG",
            "Made in Indonesia",
            120,
            brands[2],
            [types[0]]
        ),
        shoeCreate(1, "Originals Superstar", "Classic", 90, brands[1], [
            types[1],
        ]),
        shoeCreate(2, "Tiempo IX", "K Leather", 140, brands[0], [types[0]]),
        shoeCreate(3, "1461", "Suede", 109, brands[3], [types[1]]),
        shoeCreate(4, "Vans", "-", 85, brands[4], [types[1]]),
        shoeCreate(5, "Test Shoe 1", "Summary of test shoe 1", 99, brands[4], [
            types[0],
            types[1],
        ]),
        shoeCreate(
            6,
            "Test Shoe 2",
            "Summary of test shoe 2",
            35,
            brands[4],
            false
        ),
    ]);
}

async function createShoeInstances() {
    console.log("Adding shoe instances");
    await Promise.all([
        shoeInstanceCreate(0, shoes[0], "White", 8),
        shoeInstanceCreate(1, shoes[1], "Red", 11),
        shoeInstanceCreate(2, shoes[2], "Black", 9),
        shoeInstanceCreate(3, shoes[3], "White", 10),
        shoeInstanceCreate(4, shoes[3], "White", 11),
        shoeInstanceCreate(5, shoes[3], "Blue", 9),
        shoeInstanceCreate(6, shoes[4], "Red", 10),
        shoeInstanceCreate(7, shoes[4], "Black", 11),
        shoeInstanceCreate(8, shoes[4], "Blue", 8),
        shoeInstanceCreate(9, shoes[0], "Red", 9),
        shoeInstanceCreate(10, shoes[1], "Red", 8),
    ]);
}
