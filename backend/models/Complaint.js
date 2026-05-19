const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    status: {
        type: String,
        default: "Pending",
        enum: ["Pending", "In Progress", "Resolved", "Rejected"]
    },
    // AI Analysis fields
    aiPriority: { type: String },
    aiDepartment: { type: String },
    aiSummary: { type: String },
    aiResponse: { type: String },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
