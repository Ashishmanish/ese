const Complaint = require('../models/Complaint');

// @desc    Add a new complaint
// @route   POST /api/complaints
// @access  Private (or Public depending on requirement, let's make it Private as per JWT reqs)
const addComplaint = async (req, res) => {
    try {
        const { name, email, title, description, category, location } = req.body;

        if (!name || !email || !title || !description || !category || !location) {
            return res.status(400).json({ message: 'Please add all required fields' });
        }

        const complaint = await Complaint.create({
            name,
            email,
            title,
            description,
            category,
            location
        });

        res.status(201).json(complaint);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find().sort({ createdAt: -1 });
        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get complaint by ID
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }
        res.status(200).json(complaint);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id
// @access  Private
const updateComplaintStatus = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        const updatedComplaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );

        res.status(200).json(updatedComplaint);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Search complaints by location
// @route   GET /api/complaints/search?location=Ghaziabad
// @access  Private
const searchComplaintsByLocation = async (req, res) => {
    try {
        const location = req.query.location;
        if (!location) {
             return res.status(400).json({ message: 'Location query parameter is required' });
        }
        
        const complaints = await Complaint.find({ location: { $regex: location, $options: 'i' } });
        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    addComplaint,
    getComplaints,
    getComplaintById,
    updateComplaintStatus,
    searchComplaintsByLocation
};
