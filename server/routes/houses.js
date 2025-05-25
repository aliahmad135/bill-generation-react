import express from "express";
import House from "../models/House.js";
import Bill from "../models/Bill.js";

const router = express.Router();

// Get all houses
router.get("/", async (req, res) => {
  try {
    const houses = await House.find();
    res.json(houses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new house
router.post("/", async (req, res) => {
  const house = new House(req.body);
  try {
    const newHouse = await house.save();
    res.status(201).json(newHouse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get house by ID
router.get("/:id", async (req, res) => {
  try {
    const house = await House.findById(req.params.id);
    if (house) {
      res.json(house);
    } else {
      res.status(404).json({ message: "House not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    // Delete associated bills first
    await Bill.deleteMany({ houseId: req.params.id });

    // Then delete the house
    const deletedHouse = await House.findByIdAndDelete(req.params.id);

    if (!deletedHouse) {
      return res.status(404).json({ message: "House not found" });
    }

    res.json({ message: "House and associated bills deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
