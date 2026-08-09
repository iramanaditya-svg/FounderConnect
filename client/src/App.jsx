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
import EditProfile from "./pages/dashboard/EditProfile";
import AppliedJobs from "./pages/professional/AppliedJobs";
import StartupBuilderForm from "./components/completeProfile/StartupBuilderForm";
import Applicants from "./pages/dashboard/startup_builder/Applicants";
import ApplicantDetails from "./pages/dashboard/startup_builder/ApplicantDetails";
import JobApplicants from "./pages/dashboard/startup_builder/JobApplicants";
import ActiveApplications from "./pages/professional/ActiveApplications";
import ActiveInvestments from "./pages/dashboard/investor/ActiveInvestments";
import InvestedCompanies from "./pages/dashboard/investor/InvestedCompanies";
import InvestorStartups from "./pages/dashboard/investor/InvestorStartups";
import InvestorStartupDetails from "./pages/dashboard/investor/InvestorStartupDetails";
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
    <Route index element={<Home />} />

    <Route
        path="startups/:startupId"
        element={<StartupDetails />}
    />

    <Route
        path="edit-profile"
        element={<EditProfile />}
    />

    <Route
        path="applied-jobs"
        element={<AppliedJobs />}
    />

    <Route
        path="active-applications"
        element={<ActiveApplications />}
    />
</Route>


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

<Route
    path="applicants"
    element={<Applicants />}
/>
<Route
    path="my-jobs/:jobId/applicants"
    element={<JobApplicants />}
/>
<Route
    path="applicants/:applicationId"
    element={<ApplicantDetails />}
/>

    <Route
        path="edit-profile"
        element={<StartupBuilderForm mode="edit" />}
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
    <Route
    path="active-investments"
    element={<ActiveInvestments />}
/>
<Route
    path="invested-companies"
    element={<InvestedCompanies />}
/>
<Route
    path="startups"
    element={<InvestorStartups />}
/>
<Route
    path="startups/:startupId"
    element={<InvestorStartupDetails />}
/>
</Route>
        </Routes>
    );
}

export default App;