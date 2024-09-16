const express = require("express");
const router = express.Router();
const { createUser, loginUser, getUser, logout, updateUser, logoutAll } = require("../Controller/userAuth");
const { authenticateuser } = require("../Middleware/userMiddleware");
const { upload } = require("../Middleware/imageMiddlewere");

router.get("/", (req, res) => {
  res.send("Welcome to the user");
});


router.post("/create", createUser);
router.post("/login", loginUser);
router.get("/getuser",authenticateuser, getUser);
router.post("/logout",authenticateuser, logout);
router.post('/logout-all', authenticateuser, logoutAll)
router.put("/update",authenticateuser, upload.single('profile_image'), updateUser);

module.exports = router;
