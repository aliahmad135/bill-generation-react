import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
  houseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "House",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  masjidFund: {
    type: Number,
    required: true,
  },
  guardService: {
    type: Number,
    required: true,
  },
  streetLighting: {
    type: Number,
    required: true,
  },
  gardener: {
    type: Number,
    required: true,
  },
  month: {
    type: Date,
    required: [true, "Month is required"],
    validate: {
      validator: function (v) {
        return v instanceof Date && !isNaN(v.valueOf());
      },
      message: "Invalid month date format",
    },
  },
  dueDate: {
    type: Date,
    required: [true, "Due date is required"],
    validate: {
      validator: function (v) {
        return v instanceof Date && !isNaN(v.valueOf());
      },
      message: "Invalid due date format",
    },
  },
  status: {
    type: String,
    enum: ["submitted", "pending", "overdue"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Bill", billSchema);
