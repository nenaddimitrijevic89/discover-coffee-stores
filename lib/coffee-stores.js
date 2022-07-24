import { createApi } from "unsplash-js";

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
});

export const getUrlForCoffeeStores = (latLong, query, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
};

const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplash.search.getPhotos({
    query: "coffee shop",
    page: 1,
    perPage: 30,
  });
  const unsplashResults = photos.response.results;

  return unsplashResults.map((result) => result.urls["small"]);
};

export const fetchStores = async () => {
  const photos = await getListOfCoffeeStorePhotos();

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

    return data.results.map((result, i) => {
      const neighborhood = result.location.neighborhood;

      return {
        id: result.fsq_id,
        name: result.name,
        address: result.location.address,
        neighborhood: neighborhood?.length > 0 ? neighborhood[0] : "",
        imgUrl: photos?.length ? photos[i] : null,
      };
    });
  } catch (err) {
    console.error(err);
  }
};
