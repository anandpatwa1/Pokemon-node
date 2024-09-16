const express = require("express");
const { authenticateuser } = require("../Middleware/userMiddleware");
const { addPokemon, deletePokemon, updatePokemon, getMyPokemon, getAllPokemon, getOnePokemon, } = require("../Controller/pakemonController");
const { uploadOther } = require("../Middleware/OtherImageMiddlewere");
const router = express.Router();

const uploadFields = uploadOther.fields([
  { name: 'image', maxCount: 1 },
  { name: 'gallery', maxCount: 10 }
]);

router.get("/", (req, res) => {
  res.send("Welcome to the item");
});

router.post('/add',(req, res, next) => {
  console.log(req.body);
  console.log(req.file);
  console.log(req.files);
  next();
}, uploadFields, authenticateuser, addPokemon);

router.delete('/delete/:id', authenticateuser, deletePokemon);
router.put("/update/:id", (req, res, next) => {
  console.log('Request files:', req.files);
  console.log('Request body:', req.body);
  next();
}, uploadFields, authenticateuser, updatePokemon);
router.get('/my', authenticateuser, getMyPokemon);
router.get('/all', getAllPokemon);
router.get('/get-one/:id', getOnePokemon);





module.exports = router;
