const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');

const app = express();

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */

app.get('/api/test', (req, res) => {
  res.send({ express: 'Hello From Express' });
});
  
//calling app.get for the homeprices page
// done
app.get("/getAverageHome/:city/:state", routes.getAverageHome);

//calling app.get for simple city stats
// done
app.get("/getCityStat/:city/:state", routes.getCityStat);

//calling app.get for forecasted housing values for a city
// done
app.get("/getForecast/:city/:state", routes.getForecast);

//calling app.get for cities that meet a housing price range
// done
app.get("/getHousingRange/:min/:max", routes.getHousingRange);

//calling app.get for top 20 cities in a state
// done
app.get("/getTop20Cities/:state", routes.getTop20Cities);

<<<<<<< HEAD
//calling app.get for city ranking in terms of range
// done
app.get("/getCityRanking/:state", routes.getCityRanking);


=======
>>>>>>> 7e8bd4341fb5a0b89baec9ff68f62c4243002c0e
//calling app.get for simple city stats
// done
app.get("/getCompStat/:city/:state", routes.getCompStat);

//calling app.get 30 day stock history
// done
app.get("/get30day/:ticker", routes.get30Day);

app.get("/getIndustryFromCompany/:ticker", routes.getCompanyIndustry)

//calling app.get to find the topstocks per industry
//done
app.get("/getTop10/:sector", routes.getTop10StocksPerIndustry);

//calling app.get to find mean price given an industry
//done
app.get("/getMeanPriceIndustry/:industry", routes.meanPrice);

//calling app.get to find the high price per an industry
//done
app.get("/getHighPriceIndustry/:sector", routes.getHighPricePerIndustry);

// calling app.get to find the top 10 revenues per industry
app.get("/getTop10Rev/:sector", routes.getTop10RevByIndustry);

app.get("/getSectorHome/:sector", routes.getHomesFromSector);

app.get("/getAllIndustries/", routes.getIndustries);


app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});