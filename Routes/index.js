const express = require("express");
const router = express.Router();
const user = require('./userRoutes');
const item = require('./pokemonRoute');

router.use("/user", user);
router.use("/item", item);

module.exports = router;
