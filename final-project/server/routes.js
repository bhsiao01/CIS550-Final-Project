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

  connection.query(db, (err, rows, fields) => {});  //connect to database
});

/*
* Queries for the City page
*/
const getAverageHome = (req, res) => {
  const db = `use master;`;
  //var inputKeyword = req.params.keyword; '${inputKeyword}'

  // get average home value for input city, state
  // TODO: Parametrize RegionName and StateName
  const avgValueQuery = `
  SELECT RegionName, AVG(Value)
	FROM ZillowHistoricalData
	WHERE RegionName = 'Seattle' AND StateName = 'WA'
  GROUP BY RegionName;
  `;
  connection.query(db, (err, rows, fields) => {});

  /*connection.query(avgValueQuery, (err, rows, fields) => {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });*/

  // Get simple statistics for cities 
  // Parametrize State
  const cityState = `
  SELECT RegionName, MIN(Value) AS min, AVG(Value) AS mean, MAX(Value) AS max 
  FROM ZillowHistoricalData
  WHERE StateName = 'PA'
  GROUP BY RegionID, RegionName
  HAVING Date >= '01-01-1996';
  `;
  connection.query(cityState, (err, rows, fields) => {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });

  /*const stockInfo = `
  SELECT *
  FROM StockInfo
  LIMIT 10;
  `;
  connection.query(stockInfo, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });*/
}

//finds all companies with headquarters in the input city
//gets stuff from StockInfo
const getCompanies = (req, res) => {
  //var city_input = req.params.city;
  //var state_abrv_input = req.params.state_abrv;
  
  
  const db = `use master;`;
  connection.query(db, (err, rows, fields) => {});

  const query = `
  SELECT City, StateAbbr, CompanyName
  FROM StockInfo
  WHERE City = 'Princeton' AND StateAbbr = 'NJ'
  LIMIT 10;
  `;
  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};



module.exports = {
  getAverageHome: getAverageHome,
  getCompanies: getCompanies
}