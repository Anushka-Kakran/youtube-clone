import { useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen }) => {

  const navigate = useNavigate();

  const menuItems = [
    { icon: "fa-house", label: "Home", path: "/dashboard" },
    { icon: "fa-bolt", label: "Shorts", path: "/shorts" },
    { icon: "fa-layer-group", label: "Subscriptions", path: "/subscriptions" },
    { icon: "fa-clock-rotate-left", label: "History", path: "/history" },
  ];

  return (
    <aside className={`
      ${isOpen ? "w-64" : "w-20"} 
      transition-all duration-300 h-screen sticky left-0 overflow-y-auto 
      bg-yt-bg dark:bg-yt-darkBg  border-r border-yt-border dark:border-yt-darkBorder 
      hidden md:block 
    `}>
      <div className="p-2">
        {menuItems.map((item) => (
          <div
            key={item.label}
            onClick={() => navigate(item.path)}   // ✅ navigation here
            className="flex flex-col lg:flex-row items-center gap-4 p-3 hover:bg-yt-secondary dark:hover:bg-yt-darkSecondary rounded-lg cursor-pointer dark:text-yt-darkText"
          >
            <i className={`fa-solid ${item.icon} text-lg`}></i>
            {isOpen && <span className="text-sm font-medium">{item.label}</span>}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;