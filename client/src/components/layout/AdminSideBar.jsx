import {
    LayoutDashboard,
    Users,
    Store,
    Package,
    ShoppingCart,
    FolderTree,
    Star,
    Settings
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menus = [
    {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: "/admin/dashboard"
    },
    {
        name: "Users",
        icon: Users,
        path: "/admin/users"
    },
    {
        name: "Sellers",
        icon: Store,
        path: "/admin/sellers"
    },
    {
        name: "Products",
        icon: Package,
        path: "/admin/products"
    },
    {
        name: "Orders",
        icon: ShoppingCart,
        path: "/admin/orders"
    },
    {
        name: "Categories",
        icon: FolderTree,
        path: "/admin/category"
    },
    // {
    //     name: "Reviews",
    //     icon: Star,
    //     path: "/admin/reviews"
    // },
    // {
    //     name: "Settings",
    //     icon: Settings,
    //     path: "/admin/settings"
    // }
];

const AdminSidebar = () => {

    return (

        <div className="h-full flex flex-col">
            <div className="h-16 flex items-center justify-center border-b border-slate-700">
                <h2 className="text-2xl font-bold">
                    Admin
                </h2>

            </div>

            <nav className="flex-1 p-3 space-y-2">
                {menus.map((menu) => {
                    const Icon = menu.icon;

                    return (

                        <NavLink
                            key={menu.path}
                            to={menu.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-slate-800"
                                }`
                            }
                        >
                            <Icon size={20} />
                            {menu.name}
                        </NavLink>
                    );
                })}

            </nav>

        </div>

    );
};

export default AdminSidebar;