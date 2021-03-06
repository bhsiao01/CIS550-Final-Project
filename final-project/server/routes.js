const config = require('./db-config.js')
const mysql = require('mysql')

var connection = mysql.createConnection({
  host: 'cis550-final-proj.ccvcesjf7gop.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: 'G!raffeS3aweed',
  database: 'master',
  port: 3306,
  multipleStatements: true
})

connection.connect(function (err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack)
    return
  }

  console.log('Connected to database.')
})

/* Queries by price */
// get cities that are in a certain of range of prices

// TODO: maybe we can make this a bigger query somehow (long runtime => easier to optimize)
const getHousingRange = (req, res) => {
  var min_val = req.params.min;
  var max_val = req.params.max;
  const housingRange = 
  `
  SELECT RegionName, StateName, MIN(Value) AS Min, MAX(Value) AS Max
	FROM ZillowHistoricalData
  GROUP BY RegionName, StateName
	HAVING MAX(Value) <= ${max_val} AND MIN(Value) >= ${min_val}
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

/*
 * Queries for the City page
 */

//get top 10 cities with the highest average home value
const get10HomeValue = (req, res) => {

  const get10HomeValue = `
  SELECT RegionName, StateName, AVG(Value) as avg_home_value
  FROM ZillowHistoricalData
  GROUP BY RegionName, StateName
  ORDER BY AVG(Value) DESC
  LIMIT 10
  `;

  connection.query(get10HomeValue, (err, rows, fields) => {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

//get top 10 cities with the most companies
const get10NumCompanies = (req, res) => {

  const get10NumCompanies = `
  SELECT City, StateAbbr, COUNT(CompanyName) as num_companies
  FROM StockInfo
  GROUP BY City, StateAbbr
  ORDER BY COUNT(CompanyName) DESC
  LIMIT 10
  `;

  connection.query(get10NumCompanies, (err, rows, fields) => {
    if (err) console.log(err);
    else {
      //console.log(rows);
      res.json(rows);
    }
  });
}

// Get simple statistics for cities
const getCityStat = (req, res) => {
  var city_input = req.params.city;
  var state_abrv_input = req.params.state;
  
  const cityStat = `
  SELECT RegionName, MIN(Value) AS min, AVG(Value) AS mean, MAX(Value) AS max 
  FROM ZillowHistoricalData
  WHERE RegionName = '${city_input}' AND StateName = '${state_abrv_input}'
  GROUP BY RegionName, StateName;
  `;

  connection.query(cityStat, (err, rows, fields) => {
    if (err) console.log(err);
    else {
      //console.log(rows);
      res.json(rows);
    }
  });
}

// get companies in given city and state
const getCompStat = (req, res) => {
  var city_input = req.params.city;
  var state_abrv_input = req.params.state;
  
  const compStat = `
  SELECT City, StateAbbr, CompanyName, StockSymbol
  FROM StockInfo
  WHERE City = '${city_input}' AND StateAbbr = '${state_abrv_input}'
  LIMIT 10;
  `;

  connection.query(compStat, (err, rows, fields) => {
    if (err) console.log(err);
    else {
      //console.log(rows);
      res.json(rows);
    }
  });
}


// get forecasted housing prices for the next year for a given city, state
const getForecast = (req, res) => {
  var city_input = req.params.city;
  var state_abrv_input = req.params.state;

  const forecastedChange = 
  `SELECT RegionName, StateName, AVG(ForecastYoYPctChange) AS Forecast
  FROM ZillowForecast
  WHERE RegionName = '${city_input}' AND StateName = '${state_abrv_input}'
  GROUP BY RegionName, StateName
  ORDER BY ForecastYoYPctChange;
  `;

  connection.query(forecastedChange, (err, rows, fields) => {
    if (err) console.log(err);
    else {
      //console.log(rows);
      res.json(rows);
    }
  });
}

// get average home price for a city
// TODO: this is redundant
const getAverageHome = (req, res) => {
  var city_input = req.params.city;
  var state_abrv_input = req.params.state;

  const avgValueQuery = `
  SELECT RegionName, AVG(Value)
	FROM ZillowHistoricalData
	WHERE RegionName = '${city_input}' AND StateName = '${state_abrv_input}'
  GROUP BY RegionName;
  `;

  connection.query(avgValueQuery, (err, rows, fields) => {
    if (err) console.log(err);
    else {
      //console.log(rows);
      res.json(rows);
    }
  });
}

// Find 20 cities with the highest predicted change in ZHVI and the number of companies in each city
const getTop20Cities = (req, res) => {
  var state_input = req.params.state; 
  const topTwenty = `
  WITH AvgForecastedValues AS (
    SELECT RegionName, StateName, ForecastedDate, AVG(ForecastYoYPctChange) AS ForecastYoYPctChange
    FROM ZillowForecast
    WHERE StateName = '${state_input}'
    GROUP BY RegionName, StateName, ForecastedDate
  ),
  StockPricesByCity AS (
    SELECT I.City, I.StateAbbr, COUNT(DISTINCT I.StockSymbol) AS NumCompanies, AVG(S.Close) AS AvgPrice
    FROM Stocks S JOIN StockInfo I ON I.StockSymbol = S.StockSymbol
    WHERE I.StateAbbr = '${state_input}' AND Date >= '2019-01-01'
    GROUP BY I.City, I.StateAbbr
  ),
  MatchedCities AS (
    SELECT S.City, S.StateAbbr, S.NumCompanies, S.AvgPrice, F.ForecastYoYPctChange
    FROM StockPricesByCity S JOIN AvgForecastedValues F ON RegionName = City AND StateName = StateAbbr
  )
  SELECT City, StateAbbr, NumCompanies, AvgPrice, ForecastYoYPctChange
  FROM MatchedCities
  ORDER BY ForecastYoYPctChange DESC
  LIMIT 20;
`
connection.query(topTwenty, (err, rows, fields) => {
    if (err) console.log(err)
    else {
      console.log(rows)
      res.json(rows)
    }
  })
}

// Get city ranking based on the largest change in housing value from first date on file to last date on file
const getCityRanking = (req, res) => {
  var state_input = req.params.state;
  const ranking = `
    SET @row_num = 0;
    WITH FirstYear AS (
      SELECT RegionName, StateName, MIN(Date) AS FirstDate
      FROM ZillowHistoricalData 
      WHERE StateName = '${state_input}' AND Date >= '1996-01-01'
      GROUP BY RegionName, StateName
      ORDER BY FirstDate
    ),
    LastYear AS (
      SELECT RegionName, StateName, Date, MAX(Date) AS LastDate
      FROM ZillowHistoricalData
      WHERE StateName = '${state_input}'
      GROUP BY RegionName, StateName
      ORDER BY Date DESC
    ),
    FirstYearValues AS (
      SELECT Z.RegionName, Z.StateName, AVG(Z.Value) AS FirstYearValue
      FROM ZillowHistoricalData Z JOIN FirstYear F ON Z.RegionName = F.RegionName AND Z.StateName = F.StateName
      WHERE YEAR(Z.Date) = YEAR(F.FirstDate)
      GROUP BY Z.RegionName, Z.StateName
    ),
    LastYearValues AS (
      SELECT Z.RegionName, Z.StateName, AVG(Z.Value) AS LastYearValue
      FROM ZillowHistoricalData Z JOIN LastYear L ON Z.RegionName = L.RegionName AND Z.StateName = L.StateName
      WHERE YEAR(Z.Date) = YEAR(L.LastDate)
      GROUP BY Z.RegionName, Z.StateName
    ),
     HousingValues AS (
        SELECT F.RegionName, F.StateName, L.LastYearValue - F.FirstYearValue AS HousingValueChange
        FROM FirstYearValues F JOIN LastYearValues L ON F.RegionName = L.RegionName AND F.StateName = L.StateName
        WHERE F.StateName = '${state_input}'
        ORDER BY HousingValueChange DESC
        )
    SELECT H.RegionName, H.StateName, H.HousingValueChange, (@row_num:=@row_num + 1) AS row_num
    FROM HousingValues H;
  `
  connection.query(ranking, (err, rows, fields) => {
    if (err) console.log(err)
    else {
      console.log(rows)
      if (rows.length > 1) {
        res.json(rows[1])
      }
    }
  })
}

/* Companies queries */ 

//gets company revnue by company ticker
const getRevenue = (req, res) => {
  var company_input = req.params.ticker;
  var year_input = req.params.year
  console.log(company_input);

  const stockRevenue = `
    SELECT Revenue
    FROM StockInfo
    WHERE StockSymbol = '${company_input}'
  `;

  connection.query(stockRevenue, (err, rows, fields) => {
    if (err) console.log(err)
    else {
      console.log(rows)
      res.json(rows)
    }
  });
}

//gets year of stock data for a given company
const getStockByYear = (req, res) => {
  var company_input = req.params.ticker;
  var year_input = req.params.year
  console.log(company_input);

  const stock = `
    SELECT *
    FROM Stocks
    WHERE StockSymbol = '${company_input}' AND YEAR(Date) = '${year_input}'
    ORDER BY Date DESC
  `;

  connection.query(stock, (err, rows, fields) => {
    if (err) console.log(err)
    else {
      console.log(rows)
      res.json(rows)
    }
  });
}

//gets available years of stock data for a given company
const getYearsfromTicker = (req, res) => {
  var company_input = req.params.ticker;
  console.log(company_input);

  const getYears = `
    SELECT DISTINCT YEAR(DATE) AS Year
    FROM Stocks
    WHERE StockSymbol = '${company_input}'
    ORDER BY Date DESC
  `;

  connection.query(getYears, (err, rows, fields) => {
    if (err) console.log(err)
    else {
      res.json(rows)
    }
  });
}

//get company Name from company ticker

const getCompanyName = (req, res) => {
  var company_input = req.params.ticker;

  const getCompanyName = `
    SELECT CompanyName, Website
    FROM StockInfo
    WHERE StockSymbol = '${company_input}'
  `;

  connection.query(getCompanyName, (err, rows, fields) => {
    if (err) console.log(err)
    else {
      console.log(rows)
      res.json(rows)
    }
  });
}

//get Industry from company ticker
const getCompanyIndustry = (req, res) => {
  var company_input = req.params.ticker;

  const getCompanyIndustry = `
    SELECT Sector
    FROM StockInfo
    WHERE StockSymbol = '${company_input}'
  `;

  connection.query(getCompanyIndustry, (err, rows, fields) => {
    if (err) console.log(err)
    else {
      console.log(rows)
      res.json(rows)
    }
  });
}

//get company CEO from company ticker

const getCompanyCEO = (req, res) => {
  var company_input = req.params.ticker;

  const getCompanyCEO = `
    SELECT CEO
    FROM StockInfo
    WHERE StockSymbol = '${company_input}'
  `;

  connection.query(getCompanyCEO, (err, rows, fields) => {
    if (err) console.log(err)
    else {
      console.log(rows)
      res.json(rows)
    }
  });
}

//get company HQ from company ticker

const getHQ = (req, res) => {
  var company_input = req.params.ticker;
  console.log(company_input);

  const getCompanyHq = `
    SELECT City, StateAbbr
    FROM StockInfo
    WHERE StockSymbol = '${company_input}'
  `;

  connection.query(getCompanyHq, (err, rows, fields) => {
    if (err) console.log(err)
    else {
      console.log(rows)
      res.json(rows)
    }
  });
}

/* Industry queries */ 

// Find the top 10 stocks with the greatest price for each industry.
const getTop10StocksPerIndustry = (req, res) => {
  var industry_input = req.params.sector;
  const topTen = `
    WITH HighPrice AS (
      SELECT S.StockSymbol, MAX(High) AS MaxPrice
      FROM Stocks S JOIN StockInfo I ON S.StockSymbol = I.StockSymbol
      WHERE S.Date >= '2019-01-01' AND I.Sector = '${industry_input}'
      GROUP BY StockSymbol
    ),
    PriceIndustry AS (
      SELECT S.StockSymbol, P.MaxPrice, S.Sector
      FROM HighPrice P JOIN StockInfo S ON P.StockSymbol = S.StockSymbol
      WHERE S.Sector = '${industry_input}'
    ),
    MaxPrices AS (
      SELECT MaxPrice
      FROM PriceIndustry
      WHERE Sector = '${industry_input}'
      ORDER BY MaxPrice DESC
      LIMIT 10
    ) 
    SELECT DISTINCT S.StockSymbol, I.Sector, I.CompanyName, P.MaxPrice
    FROM Stocks S JOIN StockInfo I ON I.StockSymbol = S.StockSymbol JOIN PriceIndustry P ON I.StockSymbol = P.StockSymbol
    WHERE S.Date >= '2019-01-01' AND S.High >= (SELECT MIN(MaxPrice) FROM MaxPrices)
    ORDER BY P.MaxPrice DESC;`

connection.query(topTen, (err, rows, fields) => {
    if (err) console.log(err)
    else {
      console.log(rows)
      res.json(rows)
    }
  })
}

//gets all industries, no keyword
const getIndustries = (req, res) => {
  const getAllIndustries = `
    SELECT DISTINCT Sector
    FROM StockInfo
    ORDER BY Sector;
  `;

  connection.query(getAllIndustries, (err, rows, fields) => {
    if (err) console.log(err)
    else {
      console.log(rows)
      res.json(rows)
    }
  });
}

// Find the city with the highest mean ZHVI out of all cities with company headquarters of companies in an input industry.
const meanPrice = (req, res) => {
  var industry_input = req.params.industry; 
  const db = `use master;`
  connection.query(db, (err, rows, fields) => {})
  const meanP = `
  WITH temp1 AS (
    SELECT RegionName, StateAbbr, AVG(Value) as mean
    FROM ZillowHistoricalData Z JOIN StockInfo S ON Z.RegionName = S.City
    WHERE S.Sector = '${industry_input}'
    GROUP BY RegionName
    ORDER BY mean DESC
  )
  SELECT T1.RegionName, T1.mean, T1.StateAbbr
  FROM temp1 as T1
  LIMIT 5;
`
connection.query(meanP, (err, rows, fields) => {
    if (err) console.log(err)
    else {
      //console.log(rows)
      res.json(rows)
    }
  });
}

// For the companies with the ten highest revenues, find the change in housing value in the 
// location of their headquarters in the past 5 years.
const getTop10RevByIndustry = (req, res) => {
  var industry_input = req.params.sector;
  const topTenRev = `
  WITH CompanyRevenues AS (
    SELECT StockSymbol, Revenue, CompanyName, City, StateAbbr
    FROM StockInfo
    WHERE Sector = '${industry_input}'
    ORDER BY Revenue DESC
    LIMIT 10
  ),
  HousingValues AS (
    SELECT Z.RegionName, Z.StateName, MAX(Value) - MIN(Value) AS HousingValueChange
    FROM CompanyRevenues R JOIN ZillowHistoricalData Z ON R.City = Z.RegionName AND R.StateAbbr = Z.StateName
    WHERE Z.Date >= '2016-01-01'
    GROUP BY Z.RegionName, Z.StateName
    )
  SELECT R.StockSymbol, R.CompanyName, R.Revenue, R.City, R.StateAbbr, H.HousingValueChange
  FROM CompanyRevenues R JOIN HousingValues H ON H.RegionName = R.City AND H.StateName = R.StateAbbr;
`
connection.query(topTenRev, (err, rows, fields) => {
    if (err) console.log(err)
    else {
      //console.log(rows)
      res.json(rows)
    }
  })
}

// Get high price for all stocks in an industry
const getHighPricePerIndustry = (req, res) => {
  var sector_input = req.params.sector;

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

// get home prices for cities with companies in a certain sector
const getHomesFromSector = (req, res) => {
  var sector_input = req.params.sector;
  console.log(sector_input);
  const db = `use master;`;
  connection.query(db, (err, rows, fields) => {});

  const sectorHome = `
    WITH temp1 AS (
    SELECT RegionName, StateAbbr, AVG(Value) as mean 
    FROM ZillowHistoricalData Z JOIN StockInfo S ON Z.RegionName = S.City 
    WHERE S.Sector = '${sector_input}'
    GROUP BY RegionName
    ORDER BY mean DESC
  )
  SELECT T1.RegionName, T1.StateAbbr, T1.mean
  FROM temp1 as T1;
  `;

  connection.query(sectorHome, (err, rows, fields) => {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  })
}

const getTopRevenue = (req, res) => {
  var industry_input = req.params.industry;
  const getTopRevenue = `
  SELECT StockSymbol, Revenue, CompanyName, City, StateAbbr
   FROM StockInfo
   WHERE Sector = '${industry_input}'
   ORDER BY Revenue DESC
   LIMIT 10;
  `
  connection.query(getTopRevenue, (err, rows, fields) => {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });

}

module.exports = {
  getAverageHome: getAverageHome,
  getHighPricePerIndustry: getHighPricePerIndustry,
  getCityStat: getCityStat,
  getStockByYear: getStockByYear,
  meanPrice: meanPrice,
  getCompStat: getCompStat,
  getHousingRange: getHousingRange,
  getForecast: getForecast,
  getHomesFromSector: getHomesFromSector,
  getTop10StocksPerIndustry: getTop10StocksPerIndustry,
  getHomesFromSector: getHomesFromSector,
  getTop10RevByIndustry: getTop10RevByIndustry,
  getTop20Cities: getTop20Cities,
  getHQ: getHQ,
  getCompanyName: getCompanyName,
  getCompanyIndustry: getCompanyIndustry,
  getCompanyCEO: getCompanyCEO,
  getIndustries: getIndustries,
  get10HomeValue: get10HomeValue,
  get10NumCompanies: get10NumCompanies,
  getCityRanking: getCityRanking,
  getYearsfromTicker: getYearsfromTicker,
  getRevenue: getRevenue,
  get10HomeValue: get10HomeValue,
  get10NumCompanies: get10NumCompanies,
  getTopRevenue: getTopRevenue
}
