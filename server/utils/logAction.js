const AuditLog = require("../models/AuditLog.js");

const logAction = async ({ action, performedBy, targetModel, targetId, meta }) => {
    try {
        await AuditLog.create({
            action,
            performedBy,
            targetModel,
            targetId,
            meta,
        });
    } catch (err) {
        console.error("Audit log error:", err.message);
    }
};

module.exports = { logAction };