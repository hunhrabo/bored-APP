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

  const [activityType, setActivityType] = useState(
    activity.activity || "social"
  );
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

  // const errorMessage =
  //   "No activities with these parameters. Try changing some of the parameters on the right panel.";

  // const activityToDisplay = activity.activity
  //   ? activity.activity
  //   : errorMessage;

  const isActive = activeTab === "activities" ? "open" : "closed";

  return (
    <div className={`tab-container activities-container ${isActive}`}>
      <div className="content-wrap activity-container flex-container">
        <div className="activity-title flex-item flex-left">
          <div className="details-container-left flex-container">
            <p>You should:</p>

            <div className="activity-content">{activity.activity}</div>
            <button className="save-btn" onClick={handleSave}>
              Save for later
            </button>
          </div>
        </div>
        <div className="activity-details flex-item flex-right">
          <form
            className="details-form details-container-right flex-container"
            onSubmit={e => handleSubmit(e, activityType, participants, price)}
          >
            <p>Activity details:</p>
            <label htmlFor="type">Type</label>
            <select
              className="select-type"
              name="type"
              value={activity.type}
              onChange={e => {
                setActivityType(e.target.value);
                handleSubmit(e, e.target.value, participants, price);
              }}
            >
              {activityTypes.map(type => (
                <option key={type} value={type}>
                  {capitalizeType(type)}
                </option>
              ))}
            </select>
            <label htmlFor="participants">Participants</label>
            <input
              className="input-participants"
              name="participants"
              type="number"
              value={participants}
              onChange={e => {
                console.log(e);
                setParticipants(e.target.value);
                handleSubmit(e, activityType, e.target.value, price);
              }}
            />
            <label htmlFor="price">Budget</label>
            <input
              className="slider"
              name="price"
              type="range"
              min="0"
              max="100"
              value={(price * 100).toString()}
              onMouseUp={e => {
                handleSubmit(e, activityType, participants, e.target.value);
              }}
              onChange={e => {
                const value = Number(e.target.value) / 100;
                setPrice(value);
              }}
            />
            <p className="budget-lower-labels">
              <span>cheap</span>
              <span>expensive</span>
            </p>

            <button className="submit-btn" type="submit">
              Hit me with a new one!
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Activities;
