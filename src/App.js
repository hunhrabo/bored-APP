import React, { useState, useEffect } from "react";
import uuidv1 from "uuid";
import ActivityServices from "./Services/activities";

import Header from "./Components/Header";
import Activities from "./Components/Activities";
import MyList from "./Components/MyList";

// this is going to contain our IndexedDB database
let db;

const App = () => {
  const [activity, setActivity] = useState("");
  const [type, setType] = useState("");
  const [participants, setParticipants] = useState(1);
  const [price, setPrice] = useState(0);
  const [tempPrice, setTempPrice] = useState(0);
  const [savedActivities, setSavedActivities] = useState([]);
  const [activeTab, setActiveTab] = useState("activities");

  // fetch initial random activity
  useEffect(() => {
    ActivityServices.getInitialActivity().then(response => {
      console.log(response);
      setActivity(response.activity);
      setType(response.type);
      setParticipants(response.participants);
      setPrice(response.price);
      setTempPrice(response.price);
    });
  }, []);

  // create/open browser database
  useEffect(() => {
    let request = window.indexedDB.open("activities_db", 1);

    request.onerror = () => {
      console.log("Database failed to open");
    };

    request.onsuccess = () => {
      db = request.result;

      let transaction = db.transaction("savedactivities");

      let objectStore = transaction.objectStore("savedactivities");

      let activitiesInDatabase = [];

      objectStore.openCursor().onsuccess = e => {
        const cursor = e.target.result;

        if (cursor) {
          activitiesInDatabase.push(cursor.value);

          cursor.continue();
        } else {
          setSavedActivities(activitiesInDatabase);
        }
      };
    };

    // if database doesn't exist
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
    };
  }, []);

  // form handlers
  const handleTypeChange = e => {
    setType(e.target.value);
  };

  const handleParticipantsChange = e => {
    setParticipants(e.target.value);
  };

  const handlePriceChange = e => {
    setPrice(Number(e.target.value) / 100);
  };

  const handleTempPriceChange = e => {
    setTempPrice(Number(e.target.value) / 100);
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log(type, participants, price);

    ActivityServices.getRandomActivity(type, participants, price).then(
      response => {
        if (response.error) {
          setActivity(
            "No activity found with these parameters. Try changing some of the parameters on the right panel."
          );
        } else {
          setActivity(response.activity);
        }
      }
    );
  };

  const handleSave = () => {
    const getBudget = () => {
      switch (true) {
        case price <= 0.3:
          return "cheap";
        case price > 0.3 && price <= 0.7:
          return "mid-range";
        case price > 0.7:
          return "expensive";
        default:
          return "cheap";
      }
    };

    const budget = getBudget();
    const newId = uuidv1();

    const newActivity = {
      activity,
      participants,
      budget,
      id: newId
    };
    console.log(newActivity);

    const existingActivity = savedActivities.find(
      activity =>
        activity.activity === newActivity.activity &&
        activity.participants === newActivity.participants &&
        activity.budget === newActivity.budget
    );

    // save new object in browser database
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
    }
  };

  // database handlers
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

  const handleTabSwitch = id => {
    setActiveTab(id);
  };

  return (
    <div className="App">
      <div className="app-content">
        <Header activeTab={activeTab} handleTabSwitch={handleTabSwitch} />
        <Activities
          activeTab={activeTab}
          activity={activity}
          setActivity={setActivity}
          type={type}
          handleTypeChange={handleTypeChange}
          participants={participants}
          handleParticipantsChange={handleParticipantsChange}
          price={price}
          handlePriceChange={handlePriceChange}
          tempPrice={tempPrice}
          handleTempPriceChange={handleTempPriceChange}
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
