import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import { Outlet } from "react-router-dom";

function DashboardLayout() {
    return (
        <div className="flex h-screen bg-[#030712]">

            <Sidebar />

            <div className="flex flex-1 flex-col overflow-hidden">

                <Topbar />

                <main className="flex-1 overflow-y-auto p-8">

                    <Outlet />

                </main>

            </div>

        </div>
    );
}

export default DashboardLayout;