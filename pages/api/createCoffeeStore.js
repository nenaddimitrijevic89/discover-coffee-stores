import { table, getMinifiedRecords } from "../../lib/airtable";

const createCoffeeStore = async (req, res) => {
  if (req.method === "POST") {
    const { id, name, address, neighborhood, voting, imgUrl } = req.body;

    try {
      //find
      if (id) {
        const findCoffeeStoreRecords = await table
          .select({
            filterByFormula: `id="${id}"`,
          })
          .firstPage();

        if (findCoffeeStoreRecords.length !== 0) {
          const records = getMinifiedRecords(findCoffeeStoreRecords);
          res.json(records);
        } else {
          //create
          if (name) {
            const createRecords = await table.create([
              {
                fields: {
                  id,
                  name,
                  address,
                  neighborhood,
                  voting,
                  imgUrl,
                },
              },
            ]);

            const records = getMinifiedRecords(createRecords);
            res.json({ message: "record created", records });
          } else {
            res.status(400);
            res.json({ message: "Name is missing!" });
          }
        }
      } else {
        res.status(400);
        res.json({ message: "Id is missing!" });
      }
    } catch (err) {
      console.error("Error creating or finding store", err);
      res.status(500);
      res.json({ message: "Error creating or finding store", err });
    }
  }
};

export default createCoffeeStore;
