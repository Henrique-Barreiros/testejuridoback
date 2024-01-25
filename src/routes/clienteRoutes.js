const express = require('express');
const ClienteService = require('../services/clienteService');

const router = express.Router();

module.exports = (clienteService) => {
  router.post('/registrar', async (req, res) => {
    const { nome, email, telefone } = req.body;

    if (!nome || !email || !telefone) {
      return res.status(400).json({ mensagem: 'Por favor, forneça nome, email e telefone.' });
    }

    try {
      const novoCliente = await clienteService.registrarCliente({ nome, email, telefone });
      return res.status(201).json(novoCliente);
    } catch (error) {
      console.error('Erro ao registrar cliente:', error);
      return res.status(500).json({ erro: 'Erro ao registrar cliente' });
    }
  });

  router.get('/listar', async (req, res) => {
    try {
      const clientes = await clienteService.listarClientes();
      return res.json(clientes);
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      return res.status(500).json({ erro: 'Erro ao listar clientes' });
    }
  });

  return router;
};
