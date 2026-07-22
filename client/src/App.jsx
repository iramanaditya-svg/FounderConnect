import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";




function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Register />} />
      {/* <Route path="/select-role" element={<RoleSelection />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />
      <Route path="/dashboard" element={<Dashboard />} /> */}
    </Routes>
  );
}

export default App;