import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import SelectRole from "./pages/SelectRole";
import CompleteProfile from "./pages/CompleteProfile";

import DashboardLayout from "./components/dashboard/DashboardLayout";

import Home from "./components/home/Home";

function App() {
    return (
        <Routes>

            <Route
                path="/"
                element={<Register />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/select-role"
                element={<SelectRole />}
            />

            <Route
                path="/:role/complete-profile"
                element={<CompleteProfile />}
            />

            <Route
                path="/professional/dashboard"
                element={<DashboardLayout />}
            >

                {/* 👇 ISKO COMMENT MAT RAKHNA */}

                <Route
                    index
                    element={<Home />}
                />

            </Route>

        </Routes>
    );
}

export default App;