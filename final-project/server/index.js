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


//calling app.get for simple city stats
// done
app.get("/getCompStat/:city/:state", routes.getCompStat);

//calling app.get 30 day stock history
// done
app.get("/get30day/:ticker", routes.get30Day);

//calling app.get to find the topstocks per industry
//done
app.get("/getTop10/:sector", routes.getTop10StocksPerIndustry);

//calling app.get to find mean price given an industry
//done
app.get("/getMeanPriceIndustry/:industry", routes.meanPrice);

//calling app.get to find the high price per an industry
//done
app.get("/getHighPriceIndustry/:industry", routes.getHighPricePerIndustry);


app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});