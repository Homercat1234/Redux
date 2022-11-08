const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const accountRouter = require('./routes/account');
const blogRouter = require('./routes/blog');

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use("/account", accountRouter);
app.use("/blog", blogRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));