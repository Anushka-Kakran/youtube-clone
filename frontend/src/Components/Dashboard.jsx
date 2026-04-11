import React, { useState } from "react";
import DashboardVideos from "./Video/DashBoardVideos";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="w-full">
      <DashboardVideos searchQuery={searchQuery} />
    </div>
  );
}