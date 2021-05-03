const express = require('express')
var routes = require('./routes.js')
const cors = require('cors')

const app = express()

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */

app.get('/api/test', (req, res) => {
  res.send({ express: 'Hello From Express' })
})

/* PRICE RANGE QUERIES */

//calling app.get for cities that meet a housing price range
app.get('/getHousingRange/:min/:max', routes.getHousingRange)

/* LOCATION QUERIES */

//calling app.get for the homeprices page
app.get('/getAverageHome/:city/:state', routes.getAverageHome)

//calling app.get for simple city stats
app.get('/getCityStat/:city/:state', routes.getCityStat)

//calling app.get for forecasted housing values for a city
app.get('/getForecast/:city/:state', routes.getForecast)

//calling app.get for top 20 cities in a state
app.get('/getTop20Cities/:state', routes.getTop20Cities)

//calling app.get for city ranking in terms of range
app.get('/getCityRanking/:state', routes.getCityRanking)

//calling app.get for simple city stats
app.get('/getCompStat/:city/:state', routes.getCompStat)

/* COMPANY QUERIES */

//calling app.get for stock history of year
app.get('/getStockByYear/:ticker/:year', routes.getStockByYear)

//calling app.get for all available years of a stock
app.get('/getYearsFromTicker/:ticker', routes.getYearsfromTicker)

//get industry of stock
app.get('/getIndustryFromCompany/:ticker', routes.getCompanyIndustry)

/* INDUSTRY QUERIES */
//calling app.get to find the topstocks per industry
app.get('/getTop10/:sector', routes.getTop10StocksPerIndustry)

//calling app.get to find mean price given an industry
app.get('/getMeanPriceIndustry/:industry', routes.meanPrice)

//calling app.get to find the high price per an industry
app.get('/getHighPriceIndustry/:sector', routes.getHighPricePerIndustry)

// calling app.get to find the top 10 revenues per industry
app.get('/getTop10Rev/:sector', routes.getTop10RevByIndustry)

app.get('/getSectorHome/:sector', routes.getHomesFromSector)

app.get('/getAllIndustries/', routes.getIndustries)

app.listen(8081, () => {
  console.log(`Server listening on PORT 8081`)
})
