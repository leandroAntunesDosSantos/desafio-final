const jwt = require("jsonwebtoken");
const bcript = require("bcrypt");
const knex = require("../database/databaseConexao");
const hash = process.env.HASH;

const login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const usuario = await knex("usuarios").where("email", email).first();

    if (!usuario) {
      return res.status(404).json({
        mensagem: "O usuario não foi encontrado",
      });
    }
    const senhaCorreta = await bcript.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(400).json({
        mensagem: "Email e senha não confere",
      });
    }
    const token = jwt.sign({ id: usuario.id }, hash, { expiresIn: "8h" });

    const { senha: _, ...dadosUsuario } = usuario;
    return res.status(200).json({
      usuario: dadosUsuario,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro interno do servidor",
    });
  }
};

module.exports = {
  login,
};
