import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import AppRouter from "./routes/AppRouter";
import "bootstrap/dist/css/bootstrap.min.css";

import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}

export default App;