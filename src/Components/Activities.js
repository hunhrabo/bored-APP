import React, { useEffect } from "react";
import ActivityServices from "../Services/activities";

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

const Activities = ({
  activeTab,
  activity,
  setActivity,
  type,
  handleTypeChange,
  participants,
  handleParticipantsChange,
  price,
  handlePriceChange,
  tempPrice,
  handleTempPriceChange,
  handleSave,
  handleSubmit
}) => {
  useEffect(() => {
    ActivityServices.getRandomActivity(type, participants, price).then(
      response => {
        if (response.error) {
          setActivity(
            "No activities found with these parameters. Try changing some of the parameters on the right panel."
          );
        } else {
          setActivity(response.activity);
        }
      }
    );
  }, [setActivity, type, participants, price]);

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

  if (!activity) {
    return null;
  }

  return (
    <div className={`tab-container activities-container ${isActive}`}>
      <div className="content-wrap activity-container flex-container">
        <div className="activity-title flex-item flex-left">
          <div className="details-container-left flex-container">
            <p>You should:</p>

            <div className="activity-content">{activity}</div>
            <button className="save-btn" onClick={handleSave}>
              Save for later
            </button>
          </div>
        </div>
        <div className="activity-details flex-item flex-right">
          <form
            className="details-form details-container-right flex-container"
            onSubmit={handleSubmit}
          >
            <p>Activity details:</p>
            <label htmlFor="type">Type</label>
            <select
              className="select-type"
              name="type"
              value={type}
              onChange={handleTypeChange}
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
              onChange={handleParticipantsChange}
            />
            <label htmlFor="price">Budget</label>
            <input
              className="slider"
              name="price"
              type="range"
              min="0"
              max="100"
              value={(tempPrice * 100).toString()}
              onChange={handleTempPriceChange}
              onMouseUp={handlePriceChange}
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
