import React, { useState, useEffect } from "react";
import uuidv1 from "uuid";
import ActivityServices from "./Services/activities";

import Header from "./Components/Header";
import Activities from "./Components/Activities";
import MyList from "./Components/MyList";

// this is going to contain our IndexedDB database
let db;

const App = () => {
  const [activity, setActivity] = useState({});
  const [formData, setFormData] = useState({});
  const [oldData, setOldData] = useState({});
  const [tempPrice, setTempPrice] = useState(0);
  const [savedActivities, setSavedActivities] = useState([]);
  const [activeTab, setActiveTab] = useState("activities");
  const [notification, setNotification] = useState("");

  // fetch initial random activity
  useEffect(() => {
    ActivityServices.getInitialActivity().then(response => {
      setActivity(response);
      setFormData({
        type: response.type,
        participants: response.participants,
        price: response.price
      });
      setOldData({
        type: response.type,
        participants: response.participants,
        price: response.price
      });
      setTempPrice(response.price);
    });
  }, []);

  // if the user changed the value of any of the parameters, fetch new activity automatically
  useEffect(() => {
    let dataChanged = hasDataChanged();

    if (dataChanged) {
      ActivityServices.getRandomActivity(
        formData.type,
        formData.participants,
        formData.price
      ).then(response => {
        if (response.error) {
          setOldData(formData);
          setActivity({
            error:
              "No activity found with these parameters. Try changing some of the parameters on the right panel."
          });
        } else {
          setOldData(formData);
          setActivity(response);
        }
      });
    }
  });

  const hasDataChanged = () => {
    if (
      formData.type !== oldData.type ||
      formData.participants !== oldData.participants ||
      formData.price !== oldData.price
    ) {
      return true;
    }
    return false;
  };

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
    setFormData({
      ...formData,
      type: e.target.value
    });
  };

  const handleParticipantsChange = e => {
    setFormData({
      ...formData,
      participants: e.target.value
    });
  };

  const handlePriceChange = e => {
    setFormData({
      ...formData,
      price: Number(e.target.value) / 100
    });
  };

  const handleTempPriceChange = e => {
    setTempPrice(Number(e.target.value) / 100);
  };

  const handleSubmit = e => {
    e.preventDefault();

    ActivityServices.getRandomActivity(
      formData.type,
      formData.participants,
      formData.price
    ).then(response => {
      if (response.error) {
        setOldData(formData);
        setActivity({
          error:
            "No activity found with these parameters. Try changing some of the parameters on the right panel."
        });
      } else {
        setOldData(formData);
        setActivity(response);
      }
    });
  };

  // database handlers

  // save current activity to IndexedDB database
  const handleSave = () => {
    if (activity.activity) {
      const getBudget = () => {
        switch (true) {
          case formData.price <= 0.3:
            return "cheap";
          case formData.price > 0.3 && formData.price <= 0.7:
            return "mid-range";
          case formData.price > 0.7:
            return "expensive";
          default:
            return "cheap";
        }
      };

      const budget = getBudget();
      const newId = uuidv1();

      const newActivity = {
        activity: activity.activity,
        participants: formData.participants,
        budget,
        id: newId
      };

      const existingActivity = savedActivities.find(
        activity =>
          activity.activity === newActivity.activity &&
          activity.participants === newActivity.participants &&
          activity.budget === newActivity.budget
      );

      // save only new activitites in browser database
      if (!existingActivity) {
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
          setNotification("Activity saved");
          setTimeout(() => {
            setNotification("");
          }, 1500);
        };
      }
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

  const handleTabSwitch = id => {
    setActiveTab(id);
  };

  if (!formData.type) {
    return (
      <div className="loading-img-container">
        <p className="loading-img">Loading...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="app-content">
        <Header activeTab={activeTab} handleTabSwitch={handleTabSwitch} />
        <Activities
          activeTab={activeTab}
          activity={activity}
          type={formData.type}
          handleTypeChange={handleTypeChange}
          participants={formData.participants}
          handleParticipantsChange={handleParticipantsChange}
          handlePriceChange={handlePriceChange}
          tempPrice={tempPrice}
          handleTempPriceChange={handleTempPriceChange}
          handleSave={handleSave}
          handleSubmit={handleSubmit}
          notification={notification}
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
