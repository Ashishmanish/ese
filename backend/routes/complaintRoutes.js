const express = require('express');
const router = express.Router();
const {
    addComplaint,
    getComplaints,
    getComplaintById,
    updateComplaintStatus,
    searchComplaintsByLocation
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');

router.get('/search', protect, searchComplaintsByLocation);
router.route('/').post(protect, addComplaint).get(protect, getComplaints);
router.route('/:id').get(protect, getComplaintById).put(protect, updateComplaintStatus);

module.exports = router;
