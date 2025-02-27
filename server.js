const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();

const sequelize = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);

const PORT = process.env.PORT || 5000;
sequelize.sync().then(() => {
  console.log("Database connected!");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
