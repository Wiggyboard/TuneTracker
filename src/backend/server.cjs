const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app.cjs');
const mongoose = require('mongoose');
const mongodb = process.env.DATABASE.replace('<password>', process.env.DB_PASSWORD);

mongoose.connect(mongodb, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(con => {
  console.log(con.connection);
  console.log(`The Database connection was successful`);
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});