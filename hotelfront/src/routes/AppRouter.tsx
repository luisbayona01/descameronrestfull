import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import HotelsPage from "../pages/HotelsPage";
import ProtectedRoute from "./ProtectedRoute";
import AssignRoomPage from "../pages/AssignRoomPage";
import RoomsPage from "../pages/RoomsPage";
import EditRoomPage from "../pages/EditRoomPage"; 
const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/hoteles"
          element={
            <ProtectedRoute>
              <HotelsPage />
            </ProtectedRoute>
            
          }
        />
       
        <Route path="/rooms/:hotelId" element={<ProtectedRoute><RoomsPage /></ProtectedRoute>} />
        <Route path="/assign-room/:hotelId" element={<ProtectedRoute><AssignRoomPage /></ProtectedRoute>} />
        <Route path="/edit-room/:hotelId/:roomId" element={<ProtectedRoute><EditRoomPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};



export default AppRouter;
