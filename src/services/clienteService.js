const { Pool } = require('pg');
const Cliente = require('../models/clienteModel');

class ClienteService {
  constructor(pool) {
    this.pool = pool;
  }

  async iniciar() {
    const client = await this.pool.connect();

    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS clientes (
          id SERIAL PRIMARY KEY,
          nome VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          telefone VARCHAR(20) NOT NULL,
          x FLOAT,
          y FLOAT,
          distancia FLOAT
        )
      `);
    } finally {
      client.release();
    }
  }

  async registrarCliente({ nome, email, telefone, x, y }) {
    const client = await this.pool.connect();
  
    try {
      console.log('Valores recebidos:', nome, email, telefone, x, y);

      const xFinal = x || 0;
      const yFinal = y || 0;

      const distancia = this.calcularDistancia(0, 0, xFinal, yFinal);

      const result = await client.query(
        'INSERT INTO clientes (nome, email, telefone, x, y, distancia) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [nome, email, telefone, xFinal, yFinal, distancia]
      );

      // Adicionando log para depuração
      console.log('Cliente registrado:', result.rows[0]);

      return new Cliente(result.rows[0]);
    } catch (error) {
      console.error('Erro ao registrar cliente:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async listarClientes() {
    const client = await this.pool.connect();

    try {
      const result = await client.query('SELECT * FROM clientes');
      return result.rows.map(row => new Cliente(row));
    } finally {
      client.release();
    }
  }

  calcularDistancia(x1, y1, x2, y2) {
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    return Math.sqrt(deltaX ** 2 + deltaY ** 2);
  }
}

module.exports = ClienteService;
