import axios from "axios";

const baseURL = "http://www.boredapi.com/api/activity";
const dbURL = "http://localhost:5000/activities";

const getInitialActivity = async () => {
  try {
    const response = await axios.get(baseURL);
    return response.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const getRandomActivity = async (type, participants, budget) => {
  if (typeof type !== "string" || type === null || type === "undefined") {
    console.log("Missing parameters");
  }

  try {
    budget = Number(budget);
    const minprice = budget - 0.1 >= 0 ? budget - 0.1 : 0;
    const maxprice = budget + 0.1 >= 1 ? budget + 0.1 : 1;

    const response = await axios.get(
      `${baseURL}?type=${type}&participants=${participants}&minprice=${minprice.toFixed(
        1
      )}&maxprice=${maxprice.toFixed(1)}`
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

const saveActivity = async activityObject => {
  try {
    const response = await axios.post(dbURL, activityObject);
    // const response = await fetch(dbURL, {
    //   method: "POST",
    //   mode: "cors",
    //   cache: "no-cache",
    //   credentials: "same-origin",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify(activityObject)
    // });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

const getSavedActivities = async () => {
  try {
    const response = await axios.get(dbURL);

    return response.data;
  } catch (err) {
    console.log(err);
  }
};

const deleteActivity = async id => {
  try {
    await axios.delete(`${dbURL}/${id}`);
    // return response.data;
  } catch (err) {
    console.log(err);
  }
};

export default {
  getInitialActivity,
  getRandomActivity,
  saveActivity,
  getSavedActivities,
  deleteActivity
};
