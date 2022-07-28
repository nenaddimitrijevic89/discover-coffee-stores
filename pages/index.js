import { useContext, useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";

import styles from "../styles/Home.module.css";

import { fetchStores } from "../lib/coffee-stores";
import useTrackLocation from "../hooks/use-track-location";
import Banner from "../components/Banner/Banner";
import Card from "../components/Card/Card";

import { ACTION_TYPES, StoreContext } from "./_app";

const imgPlaceholder =
  "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80";

export default function Home(props) {
  const { locationErrorMsg, handleTrackLocation, isFindingLocation } =
    useTrackLocation();

  const [coffeeStoresError, setCoffeeStoresError] = useState(null);

  const { dispatch, state } = useContext(StoreContext);

  const { coffeeStores, latLong } = state;

  useEffect(() => {
    async function setCoffeeStoresByLocation() {
      if (latLong) {
        try {
          const fetchedCoffeeStores = await fetchStores(latLong, 30);

          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: {
              coffeeStores: fetchedCoffeeStores,
            },
          });
        } catch (error) {
          //set error
          setCoffeeStoresError(error.message);
        }
      }
    }
    setCoffeeStoresByLocation();
  }, [latLong]);

  const handleOnBannerBtnClick = () => {
    handleTrackLocation();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee stores</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? "Locating..." : "View stores nearby"}
          handleOnClick={handleOnBannerBtnClick}
        />
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        {coffeeStoresError && <p>Something went wrong: {coffeeStoresError}</p>}
        <div className={styles.heroImage}>
          <Image
            src="/static/hero-image.png"
            width={700}
            height={400}
            alt="hero"
          />
        </div>
        <div className={styles.sectionWrapper}>
          {coffeeStores.length > 0 && (
            <>
              <h2 className={styles.heading2}>Stores near me</h2>
              <div className={styles.cardLayout}>
                {coffeeStores.map((store) => (
                  <Card
                    key={store.id}
                    name={store.name}
                    imgUrl={store.imgUrl || imgPlaceholder}
                    href={`/coffee-store/${store.id}`}
                  />
                ))}
              </div>
            </>
          )}
          {props.coffeeStores.length > 0 && (
            <>
              <h2 className={styles.heading2}>Toronto stores</h2>
              <div className={styles.cardLayout}>
                {props.coffeeStores.map((store) => (
                  <Card
                    key={store.id}
                    name={store.name}
                    imgUrl={store.imgUrl || imgPlaceholder}
                    href={`/coffee-store/${store.id}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps(context) {
  const coffeeStores = await fetchStores();

  return {
    props: {
      coffeeStores,
    }, // will be passed to the page component as props
  };
}
