import React from "react";

const HeaderTab = ({ id, activeTab, handleTabSwitch }) => {
  const title = id === "activities" ? "Activities" : "My List";
  const isActive = activeTab === id ? true : false;

  return (
    <div
      id={id}
      className={`tab-header ${id}-tab-header ${
        isActive ? "active" : "inactive"
      }`}
      onClick={() => handleTabSwitch(id)}
    >
      {title}
    </div>
  );
};

export default HeaderTab;
