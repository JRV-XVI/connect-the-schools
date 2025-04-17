const { Pool } = require('pg')

const pool = new Pool({
	database: 'connect_the_schools',
	user: 'admin',
	password: 'admin',
	host: 'localhost',
	port: 5432
});

module.exports = {
	query: (text, params) => pool.query(text, params)
};
