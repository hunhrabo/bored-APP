import axios from "axios";

const baseURL = "http://www.boredapi.com/api/activity";

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
    // budget = Number(budget);
    // const minprice = budget - 0.1 >= 0 ? budget - 0.1 : 0;
    // const maxprice = budget + 0.1 >= 1 ? budget + 0.1 : 1;

    // const response = await axios.get(
    //   `${baseURL}?type=${type}&participants=${participants}&minprice=${minprice.toFixed(
    //     1
    //   )}&maxprice=${maxprice.toFixed(1)}`
    // );
    const response = await axios.get(
      `${baseURL}?type=${type}&participants=${participants}&price=${budget}`
    );

    return response.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export default {
  getInitialActivity,
  getRandomActivity
};
