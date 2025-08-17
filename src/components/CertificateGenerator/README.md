# Certificate Generator Component

This component allows users to generate training certificates by selecting a student, course, and date. It displays a live preview of the certificate template and generates an image when all fields are filled.

## Features

- **Live Certificate Preview**: Shows the certificate template with real-time updates as inputs are filled
- **Searchable Student Selection**: Dropdown with search functionality to select students
- **Searchable Course Selection**: Dropdown with search functionality to select training courses (in Arabic)
- **Date Picker**: Calendar input for selecting the certificate date
- **Image Generation**: Converts the certificate to an image using html2canvas
- **API Integration**: Sends the generated certificate image to a backend endpoint

## Usage

```tsx
import CertificateGenerator from "./components/CertificateGenerator";

function App() {
  return (
    <div>
      <CertificateGenerator />
    </div>
  );
}
```

## API Endpoint Example

The component sends the generated certificate to `/api/certificates/generate`. Here's an example of how to implement this endpoint:

### Backend Implementation (Node.js/Express)

```javascript
const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/certificates/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `certificate-${uniqueSuffix}.png`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// Certificate generation endpoint
app.post(
  "/api/certificates/generate",
  upload.single("certificate"),
  async (req, res) => {
    try {
      const { studentId, courseId, date } = req.body;
      const certificateFile = req.file;

      if (!certificateFile) {
        return res.status(400).json({ error: "No certificate file provided" });
      }

      // Validate required fields
      if (!studentId || !courseId || !date) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Here you would typically:
      // 1. Save the certificate image to your storage (local filesystem, S3, etc.)
      // 2. Store the certificate record in your database
      // 3. Send notifications if needed
      // 4. Log the activity

      const certificateRecord = {
        id: generateUniqueId(),
        studentId,
        courseId,
        date,
        imagePath: certificateFile.path,
        generatedAt: new Date(),
        status: "active",
      };

      // Save to database (example with MongoDB)
      // await Certificate.create(certificateRecord);

      // Return success response
      res.status(201).json({
        success: true,
        message: "Certificate generated successfully",
        data: {
          certificateId: certificateRecord.id,
          imageUrl: `/certificates/${certificateFile.filename}`,
          studentId,
          courseId,
          date,
        },
      });
    } catch (error) {
      console.error("Error generating certificate:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to generate certificate",
      });
    }
  }
);

// Serve generated certificates
app.use("/certificates", express.static("uploads/certificates"));

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

### Alternative: Python/FastAPI Implementation

```python
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
import uuid
import os
from datetime import datetime
from typing import Optional

app = FastAPI()

UPLOAD_DIR = "uploads/certificates"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/api/certificates/generate")
async def generate_certificate(
    certificate: UploadFile = File(...),
    student_id: str = Form(...),
    course_id: str = Form(...),
    date: str = Form(...)
):
    try:
        # Validate file type
        if not certificate.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Only image files are allowed")

        # Generate unique filename
        file_extension = certificate.filename.split(".")[-1]
        unique_filename = f"certificate-{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)

        # Save the file
        with open(file_path, "wb") as buffer:
            content = await certificate.read()
            buffer.write(content)

        # Here you would save to database
        certificate_record = {
            "id": str(uuid.uuid4()),
            "student_id": student_id,
            "course_id": course_id,
            "date": date,
            "image_path": file_path,
            "generated_at": datetime.now().isoformat(),
            "status": "active"
        }

        # Save to database (example with SQLAlchemy)
        # db.add(Certificate(**certificate_record))
        # db.commit()

        return JSONResponse(
            status_code=201,
            content={
                "success": True,
                "message": "Certificate generated successfully",
                "data": {
                    "certificate_id": certificate_record["id"],
                    "image_url": f"/certificates/{unique_filename}",
                    "student_id": student_id,
                    "course_id": course_id,
                    "date": date
                }
            }
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Serve static files
from fastapi.staticfiles import StaticFiles
app.mount("/certificates", StaticFiles(directory=UPLOAD_DIR), name="certificates")
```

## Component Props

The component doesn't accept any props as it fetches data from GraphQL queries and manages its own state.

## Dependencies

- `html2canvas`: For converting the certificate DOM element to an image
- `@apollo/client`: For GraphQL queries to fetch students and courses
- React components: `SearchableSelect`, `DatePicker`, `Button`

## Styling

The component uses CSS modules with responsive design. The certificate template is styled to match the official certificate design with:

- Professional color scheme
- Arabic and English text support
- Responsive layout for different screen sizes
- Subtle background patterns and graphics
- Clean input form design

## Data Flow

1. Component mounts and fetches students and courses data
2. User selects student, course, and date
3. Certificate preview updates in real-time
4. When all fields are filled, "Create Certificate" button becomes enabled
5. Clicking the button generates an image using html2canvas
6. Image is sent to the API endpoint as FormData
7. Success/error handling is provided

## Error Handling

The component includes error handling for:

- API failures
- Image generation errors
- Missing dependencies
- Network issues

## Browser Compatibility

- Modern browsers with ES6+ support
- Requires canvas API support for image generation
- Responsive design works on mobile and desktop
