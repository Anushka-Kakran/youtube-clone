import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: "fa-house", label: "Home", path: "/dashboard" },
    { icon: "fa-bolt", label: "Shorts", path: "/shorts" },
    { icon: "fa-layer-group", label: "Subscriptions", path: "/subscriptions" },
    { icon: "fa-clock-rotate-left", label: "History", path: "/history" },
  ];

  return (
    <aside
      className={`
        ${isOpen ? "w-60" : "w-20"}
        transition-all duration-300 h-screen sticky left-0
        overflow-y-auto
        bg-white dark:bg-[#0f0f0f]
        border-r border-gray-200 dark:border-zinc-800
        hidden md:block
      `}
    >
      <div className="py-3 px-2">

        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <div
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`
                flex items-center gap-4 cursor-pointer rounded-xl
                transition-all duration-200
                hover:bg-gray-100 dark:hover:bg-zinc-800
                px-3 py-3 mb-1

                ${isActive ? "bg-gray-200 dark:bg-zinc-800" : ""}
                ${!isOpen ? "justify-center" : ""}
              `}
            >
              <i
                className={`fa-solid ${item.icon} text-lg
                  ${isActive ? "text-red-500" : "text-gray-600 dark:text-gray-300"}
                `}
              ></i>

              {/* LABEL */}
              {isOpen && (
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {item.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;