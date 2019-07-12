import React, { useState, useEffect } from "react";
import uuidv1 from "uuid";
import ActivityServices from "./Services/activities";

import Header from "./Components/Header";
import Activities from "./Components/Activities";
import MyList from "./Components/MyList";

const App = () => {
  const [currentActivity, setCurrentActivity] = useState({});
  const [savedActivities, setSavedActivities] = useState([]);
  const [activeTab, setActiveTab] = useState("activities");

  useEffect(() => {
    ActivityServices.getInitialActivity().then(response => {
      console.log(response);
      setCurrentActivity(response);
    });
  }, []);

  useEffect(() => {
    ActivityServices.getSavedActivities().then(response =>
      setSavedActivities(response)
    );
  }, []);

  const handleSubmit = (e, type, participants, price) => {
    e.preventDefault();

    ActivityServices.getRandomActivity(type, participants, price).then(
      response => {
        console.log(response);
        setCurrentActivity(response);
      }
    );
  };

  const handleSave = () => {
    console.log("pushed save button");
    const getBudget = () => {
      switch (true) {
        case currentActivity.price <= 0.3:
          return "cheap";
        case currentActivity.price > 0.3 && currentActivity.price <= 0.7:
          return "mid-range";
        case currentActivity.price > 0.7:
          return "expensive";
        default:
          return "cheap";
      }
    };

    const budget = getBudget();
    const newId = uuidv1();

    const newActivity = {
      activity: currentActivity.activity,
      participants: currentActivity.participants,
      budget: budget,
      id: newId
    };
    console.log(newActivity);

    const existingActivity = savedActivities.find(
      activity =>
        activity.activity === newActivity.activity &&
        activity.participants === newActivity.participants &&
        activity.budget === newActivity.budget
    );

    if (!existingActivity) {
      ActivityServices.saveActivity(newActivity).then(savedActivity =>
        setSavedActivities(savedActivities.concat(savedActivity))
      );
      console.log("saved");
    }
  };

  const deleteActivity = id => {
    console.log(id);
    ActivityServices.deleteActivity(id).then(() => {
      setSavedActivities(
        savedActivities.filter(activity => activity.id !== id)
      );
    });
  };

  const clearList = () => {
    savedActivities.forEach(activity =>
      ActivityServices.deleteActivity(activity.id)
    );

    setSavedActivities([]);
  };

  const handleTabSwitch = value => {
    setActiveTab(value);
  };

  return (
    <div className="App">
      <div className="app-content">
        <Header handleTabSwitch={handleTabSwitch} />
        <Activities
          activeTab={activeTab}
          activity={currentActivity}
          handleSave={handleSave}
          handleSubmit={handleSubmit}
        />
        <MyList
          activeTab={activeTab}
          savedActivities={savedActivities}
          deleteActivity={deleteActivity}
          clearList={clearList}
        />
      </div>
    </div>
  );
};

export default App;
