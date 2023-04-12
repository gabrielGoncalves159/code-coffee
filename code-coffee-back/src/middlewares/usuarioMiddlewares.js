const validerBody = (req, res, next) => {
	const {body} = req;
	console.log(body);

	if(body.nome === undefined){
		return res.status(400).json({mensagem: 'O campo nome deve ser preenchido!'});
	}

	next();
};

module.exports = {
	validerBody
};