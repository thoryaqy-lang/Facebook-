const express = require('express');
const path = require("path");
const app = express();
const postRoutes = require('./routes/postRoutes');

app.use(express.json());
app.use(express.static('public'));

app.use('/', postRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.listen(5000, "0.0.0.0", () => {
    console.log("Server running on port 5000");
});
