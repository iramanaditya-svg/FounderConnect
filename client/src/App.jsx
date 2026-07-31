import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import SelectRole from "./pages/SelectRole";
import CompleteProfile from "./pages/CompleteProfile";

import DashboardLayout from "./components/dashboard/DashboardLayout";

import Home from "./components/home/Home";
import MyStartups from "./pages/dashboard/startup_builder/MyStartups";

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

            {/* Professional Dashboard */}
            <Route
                path="/professional/dashboard"
                element={<DashboardLayout />}
            >
                <Route
                    index
                    element={<Home />}
                />
            </Route>

            {/* Startup Builder Dashboard */}
            <Route
                path="/startup_builder/dashboard"
                element={<DashboardLayout />}
            >
                <Route
                    index
                    element={<Home />}
                />

                <Route
                    path="my-startups"
                    element={<MyStartups />}
                />
            </Route>

            {/* Investor Dashboard */}
            <Route
                path="/investor/dashboard"
                element={<DashboardLayout />}
            >
                <Route
                    index
                    element={<Home />}
                />
            </Route>

        </Routes>
    );
}

export default App;