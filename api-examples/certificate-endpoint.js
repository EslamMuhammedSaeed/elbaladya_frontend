const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/certificates/';
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `certificate-${uniqueSuffix}.png`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Certificate generation endpoint
app.post('/api/certificates/generate', upload.single('certificate'), async (req, res) => {
    try {
        const { studentId, courseId, date } = req.body;
        const certificateFile = req.file;

        // Validation
        if (!certificateFile) {
            return res.status(400).json({
                success: false,
                error: 'No certificate file provided'
            });
        }

        if (!studentId || !courseId || !date) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: studentId, courseId, date'
            });
        }

        // Generate unique certificate ID
        const certificateId = generateUniqueId();

        // Create certificate record
        const certificateRecord = {
            id: certificateId,
            studentId,
            courseId,
            date,
            imagePath: certificateFile.path,
            imageUrl: `/certificates/${certificateFile.filename}`,
            generatedAt: new Date(),
            status: 'active'
        };

        // Here you would typically:
        // 1. Save the certificate record to your database
        // 2. Update student records if needed
        // 3. Send notifications
        // 4. Log the activity

        console.log('Certificate generated:', certificateRecord);

        // Return success response
        res.status(201).json({
            success: true,
            message: 'Certificate generated successfully',
            data: {
                certificateId: certificateRecord.id,
                imageUrl: certificateRecord.imageUrl,
                studentId,
                courseId,
                date,
                generatedAt: certificateRecord.generatedAt
            }
        });

    } catch (error) {
        console.error('Error generating certificate:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to generate certificate'
        });
    }
});

// Get certificate by ID
app.get('/api/certificates/:id', (req, res) => {
    try {
        const { id } = req.params;

        // Here you would fetch from database
        // For now, return mock data
        res.json({
            success: true,
            data: {
                id,
                studentId: 'mock-student-id',
                courseId: 'mock-course-id',
                date: '2024-01-01',
                imageUrl: `/certificates/mock-certificate.png`,
                status: 'active'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch certificate'
        });
    }
});

// List all certificates
app.get('/api/certificates', (req, res) => {
    try {
        const { page = 1, limit = 10, studentId, courseId } = req.query;

        // Here you would fetch from database with pagination and filters
        // For now, return mock data
        res.json({
            success: true,
            data: {
                certificates: [
                    {
                        id: '1',
                        studentId: 'student-1',
                        courseId: 'course-1',
                        date: '2024-01-01',
                        imageUrl: '/certificates/certificate-1.png',
                        status: 'active'
                    }
                ],
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: 1,
                    pages: 1
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch certificates'
        });
    }
});

// Delete certificate
app.delete('/api/certificates/:id', (req, res) => {
    try {
        const { id } = req.params;

        // Here you would delete from database and remove file
        // For now, return success
        res.json({
            success: true,
            message: 'Certificate deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to delete certificate'
        });
    }
});

// Serve generated certificates
app.use('/certificates', express.static('uploads/certificates'));

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                error: 'File too large. Maximum size is 10MB.'
            });
        }
    }

    console.error('Unhandled error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// Helper function to generate unique ID
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Certificate API server running on port ${PORT}`);
    console.log(`API endpoint: http://localhost:${PORT}/api/certificates/generate`);
    console.log(`Certificates served from: http://localhost:${PORT}/certificates/`);
});

module.exports = app; 