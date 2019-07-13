import React from "react";

const Header = ({ handleTabSwitch }) => {
  return (
    <header className="tab-headers">
      <div
        className="tab-header activities-tab-header"
        onClick={() => handleTabSwitch("activities")}
      >
        Activities
      </div>
      <div
        className="tab-header my-list-tab-header"
        onClick={() => handleTabSwitch("my-list")}
      >
        My list
      </div>
    </header>
  );
};

export default Header;
