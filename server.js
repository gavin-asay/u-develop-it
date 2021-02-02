const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = new sqlite3.Database('./db/election.db', err => {
	if (err) return console.error(err.message);

	console.log('Connected to the election database.');
});

app.get('/api/candidates', (req, res) => {
	const sql = `SELECT * FROM candidates`;
	const params = [];
	db.all(sql, params, (err, rows) => {
		if (err) {
			res.sendStatus(500).json({ error: err.message });
			return;
		}

		res.json({
			message: 'success',
			data: rows,
		});
	});
});

app.get('/api/candidate/:id', (req, res) => {
	const sql = `SELECT * FROM candidates
				WHERE id = ?`;
	const params = [req.params.id];

	db.get(sql, params, (err, row) => {
		if (err) {
			res.status(400).json({ error: err.message });
			return;
		}

		res.json({
			message: 'success',
			data: row,
		});
	});
});

app.delete('/api/candidate/:id', (req, res) => {
	const sql = `DELETE FROM candidates WHERE id = ?`;
	const params = [req.params.id];
	db.run(sql, params, function (err, result) {
		if (err) {
			res.status(400).json({ error: res.message });
			return;
		}

		res.json({
			message: 'successfully deleted',
			changes: this.changes,
		});
	});
});

app.use((req, res) => {
	res.sendStatus(404).end();
});

db.on('open', () => {
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}.`);
	});
});
