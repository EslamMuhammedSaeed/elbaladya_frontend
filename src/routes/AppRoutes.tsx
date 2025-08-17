import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@pages/Home";
import NotFound from "@pages/NotFound";
import Login from "@pages/auth/Login";
import MainLayout from "@layouts/MainLayout/MainLayout";
import RouteWithTitle from "@components/RouteWithTitle";
import { ProtectedRoute } from "@components/ProtectedRoute";
import { IoHome } from "react-icons/io5";
import Trainings from "@pages/Trainings/Trainings";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { IoMdPeople } from "react-icons/io";
import Trainees from "@pages/Trainees/Trainees";
import TraineeDetails from "@pages/Trainees/TraineeDetails";
import Admins from "@pages/admins/Admins";
import Groups from "@pages/Groups/Groups";
import Reports from "@pages/Reports/Reports";
import { GrGroup } from "react-icons/gr";
import { IoBarChart } from "react-icons/io5";
import Certificates from "@pages/Certificates/Certificates";
import VR from "@pages/VR/VR";
// import { IoVideocam } from "react-icons/io5";
import { BsHeadsetVr } from "react-icons/bs";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <RouteWithTitle
                element={<Home />}
                icon={<IoHome />}
                title="dashboard"
              />
            }
          />
          <Route
            path="/trainings"
            element={
              <RouteWithTitle
                element={<Trainings />}
                icon={<HiOutlineClipboardDocumentList />}
                title="trainings"
              />
            }
          />
          <Route
            path="/trainees"
            element={
              <RouteWithTitle
                element={<Trainees />}
                icon={<IoMdPeople />}
                title="trainees"
              />
            }
          />
          <Route
            path="/trainees/:id"
            element={
              <RouteWithTitle
                element={<TraineeDetails />}
                icon={<IoMdPeople />}
                title="trainees"
              />
            }
          />
          <Route
            path="/admins"
            element={
              <RouteWithTitle
                element={<Admins />}
                icon={<IoMdPeople />}
                title="admins"
              />
            }
          />
          <Route
            path="/groups"
            element={
              <RouteWithTitle
                element={<Groups />}
                icon={<GrGroup />}
                title="groups"
              />
            }
          />
          <Route
            path="/reports"
            element={
              <RouteWithTitle
                element={<Reports />}
                icon={<IoBarChart />}
                title="reports"
              />
            }
          />
          <Route
            path="/certificates"
            element={
              <RouteWithTitle
                element={<Certificates />}
                icon={<IoBarChart />}
                title="certificates"
              />
            }
          />
          <Route
            path="/vr"
            element={
              <RouteWithTitle
                element={<VR />}
                icon={<BsHeadsetVr />}
                title="vr_headsets"
              />
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
