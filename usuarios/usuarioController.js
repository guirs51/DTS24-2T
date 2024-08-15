
//Importa o objeto usuario
const Usuario = require('../modelo/Usuario');

//Importar para acessar os operadores do Sequelize
const { Op } = require('sequelize');

// importa o modulo de criptografia
const bcrypt = require('bcryptjs')

//importa o modulo de web token
const jwt = require('jsonwebtoken')

// Criar um novo usuário
exports.createusuario = async (req, res) => {
  console.log('createusuario');
  const { nome, email, senha} = req.body;
  console.log('Createusuario.Nome'+nome);
  console.log('createusuario.email'+email);
  
  try {
    const hashedPassword = getHashedPassword(senha);
    const novoUsuario = await Usuario.create({ nome, email , senha:hashedPassword});
    res.status(201).json(novoUsuario);
  } catch (err) {
    console.log("Erro ao criar usuário");
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};

// Obter todos os usuários
exports.getusuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.status(200).json(usuarios);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao obter usuários' });
  }
};

// Atualizar um usuário
exports.updateusuario = async (req, res) => {
  const { id } = req.params;
  const { nome, email} = req.body;
  console.log("updateusuario id:"+id+" - nome:"+nome+" - email:"+email) 
  try {
    const usuario = await Usuario.findByPk(id);
    if (usuario) {
      usuario.nome = nome;
      usuario.email = email;
      usuario.updatedAt = new Date();
      await usuario.save();
      res.status(200).json(usuario);
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
};



// buscar por ID do usuário
exports.buscarId = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findByPk(id);

    if (usuario) {
      res.status(200).json(usuario);
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar o usuário' });
  }
};


// buscar por nome de usuário
exports.buscarUsuarioPorNome = async (req, res) => {
  const {nome} = req.params;
  try {
    const usuario = await Usuario.findAll({ where: { nome: {  [Op.like]: `%${nome}%` } } });

    if (usuario) {
      res.status(200).json(usuario);
    } else {
      res.status(404).json({ error: 'Nenhum nome de usuário não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar o por nome usuário' });
  }
};



// Deletar um usuário
exports.deleteusuario = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findByPk(id);
    if (usuario) {
      await usuario.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
};


function getHashedPassword(senha) {
  console.log('getHashedPassword');
  //valor 10 do custo para gerar o hash
  const salt = bcrypt.genSaltSync(10);
  const hashedPassaword = bcrypt.hashSync(senha , salt);
  console.log('getHashedPassword.hashedPassword:' , hashedPassaword);
  return hashedPassaword;
}



// efetuar o login do usuario
 exports.login = async (req, res) => {

  const {email , senha } = req.body;

  console.log('login', email);
  try {
    const usuario = await Usuario.findAll({ where: {email }});
    console.log('Usuario....:',usuario);
    if (usuario===null) {
      return res.status(400).send('dados incorretos - cod 001');
    }
    else{
      console.log('Usuario nao encontrado:', usuario.email);
      const isPasswordValid = bcrypt.compareSync(senha, usuario.senha);

      if (!isPasswordValid) {
        console.log('dados incorretos - cod 002');
        return res.status(400).send('dados incorretos!');
      }
      const token = jwt.sign({ usuarioId: usuario.id}, process.env.JWT_KEY);
      res.send({token});
    }
  }
  catch (err) {

    console.log('erro no login', err);
      res.status(400).send('error no login:' + err.mensage);
  }
 };