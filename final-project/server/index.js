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
app.get("/city/:city/:state", routes.getAverageHome);

app.get("/company", routes.getCompanies);

app.get("/industry", routes.getTopStocksPerIndustry);

// route for each company, city
// eg. /company/apple  

// route for homepage  




app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});