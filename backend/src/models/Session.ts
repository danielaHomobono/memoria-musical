import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: { type: String, required: true },

  attempts: { type: Number, required: true },
  matchedPairs: { type: Number, required: true },
  duration: { type: Number, required: true }, // en segundos
  createdAt: { type: Date, default: Date.now }
});

export const Session = mongoose.model("Session", sessionSchema);
