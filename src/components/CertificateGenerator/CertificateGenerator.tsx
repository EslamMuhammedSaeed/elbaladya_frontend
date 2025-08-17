import React, { useState, useCallback, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ALL_STUDENTS_NOT_PAGINATED } from "../../quiries/courses/getAllTrainees";
import { GET_ALL_COURSES } from "../../quiries/courses/getAllCourses";
import SearchableSelect from "../CustomSelect/SearchableSelect";
import DatePicker from "../DatePicker/DatePicker";
import Button from "../Button/Button";
import styles from "./CertificateGenerator.module.scss";
import { useTranslation } from "react-i18next";
import { CREATE_CERTIFICATE } from "@mutations/certificates/createCertificate";
import { toast } from "react-toastify";

interface Student {
  id: string;
  name: string;
  facultyId: string;
  phone: string;
  stage: string;
  lastAttempt: string;
  points: number;
  badges: string[];
  courses: Array<{
    courseId: string;
    numberOfAttempts: number;
    testResult: number;
    timeSpentTraining: number;
    timeSpentOnExams: number;
  }>;
  group: {
    id: string;
    name: string;
  };
}

interface Course {
  id: string;
  arabicName: string;
  englishName: string;
  picture: string;
  students: Array<{
    numberOfAttempts: number;
    numberOfAttemptsOnTests: number;
    timeSpentOnExams: number;
    timeSpentTraining: number;
    testResult: number;
    trainingResult: number;
  }>;
}

interface CertificateData {
  student: Student | null;
  course: Course | null;
  date: string;
}

const CertificateGenerator: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [certificateData, setCertificateData] = useState<CertificateData>({
    student: null,
    course: null,
    date: "",
  });
  const [isGenerating] = useState(false);
  const [certificateImage, setCertificateImage] =
    useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { data: studentsData } = useQuery(GET_ALL_STUDENTS_NOT_PAGINATED);
  const { data: coursesData } = useQuery(GET_ALL_COURSES);

  const students = studentsData?.getAllStudentsNotPaginated?.data || [];
  const courses = coursesData?.getAllCoursesPaginated?.data || [];

  const [createCertificate] = useMutation(CREATE_CERTIFICATE, {
    onCompleted: () => {
      toast.success(t("certificate.success"), {
        theme: "colored",
        autoClose: 100000,
        pauseOnHover: true,
        draggable: true,
        rtl: i18n.dir() === "rtl",
      });
    },
    onError: (error) => {
      console.error("Create error", error);

      toast.error(t(`certificate.${error.message}`) || t("certificate.error"), {
        theme: "colored",
        autoClose: 100000,
        pauseOnHover: true,
        draggable: true,
        rtl: i18n.dir() === "rtl",
      });
    },
  });
  // Load the certificate template image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setCertificateImage(img);
    };
    img.src = "/certificate.png";
  }, []);

  const handleStudentChange = (student: Student | null) => {
    setCertificateData((prev) => ({ ...prev, student }));
  };

  const handleCourseChange = (course: Course | null) => {
    setCertificateData((prev) => ({ ...prev, course }));
  };

  const handleDateChange = (date: string) => {
    setCertificateData((prev) => ({ ...prev, date }));
  };

  const isFormComplete =
    certificateData.student && certificateData.course && certificateData.date;

  // const formatDate = (dateString: string) => {
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString("en-US", {
  //     day: "2-digit",
  //     month: "2-digit",
  //     year: "numeric",
  //   });
  // };
  const formatDate = (value: string) => {
    if (!value) return "";
    const date = new Date(value);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Function to render certificate preview on canvas
  const renderCertificatePreview = useCallback(() => {
    if (!canvasRef.current || !certificateImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use higher resolution for better quality (2x the display size)
    const displayWidth = 600;
    const displayHeight =
      600 / (certificateImage.width / certificateImage.height);

    // Set canvas size to 2x for high quality
    canvas.width = displayWidth * 2;
    canvas.height = displayHeight * 2;

    // Set display size via CSS
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    // Enable image smoothing for better quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the certificate template image at high resolution
    ctx.drawImage(certificateImage, 0, 0, canvas.width, canvas.height);

    // Now overlay the dynamic text on top with high quality
    // ctx.fillStyle = "#1466a3";
    ctx.fillStyle = "#1466a3";
    ctx.font = "bold 32px Alexandria, Arial, sans-serif"; // 2x font size for high res
    ctx.textAlign = "center";

    // Calculate positions based on canvas size (adjust these values as needed)
    const centerX = canvas.width / 2;

    // Student name position (adjust Y value as needed)
    if (certificateData.student) {
      ctx.fillText(certificateData.student.name, centerX, canvas.height * 0.37);
    }

    // Course name position (adjust Y value as needed)
    if (certificateData.course) {
      ctx.font = "bold 36px Arial, sans-serif"; // 2x font size for high res

      ctx.fillText(
        certificateData.course.arabicName,
        centerX,
        canvas.height * 0.509
      );
      const textWidth = ctx.measureText(
        certificateData.course.arabicName
      ).width;
      const underlineY = canvas.height * 0.5 + 15;
      ctx.beginPath();
      ctx.moveTo(centerX - textWidth / 2, underlineY);
      ctx.lineTo(centerX + textWidth / 2, underlineY);
      ctx.strokeStyle = "#1466a3";
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Date position (adjust Y value as needed)
    if (certificateData.date) {
      ctx.font = "bold 32px Arial, sans-serif"; // 2x font size for high res

      ctx.fillStyle = "#696969"; // Green
      ctx.fillText(
        formatDate(certificateData.date),
        centerX - 27,
        canvas.height * 0.657
      );
    }
  }, [certificateData, certificateImage]);

  // Render preview whenever data or image changes
  useEffect(() => {
    renderCertificatePreview();
  }, [renderCertificatePreview]);

  // const generateCertificateImage = useCallback(async () => {
  //   if (!isFormComplete || !canvasRef.current || !certificateImage) return;

  //   setIsGenerating(true);
  //   try {
  //     const canvas = canvasRef.current;
  //     const ctx = canvas.getContext("2d");
  //     if (!ctx) throw new Error("Could not get canvas context");

  //     // Set canvas size for high quality (use original image dimensions)
  //     canvas.width = certificateImage.width;
  //     canvas.height = certificateImage.height;

  //     // Clear canvas
  //     ctx.clearRect(0, 0, canvas.width, canvas.height);

  //     // Draw the certificate template image at full size
  //     ctx.drawImage(certificateImage, 0, 0);

  //     // Now overlay the dynamic text on top with high quality
  //     ctx.fillStyle = "#1466a3";
  //     ctx.font = "bold 32px Alexandria, Arial, sans-serif";
  //     ctx.textAlign = "center";

  //     // Calculate positions based on original image size (adjust these values as needed)
  //     const centerX = canvas.width / 2;

  //     // Student name position (adjust Y value as needed)
  //     if (certificateData.student) {
  //       ctx.fillText(
  //         certificateData.student.name,
  //         centerX,
  //         canvas.height * 0.4
  //       );
  //     }

  //     // Course name position (adjust Y value as needed)
  //     if (certificateData.course) {
  //       ctx.fillText(
  //         certificateData.course.arabicName,
  //         centerX,
  //         canvas.height * 0.5
  //       );
  //     }

  //     // Date position (adjust Y value as needed)
  //     if (certificateData.date) {
  //       ctx.fillText(
  //         formatDate(certificateData.date),
  //         centerX,
  //         canvas.height * 0.6
  //       );
  //     }

  //     // Convert canvas to blob and send to API
  //     canvas.toBlob(
  //       async (blob) => {
  //         if (!blob) {
  //           throw new Error("Failed to generate image blob");
  //         }

  //         const formData = new FormData();
  //         formData.append("certificateImage", blob, "certificate.png");
  //         formData.append("studentName", certificateData.student?.name || "");
  //         formData.append(
  //           "courseName",
  //           certificateData.course?.arabicName || ""
  //         );
  //         formData.append("completionDate", certificateData.date);
  //         formData.append("studentId", certificateData.student?.id || "");

  //         const response = await fetch("/api/certificates/generate", {
  //           method: "POST",
  //           body: formData,
  //         });

  //         if (!response.ok) {
  //           throw new Error(`HTTP error! status: ${response.status}`);
  //         }

  //         const result = await response.json();
  //         console.log("Certificate generated successfully:", result);

  //         // Optionally trigger download
  //         const url = URL.createObjectURL(blob);
  //         const a = document.createElement("a");
  //         a.href = url;
  //         a.download = `certificate_${
  //           certificateData.student?.name
  //         }_${formatDate(certificateData.date)}.png`;
  //         document.body.appendChild(a);
  //         a.click();
  //         document.body.removeChild(a);
  //         URL.revokeObjectURL(url);
  //       },
  //       "image/png",
  //       0.95
  //     );
  //   } catch (error) {
  //     console.error("Error generating certificate:", error);
  //     alert("Error generating certificate. Please try again.");
  //   } finally {
  //     setIsGenerating(false);
  //   }
  // }, [certificateData, isFormComplete, certificateImage]);

  const handleCreateCertificate = useCallback(async () => {
    if (!isFormComplete) return;
    await createCertificate({
      variables: {
        studentId: certificateData.student?.id || "",
        courseId: certificateData.course?.id || "",
        date: certificateData.date,
      },
    });
  }, [certificateData, isFormComplete, createCertificate]);

  const downloadCertificatePreview = useCallback(() => {
    if (!canvasRef.current || !certificateImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const displayWidth = 600;
    const displayHeight =
      600 / (certificateImage.width / certificateImage.height);

    canvas.width = displayWidth * 2;
    canvas.height = displayHeight * 2;

    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(certificateImage, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#1466a3";
    ctx.font = "bold 32px Alexandria, Arial, sans-serif";
    ctx.textAlign = "center";

    const centerX = canvas.width / 2;

    if (certificateData.student) {
      ctx.fillText(certificateData.student.name, centerX, canvas.height * 0.37);
    }

    if (certificateData.course) {
      ctx.font = "bold 36px Arial, sans-serif";

      ctx.fillText(
        certificateData.course.arabicName,
        centerX,
        canvas.height * 0.509
      );
      const textWidth = ctx.measureText(
        certificateData.course.arabicName
      ).width;
      const underlineY = canvas.height * 0.5 + 15;
      ctx.beginPath();
      ctx.moveTo(centerX - textWidth / 2, underlineY);
      ctx.lineTo(centerX + textWidth / 2, underlineY);
      ctx.strokeStyle = "#1466a3";
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    if (certificateData.date) {
      ctx.font = "bold 32px Arial, sans-serif";

      ctx.fillStyle = "#696969";
      ctx.fillText(
        formatDate(certificateData.date),
        centerX - 27,
        canvas.height * 0.657
      );
    }

    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `certificate_preview_${
      certificateData.student?.name
    }_${formatDate(certificateData.date)}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [certificateData, certificateImage]);

  if (!certificateImage) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <h3>{t("certificate.loadingCertificateTemplate")}</h3>
          <p>{t("certificate.loadingCertificateTemplate")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.certificatePreview}>
        {/* <h3>معاينة الشهادة</h3> */}
        <div className={styles.canvasContainer}>
          <canvas ref={canvasRef} className={styles.certificateCanvas} />
        </div>
      </div>

      <div className={styles.inputSection}>
        {/* <h3>بيانات الشهادة</h3> */}

        <div className={styles.inputsContainer}>
          <div className={styles.inputGroup}>
            <label>{t("certificate.student")}:</label>
            <SearchableSelect
              options={students}
              value={certificateData.student}
              onChange={handleStudentChange}
              getOptionLabel={(student: Student) => student.name}
              getOptionValue={(student: Student) => student.id}
              placeholder={t("certificate.selectStudent")}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>{t("certificate.course")}:</label>
            <SearchableSelect
              options={courses}
              value={certificateData.course}
              onChange={handleCourseChange}
              getOptionLabel={(course: Course) => course.arabicName}
              getOptionValue={(course: Course) => course.id}
              placeholder={t("certificate.selectCourse")}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>{t("certificate.completionDate")}:</label>
            <DatePicker
              value={certificateData.date}
              onChange={handleDateChange}
            />
          </div>
          <div className={styles.buttonContainer}>
            <Button
              onClick={handleCreateCertificate}
              disabled={!isFormComplete || isGenerating}
              className={styles.generateButton}
            >
              {isGenerating
                ? t("certificate.generatingCertificate")
                : t("certificate.generateCertificate")}
            </Button>

            <Button
              onClick={downloadCertificatePreview}
              disabled={!isFormComplete || !certificateImage}
              className={styles.downloadButton}
            >
              {t("certificate.downloadPreview")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateGenerator;
