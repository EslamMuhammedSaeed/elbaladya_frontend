import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ref, onValue } from "firebase/database";
import db from "../../config/firebase";
import CircularProgress from "../CircularProgress";
import styles from "./VRHeadsets.module.scss";

// Import images
import headsetIcon from "@assets/images/headset.svg";
import lightEffect from "@assets/images/light.svg";
// import personPlaceholder from "../../assets/images/person-placeholder.svg";
import { useQuery } from "@apollo/client";
import { GET_ALL_DEVICES } from "@quiries/devices/getAllDevices";
import { GET_ALL_STUDENTS_NOT_PAGINATED } from "@quiries/courses/getAllTrainees";
import unknownUser from "@assets/images/unknown_user.png";
import { CiBatteryFull } from "react-icons/ci";

// Types
type FirebaseDevice = {
  Battery: number;
  BatteryCharging: boolean;
  Connected: boolean;
  "Control-App": {
    Command: string;
    Course: string;
    ExperimentId: string;
    ExperimentName: string;
    Type: string;
  };
  CurrentCourseId: string;
  CurrentProgress: string;
  CurrentUserId: string;
  IPAddress: string;
  IsUserLogin: boolean;
  "db-id": string;
};

type GraphQLDevice = {
  id: string;
  macAddress: string;
  name: string;
};

type Student = {
  id: string;
  name: string;
  facultyId: string;
  profilePicture: string;
  phone: string;
  email: string;
  lastAttempt: string;
  courses: {
    numberOfAttempts: number;
    progress: number;
    timeSpentTraining: number;
    course: {
      arabicName: string;
      englishName: string;
    };
  }[];
};

type MergedDevice = GraphQLDevice & {
  realtimeData: FirebaseDevice;
  student?: Student;
  userName?: string;
};

// const mockStudents: Record<string, Student> = {
//   user1: {
//     name: "Ahmed Ali",
//     facultyId: "F001",
//     profilePicture: personPlaceholder,
//     phone: "+1234567890",
//     email: "ahmed@example.com",
//     lastAttempt: "2024-01-15",
//     courses: [
//       {
//         numberOfAttempts: 3,
//         progress: 75,
//         timeSpentTraining: 120,
//         course: { arabicName: "مكافحة الحريق", englishName: "Firefighting" },
//       },
//     ],
//   },
//   user2: {
//     name: "Sarah Johnson",
//     facultyId: "F002",
//     profilePicture: personPlaceholder,
//     phone: "+1234567891",
//     email: "sarah@example.com",
//     lastAttempt: "2024-01-14",
//     courses: [
//       {
//         numberOfAttempts: 2,
//         progress: 45,
//         timeSpentTraining: 90,
//         course: { arabicName: "مكافحة الحريق", englishName: "Firefighting" },
//       },
//     ],
//   },
// };

const VRHeadsets: React.FC = () => {
  const [firebaseDevices, setFirebaseDevices] = useState<
    Record<string, FirebaseDevice>
  >({});

  const { data } = useQuery(GET_ALL_DEVICES, {
    fetchPolicy: "network-only",
  });
  const { data: studentsData } = useQuery(GET_ALL_STUDENTS_NOT_PAGINATED, {
    fetchPolicy: "network-only",
  });

  console.log("data", data);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const devicesRef = ref(db, "Devices");
    const unsubscribe = onValue(devicesRef, (snapshot) => {
      const data = snapshot.val();
      setFirebaseDevices(data || {});
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log("firebaseDevices", firebaseDevices);
  }, [firebaseDevices]);

  if (isLoading) return <VRHeadsetsSkeleton />;

  const devices = data?.getAllDevices || [];

  const deviceList = devices
    .map((device: GraphQLDevice) => {
      const firebaseDevice = firebaseDevices[device.macAddress];

      if (firebaseDevice) {
        // console.log(
        //   "studentsData?.getAllStudentsNotPaginated?.data",
        //   firebaseDevice,
        //   firebaseDevice?.CurrentUserId,
        //   studentsData?.getAllStudentsNotPaginated?.data?.find(
        //     (student: Student) => student.id === firebaseDevice?.CurrentUserId
        //   )?.name
        // );
        return (
          <ConnectedHeadsetCard
            key={device.macAddress}
            device={device}
            firebaseData={firebaseDevice}
            userName={
              studentsData?.getAllStudentsNotPaginated?.data?.find(
                (student: Student) =>
                  student.id === firebaseDevice?.CurrentUserId
              )?.name
            }
          />
        );
      }
      return null;
    })
    .filter(Boolean);

  return <div className={styles.container}>{deviceList}</div>;
};

const ConnectedHeadsetCard: React.FC<{
  device: GraphQLDevice;
  firebaseData: FirebaseDevice;
  userName: string;
}> = ({ device, firebaseData, userName }) => {
  // const userId = firebaseData?.ControlApp?.CurrentUserId;
  // const student = userId ? mockStudents[userId] : undefined;

  const mergedDevice: MergedDevice = {
    ...device,
    realtimeData: {
      ...firebaseData,
      "Control-App": firebaseData["Control-App"] || {
        Command: "",
        Course: "",
        ExperimentId: "",
        ExperimentName: "",
        Type: "",
      },
      CurrentCourseId: firebaseData?.CurrentCourseId || "",
      CurrentProgress: firebaseData?.CurrentProgress || "0",
      CurrentUserId: firebaseData?.CurrentUserId || "",
      IPAddress: firebaseData?.IPAddress || "",
      IsUserLogin: firebaseData?.IsUserLogin || false,
    },
    userName: userName,
  };

  return <HeadsetCard device={mergedDevice} />;
};

const HeadsetCard: React.FC<{ device: MergedDevice }> = ({ device }) => {
  const { t } = useTranslation();
  const progress = parseInt(device.realtimeData?.CurrentProgress || "0") || 0;
  const isConnected = device.realtimeData?.Connected ?? false;
  const batteryLevel = device.realtimeData?.Battery ?? 0;
  // const isBatteryCharging = device.realtimeData?.BatteryCharging ?? false;

  return (
    <div className={styles.headsetCard}>
      <div className={styles.cardContent}>
        <div className={styles.lightEffect}>
          <img src={lightEffect} alt={t("vr_headsets.light_effect")} />
        </div>

        <div className={styles.headsetSection}>
          <div className={styles.headsetIcon}>
            <img
              src={headsetIcon}
              alt={t("vr_headsets.headset")}
              className={styles.headsetImage}
            />
            {isConnected && <div className={styles.connectionIndicator} />}
          </div>
          <span className={styles.deviceName}>{device.name}</span>
          {/* <div className={styles.mobileInfo}>
            <span className={styles.mobileName}>{device.name}</span>
            <span className={styles.macAddress}>
              #{device.macAddress.substring(0, 4)}
            </span>
            <span className={styles.courseType}>
              {t("vr_headsets.firefighting")}
            </span>
          </div> */}
        </div>

        <div className={styles.infoSection}>
          <div className={styles.userInfo}>
            <div className={styles.avatarContainer}>
              <img
                className={styles.avatar}
                src={unknownUser}
                alt={t("vr_headsets.default_avatar")}
              />

              {/* {isBatteryCharging && (
                <div className={styles.chargingIndicator} />
              )} */}
            </div>
            <span className={styles.userName}>
              {device.userName || "Unknown"}
            </span>
          </div>

          <div className={styles.separator} />

          <div className={styles.batteryInfo}>
            <div className={styles.batteryIcon}>
              <CiBatteryFull />
            </div>
            {/* <img
              className={styles.avatar}
              src={device.student?.profilePicture || personPlaceholder}
              alt={t("vr_headsets.default_avatar")}
            /> */}
            <span className={styles.batteryLevel}>{batteryLevel}%</span>
          </div>

          <div className={styles.separator} />

          <div className={styles.progressSection}>
            <CircularProgress value={progress} size={41} strokeWidth={3} />
            <span className={styles.progressLabel}>
              {t("vr_headsets.completion_rate")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const VRHeadsetsSkeleton: React.FC = () => {
  return (
    <div className={styles.container}>
      {[...Array(6)].map((_, index) => (
        <HeadsetCardSkeleton key={index} />
      ))}
    </div>
  );
};

const HeadsetCardSkeleton: React.FC = () => {
  return (
    <div className={styles.headsetCard}>
      <div className={styles.cardContent}>
        <div className={styles.headsetSection}>
          <div className={styles.headsetIcon}>
            <div className={styles.skeletonHeadset} />
          </div>
          <div className={styles.skeletonName} />
          {/* <div className={styles.mobileInfo}>
            <div className={styles.skeletonMobileName} />
            <div className={styles.skeletonMacAddress} />
            <div className={styles.skeletonCourseType} />
          </div> */}
        </div>

        <div className={styles.infoSection}>
          <div className={styles.userInfo}>
            <div className={styles.skeletonAvatar} />
            <div className={styles.skeletonUserName} />
          </div>

          <div className={styles.separator} />

          <div className={styles.batteryInfo}>
            <div className={styles.skeletonAvatar} />
            <div className={styles.skeletonBattery} />
          </div>

          <div className={styles.separator} />

          <div className={styles.progressSection}>
            <div className={styles.skeletonProgress} />
            <div className={styles.skeletonProgressLabel} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VRHeadsets;
