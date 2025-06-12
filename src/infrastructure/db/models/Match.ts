import mongoose from "mongoose";

const Schema = mongoose.Schema;

const slotSchema = new Schema(
  {
    playerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  }, 
  { _id: false }
);

const catStatusSchema = new Schema(
  {
    hp: { type: Number, default: 100 },
    def: { type: Number, default: 50 },
    critrate: { type: Number, default: 0.15 },
    position: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
    },
  },
  { _id: false }
);

const matchSchema = new Schema(
  {
    slot: {
      type: [slotSchema],
    },
    catStatus: {
      type: [catStatusSchema],
    },
    match_status: {
      type: String,
      enum: ["pending", "start", "end"],
      default: "pending",
    },
    endTime: {type: Date}
  },
  { timestamps: true }
);

const Match = mongoose.model("Match", matchSchema);
export default Match;
