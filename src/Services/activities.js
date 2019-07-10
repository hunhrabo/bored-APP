const baseURL = "http://www.boredapi.com/api/activity";

const getInitialActivity = async () => {
  try {
    const result = await fetch(baseURL);
    return result;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const getRandomActivity = async (type, participants, budget) => {
  if (typeof type !== "string" || type === null || type === "undefined") {
    console.log("Missing parameters");
    // try {
    //   const result = await fetch(baseURL);
    //   return result;
    // } catch (err) {
    //   console.log(err);
    //   return null;
    // }
  }

  try {
    const minprice = budget - 0.2 >= 0 ? budget - 0.2 : 0;
    const maxprice = budget + 0.2 >= 1 ? budget + 0.2 : 1;

    const result = await fetch(
      `${baseURL}?type=${type}&participants=${participants}&minprice=${minprice.toFixed(
        1
      )}&maxprice=${maxprice.toFixed(1)}`
    );
    return result;
  } catch (err) {
    console.log(err);
  }
};

export default { getInitialActivity, getRandomActivity };
