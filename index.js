//to import/require stuff written inside .env file - like your port #
require('dotenv').config();

// require your server and launch it 
const server = require('./api/server.js')

//dummy test endpoint http :9000
server.get('/', (req, res) => {
    res.send(`<h2>Let's write some middleware!</h2>`);
});

// in case there is no PORT in either process.env nor the environment
const port = process.env.PORT || 9000;


// START SERVER
// console.log('index.js - nodemon test - shows when i save');
server.listen(port, () => {
  console.log(`\n*** Server Running on http://localhost:${port} ***\n`);
});