const { Schema, model, Types } = require("mongoose");

const agentCodeSchema = new Schema({
  agent_id: {
    type: Types.ObjectId,
    ref: "Agent",
    require: true,
  },
  code: { type: String, require: true },
  generated_in: { type: Date, default: new Date() },
});

module.exports = model("AgentCode", agentCodeSchema);
