const config = require('./db-config.js')
const mysql = require('mysql')

var connection = mysql.createConnection({
  host: 'cis550-final-proj.ccvcesjf7gop.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: 'G!raffeS3aweed',
  port: 3306,
})

connection.connect(function (err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack)
    return
  }

  console.log('Connected to database.')
  const db = `use master;` //use the correct database in AWS RDS environment

  connection.query(db, (err, rows, fields) => {}) //connect to database
})

/*
 * Queries for the City page
 */
const getAverageHome = (req, res) => {
  const db = `use master;`
  //var inputKeyword = req.params.keyword; '${inputKeyword}'

  // get average home value for input city, state
  // TODO: Parametrize RegionName and StateName
  const avgValueQuery = `
  SELECT RegionName, AVG(Value)
	FROM ZillowHistoricalData
	WHERE RegionName = 'Seattle' AND StateName = 'WA'
  GROUP BY RegionName;
  `;
  connection.query(db, (err, rows, fields) => {})

  /*connection.query(avgValueQuery, (err, rows, fields) => {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });*/

  // Get simple statistics for cities
  // Parametrize State
  const cityStat = `
  SELECT RegionName, MIN(Value) AS min, AVG(Value) AS mean, MAX(Value) AS max 
  FROM ZillowHistoricalData
  WHERE StateName = 'PA'
  GROUP BY RegionID, RegionName;
  `;

  const housingRange = 
  `
  SELECT RegionName, StateName, MIN(Value) AS Min, MAX(Value) AS Max
	FROM ZillowHistoricalData
  GROUP BY RegionName, StateName
	HAVING MAX(Value) <= 200000 AND MIN(Value) >= 150000
  ORDER BY MIN(Value);
  `;
  connection.query(housingRange, (err, rows, fields) => {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
}

//finds all companies with headquarters in the input city
//gets stuff from StockInfo
const getCompanies = (req, res) => {
  //var city_input = req.params.city;
  //var state_abrv_input = req.params.state_abrv;

  const db = `use master;`
  connection.query(db, (err, rows, fields) => {})

  const cityStat = `
  SELECT City, StateAbbr, CompanyName
  FROM StockInfo
  WHERE City = 'Princeton' AND StateAbbr = 'NJ'
  LIMIT 10;
  `;


  const stock30Days = `
    SELECT *
    FROM Stocks
    WHERE StockSymbol = 'MSFT'
    ORDER BY Date DESC
    LIMIT 30;
  `;


  const forecastedChange = 
  `SELECT RegionName, StateName, AVG(ForecastYoYPctChange) AS Forecast
  FROM ZillowForecast
  WHERE RegionName = 'Philadelphia' AND StateName = 'PA'
  GROUP BY RegionName, StateName
  ORDER BY ForecastYoYPctChange;
  `;

  connection.query(housingRange, (err, rows, fields) => {
    if (err) console.log(err)
    else {
      console.log(rows)
      res.json(rows)
    }
  })

  // TODO: If not complex enough, add another join of T1 with companies that are in the city
  const sectorHome = `
  WITH temp1 AS (
    SELECT RegionName, AVG(Value) as mean 
    FROM ZillowHistoricalData Z JOIN StockInfo S ON Z.RegionName = S.City 
    WHERE S.Sector = 'Technology'
    GROUP BY RegionName
    ORDER BY mean DESC
  )
  SELECT T1.RegionName, T1.mean
  FROM temp1 as T1
  LIMIT 5;
  `
  /*connection.query(sectorHome, (err, rows, fields) => {
    if (err) console.log(err)
    else {
      console.log(rows)
      res.json(rows)
    }
  })*/
}

//optimize! (DOES NOT LOAD WITHOUT WHERE DATE ... clauses)
const getTopStocksPerIndustry = (req, res) => {
  const db = `use master;`;
  connection.query(db, (err, rows, fields) => {});

  /*const industry = `
    WITH HighPrice AS (
      SELECT S.StockSymbol, MAX(High) AS MaxPrice
      FROM Stocks S JOIN StockInfo I ON S.StockSymbol = I.StockSymbol
      WHERE S.Date >= '2020-01-01' AND I.Sector = 'Technology'
      GROUP BY StockSymbol
    ),
    PriceIndustry AS (
      SELECT S.StockSymbol, P.MaxPrice, S.Sector
      FROM HighPrice P JOIN StockInfo S ON P.StockSymbol = S.StockSymbol
      WHERE S.Sector = 'Technology'
    )
    SELECT DISTINCT S.StockSymbol, I.Sector, I.CompanyName, P.MaxPrice
    FROM Stocks S JOIN StockInfo I ON I.StockSymbol = S.StockSymbol JOIN PriceIndustry P ON I.StockSymbol = P.StockSymbol
    WHERE S.Date >= '2020-01-01' AND S.High >= 
    (SELECT MIN(MaxPrice) 
    FROM PriceIndustry 
    WHERE Sector = 'Technology'
    ORDER BY MaxPrice DESC
    LIMIT 10);
  `;*/
  const industry = `
  SELECT S.StockSymbol, MAX(High) AS MaxPrice
      FROM Stocks S JOIN StockInfo I ON S.StockSymbol = I.StockSymbol
      WHERE S.Date >= '2020-01-01' AND I.Sector = 'Technology'
      GROUP BY StockSymbol;
  `;

  connection.query(industry, (err, rows, fields) => {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  })
}

module.exports = {
  getAverageHome: getAverageHome,
  getCompanies: getCompanies,
  getTopStocksPerIndustry: getTopStocksPerIndustry,
}
