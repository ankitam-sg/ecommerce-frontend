import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col">

            {/* Navbar → fixed height */}
            <Navbar />

            {/* Main content → takes remaining space */}
            <main className="flex-1 flex w-full">
                <Outlet />
            </main>

        </div>
    );
};

export default Layout;
