const express = require('express');
const router = require('./router.js');
const app = express();

const PORT = process.env.PORT || 4001;

app.use('/api', router);

app.listen(PORT, () => {
	console.log(`Server is listening on PORT ${PORT}`);
});
