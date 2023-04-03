const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


if (process.env.NODE_ENV == "production") {
	app.use(express.static(path.join(__dirname, "./build")));
	app.get("/*", (req, res) => {
		res.sendFile(path.join(__dirname, "./build/index.html"));
	});
}
app.listen(PORT, () => console.log(`Now listening on port: ${PORT}`));
