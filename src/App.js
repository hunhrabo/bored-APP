import React, { useState, useEffect } from "react";
import uuidv1 from "uuid";
import ActivityServices from "./Services/activities";

import Header from "./Components/Header";
import Activities from "./Components/Activities";
import MyList from "./Components/MyList";

let db;

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
    let request = window.indexedDB.open("activities_db", 1);

    request.onerror = () => {
      console.log("Database failed to open");
    };

    request.onsuccess = () => {
      console.log("Database opened successfully");

      db = request.result;
      console.log(db);
      let transaction = db.transaction("savedactivities");

      let objectStore = transaction.objectStore("savedactivities");
      console.log(objectStore);

      let activitiesInDatabase = [];

      objectStore.openCursor().onsuccess = e => {
        const cursor = e.target.result;
        console.log(cursor);

        if (cursor) {
          activitiesInDatabase.push(cursor.value);

          cursor.continue();
        } else {
          console.log(activitiesInDatabase);
          setSavedActivities(activitiesInDatabase);
        }
      };
    };

    request.onupgradeneeded = e => {
      let db = e.target.result;
      console.log(e.target.result);

      let objectStore = db.createObjectStore("savedactivities", {
        keyPath: "id",
        autoIncrement: true
      });

      objectStore.createIndex("activity", "activity", { unique: true });
      objectStore.createIndex("type", "type", { unique: false });
      objectStore.createIndex("participants", "participants", {
        unique: false
      });
      objectStore.createIndex("price", "price", { unique: false });

      console.log("database setup complete");
      console.log(objectStore);
    };

    // ActivityServices.getSavedActivities().then(response =>
    //   setSavedActivities(response)
    // );
  }, []);

  const handleSubmit = (e, type, participants, price) => {
    e.preventDefault();
    console.log(e, type, participants, price);

    ActivityServices.getRandomActivity(type, participants, price).then(
      response => {
        console.log(response);

        if (response.error) {
          setCurrentActivity({
            activity:
              "No activities with these parameters. Try changing some of the parameters on the right panel."
          });
        } else {
          setCurrentActivity(response);
        }
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
      console.log(db);
      let transaction = db.transaction(["savedactivities"], "readwrite");

      let objectStore = transaction.objectStore("savedactivities");

      let request = objectStore.add(newActivity);

      request.onsuccess = () => {
        console.log("successfully sent request");
      };

      transaction.onerror = () => {
        console.log("transaction could not be made");
      };

      transaction.oncomplete = () => {
        console.log("transaction completed");
        setSavedActivities(savedActivities.concat(newActivity));
      };

      // let request = window.indexedDB.open('activities_db', 1);

      // request.onerror = () => {
      //   console.log('Database failed to open')
      // }

      // request.onsuccess = () => {
      //   console.log('Database opened successfully');
      // }

      // ActivityServices.saveActivity(newActivity).then(savedActivity =>
      //   setSavedActivities(savedActivities.concat(savedActivity))
      // );
      // console.log("saved");
    }
  };

  const deleteActivity = id => {
    let transaction = db.transaction(["savedactivities"], "readwrite");
    let objectStore = transaction.objectStore("savedactivities");
    objectStore.delete(id);

    transaction.oncomplete = () => {
      setSavedActivities(
        savedActivities.filter(activity => activity.id !== id)
      );
    };
  };

  const clearList = () => {
    savedActivities.forEach(activity => {
      let transaction = db.transaction(["savedactivities"], "readwrite");
      let objectStore = transaction.objectStore("savedactivities");
      objectStore.delete(activity.id);
    });

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
