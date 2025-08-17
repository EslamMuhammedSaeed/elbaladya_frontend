import React, {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import styles from "./UploadModal.module.scss";
import { useTranslation } from "react-i18next";
import Skeleton from "@components/Skeleton/Skeleton";
import { useMutation } from "@apollo/client";
// import { toast } from "react-toastify";
import type { BulkCreateAdminsResponse } from "@utils/types";
import { BULK_CREATE_ADMINS } from "@mutations/admins/BulkAdminUpload";

interface UploadModalProps {
  onClose: () => void;
  refetch: () => void;
}

const UploadAdminsModal: React.FC<UploadModalProps> = ({
  onClose,
  refetch,
}) => {
  const { t } = useTranslation();

  const [uploadFile] =
    useMutation<BulkCreateAdminsResponse>(BULK_CREATE_ADMINS);
  const [fileName, setFileName] = useState<string>("");
  const [result, setResult] = useState<
    BulkCreateAdminsResponse["bulkCreateAdmins"] | null
  >(null);
  const [fileLoading, setFileLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setFileName(file.name);
    setError("");
    setResult(null);
    setFileLoading(true);
    console.log("file", file);
    try {
      const response = await uploadFile({ variables: { file } });
      if (response.data) {
        setResult(response.data.bulkCreateAdmins);
        // toast.success(t("addGroupModal.success"), {
        //         theme: "colored",
        //         autoClose: 100000,
        //         pauseOnHover: true,
        //         draggable: true,
        //         rtl: i18n.dir() === "rtl",
        //       });
        refetch();
      } else {
        setError("Unexpected server response");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError("Upload failed: " + err.message);
      } else {
        setError("Upload failed");
      }
    } finally {
      setFileLoading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{t("uploadModal.bulkUpload")}</h2>
        </div>

        <div className={styles.formContent}>
          <div className={styles.step}>
            {/* <div className="d-flex gap-2 w-100"> */}
            <div className={styles.formGroup}>
              <label>{t("uploadModal.Upload Admins via CSV")}</label>
              {fileLoading ? (
                <Skeleton height={40} width="100%" />
              ) : (
                <>
                  <div
                    className={styles.dropZone}
                    onClick={openFileDialog}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    {fileName ? (
                      <p className="m-0">📄 {fileName}</p>
                    ) : (
                      <p className="m-0">{t("uploadModal.clickOrDragCSV")}</p>
                    )}
                    <input
                      ref={inputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                  </div>

                  {fileName && (
                    <p className={styles.fileName}>Selected: {fileName}</p>
                  )}
                  {fileLoading && <p>⏳ Uploading...</p>}
                  {error && <p style={{ color: "red" }}>{error}</p>}

                  {result && (
                    <div style={{ marginTop: "1rem" }}>
                      <p>✅ Successfully created: {result.successCount}</p>

                      {result.failed.length > 0 && (
                        <div>
                          <p>❌ Failed Rows:</p>
                          <ul>
                            {result.failed.map((fail) => (
                              <li key={fail.row}>
                                Row {fail.row}: {fail.reason} (Name: {fail.name}
                                , Email: {fail.email})
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
            <div className={styles.templateLink}>
              <a href="/admins_template.csv" download>
                {t("uploadModal.downloadTemplate")}
              </a>
            </div>
          </div>
        </div>
        <div className={styles.actions}>
          <div className={styles.back}>
            {fileLoading ? (
              <Skeleton height={40} width={120} />
            ) : (
              <button onClick={onClose} className={styles.cancel}>
                {t("addUserModal.exit")}
              </button>
            )}
          </div>

          {/* {loading ? (
              <Skeleton height={40} width={160} />
            ) : (
              <button onClick={handleCreate} className={styles.next}>
                {t("addUserModal.submit")}
              </button>
            )} */}
        </div>
      </div>
    </div>
  );
};

export default UploadAdminsModal;
