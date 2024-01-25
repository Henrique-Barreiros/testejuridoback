class Cliente {
  constructor({ id, nome, email, telefone, x, y }) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.telefone = telefone;
    this.x = x;
    this.y = y;
  }
}

module.exports = Cliente;