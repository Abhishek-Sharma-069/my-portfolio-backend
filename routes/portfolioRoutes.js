const express = require('express');
const router = express.Router();
const {
    getPortfolioData,
    updatePortfolioData,
    addProject,
    updateProject,
    deleteProject,
    addExperience,
    updateExperience,
    deleteExperience,
    updateResume
} = require('../controllers/portfolioController');
const { protect } = require('../middleware/authMiddleware');
const { upload, uploadToCloudinary } = require('../config/multer');

router.get('/portfolio-data', getPortfolioData);
router.put('/portfolio-data', protect, updatePortfolioData);

// Project routes
router.post('/projects', protect, upload.single('image'), uploadToCloudinary, addProject);
router.put('/projects/:id', protect, upload.single('image'), uploadToCloudinary, updateProject);
router.delete('/projects/:id', protect, deleteProject);

// Experience routes
router.post('/experience', protect, addExperience);
router.put('/experience/:id', protect, updateExperience);
router.delete('/experience/:id', protect, deleteExperience);

// Resume route
router.put('/resume', protect, upload.single('resume'), uploadToCloudinary, updateResume);

module.exports = router;
