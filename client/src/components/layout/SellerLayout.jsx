import { Outlet } from "react-router-dom";
import { useState } from "react";

import SellerNavbar from "./SellerNavbar";
import SellerSidebar from "./SellerSidebar";

const SellerLayout = () => {

    const [open, setOpen] = useState(false);

    return (
        <div className="flex h-screen bg-slate-100 overflow-hidden">

            {/* Desktop Sidebar */}

            <aside className="hidden lg:flex w-64 bg-slate-900 text-white border-r border-slate-800">
                <SellerSidebar />
            </aside>

            {/* Mobile Sidebar */}

            {open && (
                <div className="fixed inset-0 z-50 lg:hidden">

                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setOpen(false)}
                    />

                    <aside className="absolute left-0 top-0 h-full w-64 bg-slate-900 text-white shadow-xl">
                        <SellerSidebar />
                    </aside>

                </div>
            )}

            {/* Content */}

            <div className="flex flex-1 flex-col overflow-hidden">

                <SellerNavbar setOpen={setOpen} />

                <main className="flex-1 overflow-y-auto bg-slate-100 p-6">
                    <Outlet />
                </main>

            </div>

        </div>
    );
};

export default SellerLayout;