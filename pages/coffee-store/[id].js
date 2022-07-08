import { useRouter } from "next/router";
import Link from "next/link";

import coffeeStoresData from "../../data/coffee-stores.json";

const CoffeeStore = (props) => {
  const router = useRouter();
  const { id } = router.query;
  
  if (router.isFallback) {
    return <div>Loading....</div>;
  }

  return (
    <div>
      <p>Coffee Store {id}</p>
      <Link href="/">
        <a>go back</a>
      </Link>
      <p>{props.coffeeStore.address}</p>
      <p>{props.coffeeStore.name}</p>
    </div>
  );
};

export function getStaticProps(staticProps) {
  const params = staticProps.params;
  return {
    props: {
      coffeeStore: coffeeStoresData.find(
        (store) => store.id.toString() === params.id
      ),
    },
  };
}

export function getStaticPaths() {
  return {
    // paths: coffeeStoresData.map((store) => ({
    //   params: { id: store.id.toString() },
    // })),
    paths: [{ params: { id: "0" } }, { params: { id: "1" } }],
    fallback: true,
  };
}

export default CoffeeStore;
