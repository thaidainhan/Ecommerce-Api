const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "thaidainhan",
  database: "shop",
});

const batchSize = 100_000;
const totalSize = 1_000_000;

let currentId = 1;

const insertBatch = async () => {
  const values = [];
  for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
    const name = `name${currentId}`;
    const age = currentId;
    values.push([currentId, name, age]);
    currentId++;
  }

  if (!values.length) {
    pool.end((err) => {
      if (err) throw err;
      console.log(`Connection Closed`);
    });
    return;
  }

  const sql = `INSERT INTO users(id,name,age) VALUES ?`;

  pool.query(sql, [values], async (error, results) => {
    if (error) throw error;
    console.log(`Inserted ${results.affectedRows} records`);
    await insertBatch();
  });
};

insertBatch().catch(console.error);

// pool.query("SELECT * FROM users", (error, results) => {
//   if (error) throw error;
//   console.log(`Query Results: ${JSON.stringify(results)}`);
//   // close pool connection

//   pool.end((error) => {
//     if (error) {
//       throw error;
//     }
//     console.log(`Connection Closed`);
//   });
// });
