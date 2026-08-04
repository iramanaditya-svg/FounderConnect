import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import SelectRole from "./pages/SelectRole";
import CompleteProfile from "./pages/CompleteProfile";

import DashboardLayout from "./components/dashboard/DashboardLayout";

import Home from "./components/home/Home";
import MyStartups from "./pages/dashboard/startup_builder/MyStartups";
import StartupDetails from "./pages/dashboard/StartupDetails";
import ManageStartup from "./pages/dashboard/ManageStartup";
import MyJobs from "./pages/dashboard/startup_builder/MyJobs";
import ManageJobs from "./pages/dashboard/startup_builder/ManageJobs";

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


<Route path="/professional/dashboard" element={<DashboardLayout />}>
    <Route index element={<Home />} />
    <Route
        path="startups/:startupId"
        element={<StartupDetails />}
    />
</Route>


<Route path="/startup_builder/dashboard" element={<DashboardLayout />}>
    <Route index element={<Home />} />

    <Route path="my-startups" element={<MyStartups />} />

    <Route
        path="my-startups/:startupId"
        element={<ManageStartup />}
    />

    <Route
        path="my-jobs"
        element={<MyJobs />}
    />

    <Route
        path="my-jobs/:startupId"
        element={<ManageJobs />}
    />
</Route>


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