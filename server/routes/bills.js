import express from "express";
import Bill from "../models/Bill.js";
import House from "../models/House.js";
const router = express.Router();

// Get all bills
router.get("/", async (req, res) => {
  try {
    const { houseId } = req.query;

    // If houseId is provided, filter bills by that houseId
    const query = houseId ? { houseId } : {};

    const bills = await Bill.find(query).populate(
      "houseId",
      "houseNumber residentName houseSize phone"
    );

    const formattedBills = bills.map((bill) => ({
      ...bill._doc,
      month: bill.month.toISOString(),
      dueDate: bill.dueDate.toISOString(),
    }));

    res.json(formattedBills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new bill
router.post("/", async (req, res) => {
  try {
    const { houseId, month, dueDate } = req.body;

    // Get house details
    const house = await House.findById(houseId);
    if (!house) return res.status(404).json({ message: "House not found" });

    // Parse house size
    const [sizeValue, sizeUnit] = house.houseSize.split(" ");
    const marlas =
      sizeUnit === "kanal" ? parseInt(sizeValue) * 20 : parseInt(sizeValue);

    // Calculate charges
    const serviceCharge = marlas * 25;
    const totalAmount = marlas * 100;

    // Create bill
    const bill = new Bill({
      houseId,
      month: new Date(month),
      dueDate: new Date(dueDate),
      masjidFund: serviceCharge,
      guardService: serviceCharge,
      streetLighting: serviceCharge,
      gardener: serviceCharge,
      amount: totalAmount,
    });

    const newBill = await bill.save();
    res.status(201).json(newBill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update bill status
// Replace the existing PATCH route with this:
// bills.js - Update the existing PATCH route
router.patch("/:id", async (req, res) => {
  try {
    // Find the bill first to get existing values
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    // Create update object with only the provided fields
    const updateData = {};

    // Only update fields that are provided and valid
    if (req.body.amount !== undefined) {
      updateData.amount = req.body.amount;
    }

    if (req.body.month) {
      updateData.month = new Date(req.body.month);
    }

    if (req.body.dueDate) {
      updateData.dueDate = new Date(req.body.dueDate);
    }

    if (req.body.status) {
      updateData.status = req.body.status;
    }

    const updatedBill = await Bill.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true } // Return the updated document
    );

    res.json(updatedBill);
  } catch (error) {
    res.status(400).json({
      message: error.message,
      details: error.errors,
    });
  }
});

// Add this delete route before export
router.delete("/:id", async (req, res) => {
  try {
    const deletedBill = await Bill.findByIdAndDelete(req.params.id);

    if (!deletedBill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    res.json({ message: "Bill deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
