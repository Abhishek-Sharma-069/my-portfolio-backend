const multer = require('multer');
const cloudinary = require('./cloudinary');
const path = require('path'); // 👈 Added for preserving original filename

console.log('🔧 Initializing Custom Multer Storage...');
console.log('Cloudinary config:', {
    cloud_name: cloudinary.config().cloud_name,
    api_key: cloudinary.config().api_key ? 'Set' : 'Not Set',
    api_secret: cloudinary.config().api_secret ? 'Set' : 'Not Set'
});

// Custom storage that uploads to memory before sending to Cloudinary
const storage = multer.memoryStorage();

console.log('✅ Custom Multer Storage initialized');

const fileFilter = (req, file, cb) => {
    console.log('🔍 Multer fileFilter - Processing file:', {
        fieldname: file.fieldname,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size
    });
    
    // Allow only images, PDFs, and Word documents
    if (
        file.mimetype.startsWith('image/') || 
        file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/msword' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
        console.log('✅ File accepted by multer');
        cb(null, true);
    } else {
        console.log('❌ File rejected by multer - invalid type:', file.mimetype);
        cb(new Error('Invalid file type. Only images, PDFs, and Word documents are allowed.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Helper function to determine file type and resource type
const getFileTypeAndResourceType = (filename, mimetype) => {
    const extension = filename.toLowerCase().split('.').pop();
    
    // Image files
    if (['jpg', 'jpeg', 'png', 'webp'].includes(extension) || mimetype.startsWith('image/')) {
        return { fileType: 'image', resourceType: 'image' };
    }
    
    // Document files
    if (
        ['pdf', 'doc', 'docx'].includes(extension) || 
        mimetype === 'application/pdf' || 
        mimetype === 'application/msword' || 
        mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
        return { fileType: 'document', resourceType: 'auto' }; // 👈 use auto for documents
    }
    
    // Unsupported file type
    return { fileType: 'unsupported', resourceType: null };
};

// Middleware to upload file to Cloudinary after multer processes it
const uploadToCloudinary = async (req, res, next) => {
    if (req.file) {
        try {
            console.log('☁️ Uploading file to Cloudinary...');
            console.log('📁 File details:', {
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size
            });

            // Check file type and determine resource type
            const { fileType, resourceType } = getFileTypeAndResourceType(
                req.file.originalname, 
                req.file.mimetype
            );

            if (fileType === 'unsupported') {
                console.error('❌ Unsupported file type:', req.file.originalname);
                return res.status(400).json({ 
                    message: 'Unsupported file type. Only images (jpg, jpeg, png, webp) and documents (pdf, doc, docx) are allowed.',
                    filename: req.file.originalname
                });
            }

            console.log('📋 File type:', fileType, 'Resource type:', resourceType);

            // Prepare upload options based on file type
            const uploadOptions = {
                folder: 'portfolio',
                resource_type: resourceType
            };

            if (fileType === 'image') {
                // Images: unique filenames, with transformations
                uploadOptions.use_filename = false;
                uploadOptions.unique_filename = true;
                uploadOptions.transformation = [
                    { width: 1000, height: 1000, crop: 'limit' }
                ];
            } else if (fileType === 'document') {
                // Documents: preserve original filename
                uploadOptions.use_filename = true;
                uploadOptions.unique_filename = false;
                uploadOptions.format = "pdf"; // Force PDF extension
                uploadOptions.public_id = path.parse(req.file.originalname).name; // 👈 FIX: keep original filename
                uploadOptions.resource_type = 'raw';
                uploadOptions.access_mode = 'public';
                uploadOptions.type = 'upload'; 
            }

            // Upload to Cloudinary
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    uploadOptions,
                    (error, result) => {
                        if (error) {
                            console.error('❌ Cloudinary upload error:', error);
                            reject(error);
                        } else {
                            console.log('✅ Cloudinary upload successful:', result.secure_url);
                            resolve(result);
                        }
                    }
                ).end(req.file.buffer);
            });

            // Add Cloudinary result to req.file
            req.file.secure_url = result.secure_url;
            req.file.public_id = result.public_id;
            req.file.format = result.format;
            req.file.resource_type = result.resource_type;
            
            // Only add width/height for images
            if (fileType === 'image') {
                req.file.width = result.width;
                req.file.height = result.height;
            }

            console.log('✅ File uploaded to Cloudinary successfully');
            console.log('🔗 URL:', req.file.secure_url);
            console.log('📋 Resource type:', req.file.resource_type);
            
        } catch (error) {
            console.error('❌ Error uploading to Cloudinary:', error);
            return res.status(500).json({ 
                message: 'Error uploading file to Cloudinary',
                error: error.message 
            });
        }
    }
    next();
};

module.exports = { upload, uploadToCloudinary };
