const express = require('express');
const inputCheck = require('./utils/inputCheck');
const db = require('./db/database');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const apiRoutes = require('./routes/apiRoutes');
app.use('/api', apiRoutes);

app.use((req, res) => {
	res.sendStatus(404).end();
});

db.on('open', () => {
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}.`);
	});
});
