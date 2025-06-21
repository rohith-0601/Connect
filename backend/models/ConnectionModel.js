import mongoose from "mongoose";

const connectionModelSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  connectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: Boolean,
    default: null,
  },
});

const Connection = new mongoose.model("Connection",connectionModelSchema);
export {Connection}
