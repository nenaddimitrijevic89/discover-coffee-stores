export const getUrlForCoffeeStores = (latLong, query, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
};

export const fetchStores = async () => {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: process.env.FOURSQUARE_API_KEY,
    },
  };
  try {
    const response = await fetch(
      getUrlForCoffeeStores("44.8016793%2C20.4546948", "coffee", "6"),
      options
    );
    const data = await response.json();
    return data.results;
  } catch (err) {
    console.error(err);
  }
};
