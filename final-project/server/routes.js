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
  var city_input = req.params.city;
  var state_abrv_input = req.params.state;

  const db = `use master;`
  //var inputKeyword = req.params.keyword; '${inputKeyword}'

  // get average home value for input city, state
  // TODO: Parametrize RegionName and StateName
  const avgValueQuery = `
  SELECT RegionName, AVG(Value)
	FROM ZillowHistoricalData
	WHERE RegionName = '${city_input}' AND StateName = '${state_abrv_input}'
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
  WHERE RegionName = '${city_input}' AND StateName = '${state_abrv_input}'
  GROUP BY RegionName, StateName;
  `;

  const compStat = `
  SELECT City, StateAbbr, CompanyName
  FROM StockInfo
  WHERE City = '${city_input}' AND StateAbbr = '${state_abrv_input}'
  LIMIT 10;
  `;

  // this might fit better on the home page (place for people to enter range of housing prices they'd consider)
  const housingRange = 
  `
  SELECT RegionName, StateName, MIN(Value) AS Min, MAX(Value) AS Max
	FROM ZillowHistoricalData
  GROUP BY RegionName, StateName
	HAVING MAX(Value) <= 200000 AND MIN(Value) >= 150000
  ORDER BY MIN(Value);
  `;

  const forecastedChange = 
  `SELECT RegionName, StateName, AVG(ForecastYoYPctChange) AS Forecast
  FROM ZillowForecast
  WHERE RegionName = 'Philadelphia' AND StateName = 'PA'
  GROUP BY RegionName, StateName
  ORDER BY ForecastYoYPctChange;
  `;

  connection.query(compStat, (err, rows, fields) => {
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
  var company_input = req.params.ticker;
  console.log(company_input);

  const db = `use master;`
  connection.query(db, (err, rows, fields) => {})

  const stock30Days = `
    SELECT *
    FROM Stocks
    WHERE StockSymbol = '${company_input}'
    ORDER BY Date DESC
    LIMIT 30;
  `;

  connection.query(stock30Days, (err, rows, fields) => {
    if (err) console.log(err)
    else {
      console.log(rows)
      res.json(rows)
    }
  })

  /*connection.query(sectorHome, (err, rows, fields) => {
    if (err) console.log(err)
    else {
      console.log(rows)
      res.json(rows)
    }
  })*/
}

// Find the city with the highest mean ZHVI out of all cities with 
// company headquarters of companies in an input industry.


const meanPrice = (req, res) => {
  var industry_input = req.params.industry; 
  const db = `use master;`
  connection.query(db, (err, rows, fields) => {})
  const meanP = `
  WITH temp1 AS (
    SELECT RegionName, AVG(ZHVI) as mean 
    FROM FROM ZillowHistoricalData JOIN StockInfo ON ZillowHistoricalData.RegionName = StockInfo.City 
    GROUP BY RegionName 
    WHERE StockInfo.industry = '${industry_input}'
  )
  SELECT T1.RegionName
  FROM temp1 as T1
  WHERE T1.mean > ALL (SELECT T1.mean FROM temp1);
`
connection.query(meanP, (err, rows, fields) => {
    if (err) console.log(err)
    else {
      console.log(rows)
      res.json(rows)
    }
  })
}

// Find the top 10 stocks with the greatest price for each industry.
const top10 = (req, res) => {
  const db = `use master;`
  connection.query(db, (err, rows, fields) => {})
  const topTen = `
  WITH HighPrice AS (
    SELECT StockSymbol, MAX(HighPrice) AS MaxPrice
    FROM Stocks
    GROUP BY StockSymbol
  ),
  PriceIndustry AS (
    SELECT S.StockSymbol, P.MaxPrice, S.Industry
    FROM HighPrice P JOIN Stocks S ON A.StockSymbol = S.StockSymbol
  )
  SELECT DISTINCT S.StockSymbol, I.Industry, I.CompanyName
  FROM Stocks S JOIN StockInfo I ON I.StockSymbol = S.StockSymbol
  GROUP BY S.StockSymbol, I.Industry
  WHERE S.HighPrice >= 
  (SELECT MIN(MaxPrice) 
  FROM PriceIndustry 
  WHERE Industry = I.Industry
  ORDER BY MaxPrice DESC
  LIMIT 10);
`
connection.query(topTen, (err, rows, fields) => {
    if (err) console.log(err)
    else {
      console.log(rows)
      res.json(rows)
    }
  })
}

// For the companies with the ten highest revenues, find the change in housing value in the 
// location of their headquarters in the past 5 years.

const top10Rev = (req, res) => {
  const db = `use master;`
  connection.query(db, (err, rows, fields) => {})
  const topTenRev = `
  WITH CompanyRevenues AS (
  SELECT StockSymbol, Revenue, CompanyName, City, State
  FROM StockInfo
  WHERE Industry = [input]
  ORDER BY Revenue DESC
  LIMIT 10
  ),
  HousingValues AS (
  SELECT RegionName, State, MAX(Value) - MIN(Value) AS HousingValueChange
  FROM CompanyRevenues R
  JOIN ZillowHistorical Z ON R.City = Z.RegionName AND R.State = Z.State
  GROUP BY Z.RegionName, Z.State
  WHERE Z.Date >= ‘01-01-2016’
  )
  SELECT R.StockSymbol, R.CompanyName, R.Revenue, R.City, R.State H.HousingValueChange
  FROM CompanyRevenues R JOIN HousingValues H ON H.RegionName = R.City AND H.State = R.State;
`
connection.query(topTenRev, (err, rows, fields) => {
    if (err) console.log(err)
    else {
      console.log(rows)
      res.json(rows)
    }
  })
}

// Find the number of NASDAQ companies and their average stock price in the top 20 cities with the 
// highest forecasted percentage change in value, as of April 1st 2020.

const top10Rev = (req, res) => {
  var industry_state = req.params.state; 
  const db = `use master;`
  connection.query(db, (err, rows, fields) => {})
  const topTenRev = `
  WITH HighestForecastValue AS (
  SELECT RegionName, StateName, ForecastPctChange
  FROM ZillowForecast
  ORDER BY ForecastPctChange
  LIMIT 20;
  ),
  StockPricesByCity AS (
  SELECT I.City, I.State, COUNT(*) AS NumCompanies, AVG(ClosingPrice) AS AvgPrice
  FROM Stocks S JOIN StockInfo I ON I.StockSymbol = S.StockSymbol
  WHERE Date = ‘04-01-2020’
  GROUP BY I.City, I.State;
  )
  SELECT City, State, NumCompanies, AvgPrice, ForecastPctChange
  FROM StockPricesByCity
  JOIN HighestForecastValue
  ON RegionName = City AND StateName = State
  WHERE State = '${industry_state}';

`
connection.query(topTenRev, (err, rows, fields) => {
    if (err) console.log(err)
    else {
      console.log(rows)
      res.json(rows)
    }
  })
}

//optimize! (DOES NOT LOAD WITHOUT WHERE DATE ... clauses)
const getTopStocksPerIndustry = (req, res) => {
  var sector_input = req.params.sector;
  console.log(sector_input);
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
  `;

  const industry = `
  SELECT S.StockSymbol, MAX(High) AS MaxPrice
      FROM Stocks S JOIN StockInfo I ON S.StockSymbol = I.StockSymbol
      WHERE S.Date >= '2020-01-01' AND I.Sector = '${sector_input}'
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
