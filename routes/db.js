module.exports = (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify({ a: 1 }));
};