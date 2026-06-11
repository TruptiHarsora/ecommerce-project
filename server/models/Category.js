const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: null
    },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

categorySchema.index({ parent: 1 });

module.exports = mongoose.model("Category", categorySchema);