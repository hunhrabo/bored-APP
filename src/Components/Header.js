import React from "react";
import HeaderTab from "./HeaderTab";

const Header = ({ activeTab, handleTabSwitch }) => {
  return (
    <header className="tab-headers">
      <HeaderTab
        id="activities"
        activeTab={activeTab}
        handleTabSwitch={handleTabSwitch}
      />
      <HeaderTab
        id="my-list"
        activeTab={activeTab}
        handleTabSwitch={handleTabSwitch}
      />
    </header>
  );
};

export default Header;
