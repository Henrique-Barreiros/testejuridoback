const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const clienteRoutes = require('./src/routes/clienteRoutes');
const ClienteService = require('./src/services/clienteService');

const app = express();
const port = 3010;

app.use(bodyParser.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'caixa1',
  port: 5432,
  sslmode: 'prefer',
  connect_timeout: 10,
});

const clienteServiceInstance = new ClienteService(pool);
clienteServiceInstance.iniciar();

app.use('/clientes', clienteRoutes(clienteServiceInstance));

pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('Erro ao conectar ao PostgreSQL:', err);
  } else {
    console.log('Conexão ao PostgreSQL bem-sucedida. Resultado:', result.rows);
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
