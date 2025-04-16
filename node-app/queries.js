const db = require('./database.js');

const getAllExpressions = async () => {
	const result = await db.query('SELECT * FROM expressions');
	return result.rows;
}

const getExpressionId = async (id) => {
	const result = await db.query('SELECT * FROM expressions WHERE id = $1', [id]);
	return result.rows;
}

const createNewExpression = async (params) => {
	const result = await db.query('INSERT INTO expressions (emoji, name) VALUES ($1, $2)', [params.emoji, params.name]);
	console.log("ALL GOOD")
	return result.rows;
}

const updateExpression = async (id, params) => {
	const result = await db.query("UPDATE expressions SET emoji = $2, name = $3 WHERE id = $1", [id, params.emoji, params.name])
	return result.rows;
}

const deleteExpression = async (id) => {
	const result = await db.query("DELETE FROM expressions WHERE id = $1", [id]);
	return result.rows;
}
