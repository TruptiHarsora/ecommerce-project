const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
   action: { type: String, required: true }, // e.g. DELETE_REVIEW
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetModel: { type: String }, // User, Product, Review
    targetId: { type: mongoose.Schema.Types.ObjectId },
    meta: { type: Object }, // optional extra data
}, { timestamps: true });

module.exports = mongoose.model("AuditLog", auditLogSchema);