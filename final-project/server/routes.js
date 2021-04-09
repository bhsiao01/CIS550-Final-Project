const config = require('./db-config.js');
const mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'cis550-final-proj.ccvcesjf7gop.us-east-2.rds.amazonaws.com',
  user     : 'admin',
  password : 'G!raffeS3aweed',
  port     : 3306
});

connection.connect(function(err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }

  console.log('Connected to database.');
  const db = `use master;`; //use the correct database in AWS RDS environment
/*   const query = `
    SELECT *
    FROM StockInfo
    LIMIT 20;
  `; */

  //connect to database
  connection.query(db, (err, rows, fields) => {});
  /* connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else console.log(rows);
  }); */
});

const getAverageHome = (req, res) => {
  const db = `use master;`
  const query = `
  SELECT DISTINCT RegionType
  FROM ZillowHistoricalData
  LIMIT 200;
  `;
  connection.query(db, (err, rows, fields) => {});
  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
}

module.exports = {
  getAverageHome: getAverageHome,
}