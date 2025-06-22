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

const matchSchema = new Schema(
  {
    slot: {
      type: [slotSchema],
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
