import express from "express";
import Fine from "../models/Fine.js";

const router = express.Router();

// Get all fines
router.get("/", async (req, res) => {
  try {
    const { houseId } = req.query;
    const query = houseId ? { houseId } : {};
    const fines = await Fine.find(query).populate("houseId");
    res.json(fines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new fine
router.post("/", async (req, res) => {
  const fine = new Fine(req.body);
  try {
    const newFine = await fine.save();
    res.status(201).json(newFine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update fine status
router.patch("/:id/status", async (req, res) => {
  try {
    const fine = await Fine.findById(req.params.id);
    if (fine) {
      fine.status = req.body.status;
      const updatedFine = await fine.save();
      res.json(updatedFine);
    } else {
      res.status(404).json({ message: "Fine not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a fine
router.delete("/:id", async (req, res) => {
  try {
    const fine = await Fine.findByIdAndDelete(req.params.id);
    if (fine) {
      res.json({ message: "Fine deleted successfully" });
    } else {
      res.status(404).json({ message: "Fine not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
