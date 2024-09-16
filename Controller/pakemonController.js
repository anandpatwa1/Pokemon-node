const fs = require('fs');
const path = require('path');

const Pokemon = require("../Models/pokemonModel");

const addPokemon = async (req, res) => {
    try {
      const { Name, breed, description } = req.body;

      const requiredFields = ["Name", "breed"]; 

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }

      const newPokemon = new Pokemon({
        user: req.user._id,
        Name,
        breed,
        description,
        image: req.files['image'] ? req.files['image'][0].filename : null,
        gallery: req.files['gallery'] ? req.files['gallery'].map(file => file.filename) : [],
      });
  
      await newPokemon.save();
      res.status(201).json({
        status: true,
        message: 'Pokemon added successfully.',
        data: newPokemon,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Failed to add Pokemon.',
        error: error.message,
      });
    }
  };
  
  // Delete
  const deletePokemon = async (req, res) => {
    try {
      const pokemon = await Pokemon.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });
  
      if (!pokemon) {
        return res.status(404).json({
          status: false,
          message: 'Pokemon not found or you don’t have permission to delete it.',
        });
      }
  
      res.status(200).json({
        status: true,
        message: 'Pokemon deleted successfully.',
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Failed to delete Pokemon.',
        error: error.message,
      });
    }
  };
  
  // Update
  const updatePokemonold = async (req, res) => {
    try {
      const { Name, breed, description, image, gallery, status } = req.body;
  
      const updatedPokemon = await Pokemon.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id }, // Ensure the user owns this Pokemon
        { $set: { Name, breed, description, image, gallery, status, updated_at: get_current_date() } },
        { new: true }
      );
  
      if (!updatedPokemon) {
        return res.status(404).json({
          status: false,
          message: 'Pokemon not found or you don’t have permission to update it.',
        });
      }
  
      res.status(200).json({
        status: true,
        message: 'Pokemon updated successfully.',
        data: updatedPokemon,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Failed to update Pokemon.',
        error: error.message,
      });
    }
  };


  const updatePokemon = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;
  
    try {
      const pokemon = await Pokemon.findById(id);
  
      if (!pokemon) {
        return res.status(404).json({ error: "Pokemon not found" });
      }
  
      if (pokemon.user.toString() !== userId.toString()) {
        return res.status(403).json({ error: "You do not have permission to update this user" });
      }
  
      for (const key in req.body) {
        pokemon[key] = req.body[key];
      }
  
      if (req.files['image']) {
        if (pokemon.image) {
          const oldImagePath = path.join(__dirname, '../images/', pokemon.image);
          fs.unlink(oldImagePath, (err) => {
            if (err) console.log('Failed to delete old image:', err);
          });
        }
        pokemon.image = req.files['image'][0].filename;
      }
  
      if (req.files['gallery']) {
        if (pokemon.gallery && pokemon.gallery.length > 0) {
          pokemon.gallery.forEach(oldGalleryImage => {
            const oldGalleryImagePath = path.join(__dirname, '../images/', oldGalleryImage);
            fs.unlink(oldGalleryImagePath, (err) => {
              if (err) console.log('Failed to delete old gallery image:', err);
            });
          });
        }
        pokemon.gallery = req.files['gallery'].map(file => file.filename);
      }
  
      const updatedPokemon = await pokemon.save();
      res.status(200).json(updatedPokemon);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Get My Pokemon
  const getMyPokemon = async (req, res) => {
    try {
      const myPokemons = await Pokemon.find({ user: req.user._id });
  
      res.status(200).json({
        status: true,
        message: 'Success',
        data: myPokemons,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Failed to retrieve your Pokemons.',
        error: error.message,
      });
    }
  };
  
  // Get All Pokemon
  const getAllPokemon = async (req, res) => {
    try {
      const allPokemons = await Pokemon.find();
  
      res.status(200).json({
        status: true,
        message: 'Success',
        data: allPokemons,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Failed to retrieve all Pokemons.',
        error: error.message,
      });
    }
  };
  const getOnePokemon = async (req, res) => {
    const id = req.params.id
    try {
      const Pokemons = await Pokemon.findById(id);
  
      res.status(200).json({
        status: true,
        message: 'Success',
        data: Pokemons,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Failed to retrieve Pokemons.',
        error: error.message,
      });
    }
  };
  
  module.exports = {
    addPokemon,
    deletePokemon,
    updatePokemon,
    getMyPokemon,
    getAllPokemon,
    getOnePokemon,
  };