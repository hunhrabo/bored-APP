import React, { useState, useEffect } from "react";
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

const Activities = () => {
  const [activity, setActivity] = useState({});

  const [activityType, setActivityType] = useState(activity.activity || "");
  const [participants, setParticipants] = useState(activity.participants || 1);
  const [price, setPrice] = useState(activity.price || 0);

  useEffect(() => {
    ActivityServices.getInitialActivity()
      .then(response => response.json())
      .then(response => {
        console.log(response);
        setActivity(response);
        setActivityType(response.type);
        setParticipants(response.participants);
        setPrice(response.price);
      });
  }, []);

  const capitalizeType = type => {
    if (typeof type !== "string") {
      return "";
    }

    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const handleSubmit = e => {
    e.preventDefault();

    console.log(e.target.value);
    console.log(e.target.name);

    ActivityServices.getRandomActivity(activityType, participants, price)
      .then(response => response.json())
      .then(response => {
        console.log(response);
        setActivity(response);
      });
  };

  return (
    <div>
      <div className="tab activities-tab">Activities</div>
      <div>
        <p>You should:</p>
        <div>{activity.activity}</div>
        <button>Save for later</button>
      </div>
      <div>
        <p>Activity details:</p>
        <form>
          <label>
            Type
            <select
              name="type"
              value={activityType}
              onChange={e => {
                setActivityType(e.target.value);
                handleSubmit(e);
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
                handleSubmit(e);
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
                setPrice(value);
                handleSubmit(e);
              }}
            />
            <span>cheap</span>
            <span>expensive</span>
          </label>
          <button type="submit">Hit me with a new one!</button>
        </form>
      </div>
    </div>
  );
};

export default Activities;
