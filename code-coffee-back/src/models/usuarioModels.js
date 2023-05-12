// arquivo onde contera as funções que irão fazer as requisições com o banco
const connection = require('./connection');

const getUsuario = async (req) => {
	const {id_usuario, nome} = req;

	var query = 'SELECT id_usuario, nome, CPF, telefone, t.descricao FROM usuario u LEFT JOIN tipo_usuario t ON t.id_tipo_usuario = u.id_tipo_usuario ';
	
	if(id_usuario !== 0 || nome !== ''){
		query += 'WHERE ';
	}
	if (id_usuario !== 0){
		query += `id_usuario = ${id_usuario}`;
	}
	if (id_usuario !== 0 && nome !== ''){
		query += ' AND ';
	}
	if(nome !== ''){
		query += `nome = '${nome}'`;
	}
	const response = await connection.execute(query);
	return response;
};

const getTipoUsuario = async () => {
	const response = await connection.execute('SELECT * FROM tipo_usuario');
	return response;
};

const insertUsuario = async (res) => {
	const nome = res.nome;
	const cpf = res.cpf;
	const senha = res.senha;
	const telefone = res.telefone;
	const idTipoUsuario = res.idTipoUsuario;

	const query = 'INSERT INTO usuario (nome, CPF, senha, telefone, id_tipo_usuario) VALUE (?, ?, ?, ?, ?)';
	const response = await connection.execute(query, [nome, cpf, senha, telefone, idTipoUsuario]);

	return response;
};

const updateUsuario = async (req) => {
	const {id, nome, cpf, senha, telefone, idTipoUsuario} = req;
	const query = 'CALL alterar_usuario(?,?,?,?,?,?)';
	const response = await connection.execute(query, [id, nome, cpf, senha, telefone, idTipoUsuario]);

	return response;
};

const deleteUsuario = async (res) => {
	const id = res.id;
	const query = 'DELETE FROM usuario WHERE id_usuario = ?';
	const response = await connection.execute(query, [id]);

	return response;
};

module.exports = {
	getUsuario,
	getTipoUsuario,
	insertUsuario,
	updateUsuario,
	deleteUsuario
};