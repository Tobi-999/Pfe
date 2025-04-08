import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import SignUp from "./SignUp";
import Login from "./pages/auth/login/Login";
import Dashboard from "./layout/Dashboard";
import Home from "./Home";
import Registrations from "./Registrations";
import Leaves from "./Leaves";
import Employee from "./Employee";
import Jobs from "./Jobs";
import Recordings from "./Recordings";
import Settings from "./Settings";
import Sidebar from "./layout/Dashboard";
import AddJob from "./AddJob";
import UserHome from "./UserHome";
import VueMore from "./VueMore"; // Import VueMore component
import VuePortfolio from "./VuePortfolio"; // Import VuePortfolio component
import ReadJobs from "./ReadJobs"; // Import ReadJobs

function App() {
  const isAuthenticated = true;

  return (
    <Router>
      <div className="app-container flex">
        <Routes>
          {/* Public routes */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          {/* Default route */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Protected routes */}
          <Route
            path="/*"
            element={
              isAuthenticated ? (
                <AuthenticatedApp />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

function AuthenticatedApp() {
  const location = useLocation();
  const showSidebar = !["/login", "/signup"].includes(location.pathname);

  return (
    <div className="authenticated-app flex">
      {showSidebar && <Sidebar />}
      <main
        className={`main-content flex-1 p-8 ${showSidebar ? "ml-64" : ""}`}
        style={{ width: "calc(100vw - 281px)" }}
      >
        <Routes>
          <Route
            path="/dashboard"
            element={
              <>
                <Dashboard />
                <Home />
              </>
            }
          />
          <Route path="/home" element={<Home />} />
          <Route path="/registrations" element={<Registrations />} />
          <Route path="/leaves" element={<Leaves />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/recordings" element={<Recordings />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/add-job" element={<AddJob />} /> {/* Add Job route */}
          <Route path="/UserHome" element={<UserHome />} />{" "}
          {/* Add route for UserHome */}
          <Route path="/vue-more/:id" element={<VueMore />} />{" "}
          {/* Add this route */}
          <Route path="/portfolio" element={<VuePortfolio />} />{" "}
          {/* Add this route */}
          <Route path="/read-jobs" element={<ReadJobs />} />{" "}
          {/* Add route for ReadJobs */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
