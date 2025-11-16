import { BrowserRouter, Routes, Route } from "react-router-dom";
import EmployerRoutes from "./routes/employerRoutes";
import CandidateRoutes from "./routes/candidateRoutes";
import AdminRoutes from "./routes/adminRoutes";
import HomePage from "./HomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home chung */}
        <Route path="/" element={<HomePage />} />

        {/* Candidate */}
        <Route path="/candidate/*" element={<CandidateRoutes />} />

        {/* Employer */}
        <Route path="/employer/*" element={<EmployerRoutes />} />

        {/* Admin */}
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
