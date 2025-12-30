require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const db = require('./models').db;
const router = require('./routes');

const port = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.get('/', (req, res) => {
	res.send('Backend works!');
});

app.use('/api', router);

app.get('/reset', async (req,res) => {
	await db.sync({ force: true });
	res.status(200).send('The database has been successfully reset ');
});

app.listen(port, () => {
	console.log(`Backend running at http://localhost:${port}`);
});
