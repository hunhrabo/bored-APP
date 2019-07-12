import React, { useState } from "react";
// import ActivityServices from "../Services/activities";

const activityTypes = [
  "education",
  "recreational",
  "social",
  "diy",
  "charity",
  "cooking",
  "relaxation",
  "music",
  "busywork"
];

const Activities = ({ activeTab, activity, handleSave, handleSubmit }) => {
  // const [currentActivity, setCurrentActivity] = useState({});

  const [activityType, setActivityType] = useState(activity.activity || "");
  const [participants, setParticipants] = useState(activity.participants || 1);
  const [price, setPrice] = useState(activity.price || 0);

  const capitalizeType = type => {
    if (typeof type !== "string") {
      return "";
    }

    if (type === "diy") {
      return "DIY";
    }

    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const isActive = activeTab === "activities" ? "open" : "closed";

  return (
    <div className={`tab-container activities-container ${isActive}`}>
      <div className="content-wrap">
        <div>
          <p>You should:</p>
          <div>{activity.activity}</div>
          <button onClick={handleSave}>Save for later</button>
        </div>
        <div>
          <p>Activity details:</p>
          <form
            onSubmit={e => handleSubmit(e, activityType, participants, price)}
          >
            <label>
              Type
              <select
                name="type"
                value={activity.type}
                onChange={e => {
                  setActivityType(e.target.value);
                  handleSubmit(e, activityType, participants, price);
                }}
              >
                {activityTypes.map(type => (
                  <option key={type} value={type}>
                    {capitalizeType(type)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Participants
              <input
                name="participants"
                type="number"
                value={participants}
                onChange={e => {
                  setParticipants(e.target.value);
                  handleSubmit(e, activityType, participants, price);
                }}
              />
            </label>
            <label>
              <input
                name="price"
                type="range"
                min="0"
                max="100"
                value={(price * 100).toString()}
                onChange={e => {
                  const value = Number(e.target.value) / 100;
                  console.log(value);
                  setPrice(value);
                  handleSubmit(e, activityType, participants, price);
                }}
              />
              <span>cheap</span>
              <span>expensive</span>
            </label>
            <button type="submit">Hit me with a new one!</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Activities;
