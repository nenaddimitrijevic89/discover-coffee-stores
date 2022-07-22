import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

import cls from "classnames";

import { fetchStores } from "../../lib/coffee-stores";

import styles from "../../styles/coffee-store.module.css";

const imgPlaceholder =
  "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80";

const CoffeeStore = (props) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading....</div>;
  }

  const { location, name, imgUrl } = props.coffeeStore;

  const handleUpvoteButton = () => {};

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>Back to home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={imgUrl || imgPlaceholder}
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name}
          />
        </div>

        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/places.svg"
              width="24"
              height="24"
              alt="place_icon"
            />
            <p className={styles.text}>{location.address}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/nearMe.svg"
              width="24"
              height="24"
              alt="near_me_icon"
            />
            <p className={styles.text}>{location.locality}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/star.svg"
              width="24"
              height="24"
              alt="star_icon"
            />
            <p className={styles.text}>1</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps(staticProps) {
  const params = staticProps.params;
  const coffeeStores = await fetchStores();

  return {
    props: {
      coffeeStore: coffeeStores.find(
        (store) => store.fsq_id.toString() === params.id
      ),
    },
  };
}

export async function getStaticPaths() {
  const coffeeStores = await fetchStores();

  const paths = coffeeStores.map((store) => ({
    params: { id: store.fsq_id.toString() },
  }));

  return {
    paths,
    fallback: true,
  };
}

export default CoffeeStore;
