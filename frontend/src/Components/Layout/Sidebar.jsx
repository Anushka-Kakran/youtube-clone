import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: "fa-house", label: "Home", path: "/" },
    { icon: "fa-bolt", label: "Shorts", path: "/shorts" },
    { icon: "fa-layer-group", label: "Subscriptions", path: "/subscriptions" },
    { icon: "fa-clock-rotate-left", label: "History", path: "/history" },
  ];

  return (
    <aside
      className={`
        ${isOpen ? "w-60 px-3" : "w-20 px-1"} 
        transition-all duration-300 h-[calc(100vh-56px)] sticky top-[56px]
        overflow-y-auto bg-white dark:bg-[#0f0f0f]
        hidden md:block flex-shrink-0 border-r border-transparent dark:border-zinc-800
      `}
    >
      <div className="py-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <div
              key={item.label}
              onClick={() => navigate(item.path)}
              title={!isOpen ? item.label : ""} // Shows tooltip when collapsed
              className={`
                flex items-center cursor-pointer rounded-xl transition-all duration-200
                hover:bg-gray-100 dark:hover:bg-zinc-800 mb-1
                ${
                  isOpen
                    ? "flex-row px-3 py-3 gap-6" // Expanded: Row layout
                    : "flex-col px-0 py-4 gap-1 justify-center" // Collapsed: Column layout
                }
                ${isActive ? "bg-gray-100 dark:bg-zinc-800 font-bold" : ""}
              `}
            >
              <i
                className={`fa-solid ${item.icon} text-xl
                  ${isActive ? "text-red-600" : "text-gray-700 dark:text-gray-200"}
                `}
              ></i>

              {/* Only show label if isOpen is true, or show a tiny label if preferred */}
              {isOpen ? (
                <span className="text-sm text-gray-800 dark:text-gray-200 truncate">
                  {item.label}
                </span>
              ) : (
                <span className="text-[10px] text-gray-800 dark:text-gray-200 scale-90">
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
