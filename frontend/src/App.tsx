import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "../src/pages/Signin";
import SignUp from "../src/pages/Signup";
import CreateCompany from "../src/pages/CreateCompany";
import SalesRepresentativeDashboard from "../src/pages/SalesRepresentativeDashboard";
import ProtectedRoute from "../src/components/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/create-company" element={<CreateCompany />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={["SALES_REPRESENTATIVE"]} />}>
          <Route path="/sales-representative-dashboard" element={<SalesRepresentativeDashboard />} />
        </Route>

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/signin" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;





  // email
  // salesrep@test.com
  // password: 
  //  SalesRep@123