const Airtable = require("airtable");
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_KEY
);

const table = base("coffee-stores");

console.log({ table });

const createCoffeeStore = async (req, res) => {
  const { id, name, address, neighbourhood, voting, imgUrl } = req.body;
  if (req.method === "POST") {
    try {
      //find
      if (id) {
        const findCoffeeStoreRecords = await table
          .select({
            filterByFormula: `id=${id}`,
          })
          .firstPage();

        console.log({ findCoffeeStoreRecords });
        if (findCoffeeStoreRecords.length !== 0) {
          const records = findCoffeeStoreRecords.map((record) => {
            return {
              ...record.fields,
            };
          });
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
                  neighbourhood,
                  voting,
                  imgUrl,
                },
              },
            ]);

            const records = createRecords.map((record) => {
              return {
                ...record.fields,
              };
            });
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
      console.log("Error finding store", err);
      res.status(500);
      res.json({ message: "Error finding store", err });
    }
  }
};

export default createCoffeeStore;
