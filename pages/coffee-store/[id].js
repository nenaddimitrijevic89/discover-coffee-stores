import { useRouter } from "next/router";
import Link from "next/link";

const CoffeeStore = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <div>
      <p>Coffee Store {id}</p>
      <Link href="/">
        <a>go back</a>
      </Link>
    </div>
  );
};

export default CoffeeStore;
