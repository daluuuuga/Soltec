const express = require('express');
const request = require('request');
const path = require('path');
const app = express();
const cors = require('cors');

const PDFDocument = require('pdfkit');


app.use(express.static(path.join(__dirname, 'paginas')));
app.use(cors());
const port = 3000;
app.get('/ordens', (req, res) => {
  function fetchPage(page) {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'GET',
        url: `https://api.gestaoclick.com/ordens_servicos?page=${page}`,
        headers: {
          'Content-Type': 'application/json',
          'access-token': 'bf8388411ae3f29922f51a5c1faeaa7f6f94f8f3',
          'secret-access-token': '01ee10e2ce0e8c75e4a89a8c0b9615946105e890'
        }
      };

      request(options, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          const responseBody = JSON.parse(body);
          const orders = responseBody.data;
      
          const data = orders.map(order => {
            const equipamento = order.equipamentos.length > 0 ? order.equipamentos[0].equipamento : null;
            return {
              codigo: order.codigo,
              nome_cliente: order.nome_cliente,
              id_cliente:order.cliente_id,
              nome_situacao: order.nome_situacao,
              nome_equipamento: equipamento ? equipamento.equipamento : 'Não especificado',
              acessorios_equipamento: equipamento ? equipamento.acessorios : 'Não especificado',
              marca_equipamento: equipamento ? equipamento.marca : 'Não especificado',
              modelo_equipamento:order.equipamento ? equipamento.modelo : 'Não especificado',
              num_serie_equipamento:order.equipamento ? equipamento.serie : 'Não especificado',
              nome_tecnico: order.nome_tecnico || 'Não especificado',
              data_entrada: order.data_entrada,
              data_saida: order.data_saida || 'Não possui data de saída',
              servicos: order.servicos,
              observacoes_internas: order.observacoes_interna
            };
          });

          resolve(data);
        } else {
          reject(`Erro ao obter os dados da página ${page}`);
        }
      });
    });
  }

  const allData = [];

  async function fetchAllPages() {
    try {
      for (let page = 1; page < 3; page++) {
        const data = await fetchPage(page);
        allData.push(...data);
      }

      res.json(allData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao obter os dados da API.' });
    }
  }

  fetchAllPages();
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'paginas', 'listar.html'));
});




app.get('/termos', (req, res) => {
  res.sendFile(path.join(__dirname, 'paginas', 'documentos.html'));
});

app.get('/calendario/italo', (req, res) => {
  res.sendFile(path.join(__dirname, 'paginas', 'calendarioItalo.html'));
});
app.get('/calendario/tiago', (req, res) => {
  res.sendFile(path.join(__dirname, 'paginas', 'calendarioTiago.html'));
});

app.get('/calendario/heitor', (req, res) => {
  res.sendFile(path.join(__dirname, 'paginas', 'calendarioHeitor.html'));
});

app.get('/documento/create/termo/entrega/notebook', (req, res) => {
  res.sendFile(path.join(__dirname, 'paginas/GerarDocumentos', 'EntregaNotebook.html'));
});

app.get('/documento/create/termo/entrega/Desktop', (req, res) => {
  res.sendFile(path.join(__dirname, 'paginas/GerarDocumentos', 'EntregaDesktop.html'));
});

app.get('/documento/create/termo/entrega/semServico', (req, res) => {
  res.sendFile(path.join(__dirname, 'paginas/GerarDocumentos', 'EntregaEquipamentoSemServico.html'));
});

app.get('/documento/create/termo/entrega/console', (req, res) => {
  res.sendFile(path.join(__dirname, 'paginas/GerarDocumentos', 'EntregaConsole.html'));
});

app.get('/documento/create/termo/entrega/carregador', (req, res) => {
  res.sendFile(path.join(__dirname, 'paginas/GerarDocumentos', 'EntregaCarregador.html'));
});

app.get('/documento/create/termo/entrega/controle', (req, res) => {
  res.sendFile(path.join(__dirname, 'paginas/GerarDocumentos', 'EntregaControle.html'));
});

app.get('/documento/create/termo/entrega/impressora', (req, res) => {
  res.sendFile(path.join(__dirname, 'paginas/GerarDocumentos', 'entregaImpressora.html'));
});

app.get('/documento/create/termo/entrouLiquido', (req, res) => {
  res.sendFile(path.join(__dirname, 'paginas/GerarDocumentos', 'EntrouLiquido.html'));
});

app.get('/documento/create/termo/naoLiga', (req, res) => {
  res.sendFile(path.join(__dirname, 'paginas/GerarDocumentos', 'EquipamentoNaoLiga.html'));
});

app.get('/documento/create/termo/naoQueroEsperar', (req, res) => {
  res.sendFile(path.join(__dirname, 'paginas/GerarDocumentos', 'NaoQuerEsperar.html'));
});

app.get('/documento/create/termo/telaNaoLiga', (req, res) => {
  res.sendFile(path.join(__dirname, 'paginas/GerarDocumentos', 'TelaNaoLiga.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});

app.get('/gerar-termo/entrega/carregador', (req, res) => {
  const osId = req.query.osId;  // Obtém o código da OS enviado no formulário

  // Função para pegar todas as OS
  function fetchPage(page) {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'GET',
        url: `https://api.gestaoclick.com/ordens_servicos?page=${page}`,
        headers: {
          'Content-Type': 'application/json',
          'access-token': 'bf8388411ae3f29922f51a5c1faeaa7f6f94f8f3',
          'secret-access-token': '01ee10e2ce0e8c75e4a89a8c0b9615946105e890'
        }
      };

      request(options, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          const responseBody = JSON.parse(body);
          const orders = responseBody.data;
          resolve(orders);
        } else {
          reject(`Erro ao obter os dados da página ${page}`);
        }
      });
    });
  }

  const allData = [];

  async function fetchAllPages() {
    try {
      // Pega as OS das duas primeiras páginas
      for (let page = 1; page < 3; page++) {
        const data = await fetchPage(page);
        allData.push(...data);
      }

      // Filtra a OS com base no código enviado
      const selectedOrder = allData.find(order => order.codigo === osId);
      console.log(selectedOrder.equipamentos)
      if (selectedOrder) {
        // Constrói o objeto do termo de responsabilidade com os dados da OS
        // Gera o termo de responsabilidade como PDF
        console.log(selectedOrder)
        termoDeEntregaCarregador(selectedOrder, res);
      } else {
        res.status(404).json({ message: 'Ordem de serviço não encontrada.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao obter os dados da API.' });
    }
  }

  fetchAllPages();
});

app.get('/gerar-termo/entrega/notebook', (req, res) => {
  const osId = req.query.osId;  // Obtém o código da OS enviado no formulário

  // Função para pegar todas as OS
  function fetchPage(page) {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'GET',
        url: `https://api.gestaoclick.com/ordens_servicos?page=${page}`,
        headers: {
          'Content-Type': 'application/json',
          'access-token': 'bf8388411ae3f29922f51a5c1faeaa7f6f94f8f3',
          'secret-access-token': '01ee10e2ce0e8c75e4a89a8c0b9615946105e890'
        }
      };

      request(options, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          const responseBody = JSON.parse(body);
          const orders = responseBody.data;
          resolve(orders);
        } else {
          reject(`Erro ao obter os dados da página ${page}`);
        }
      });
    });
  }

  const allData = [];

  async function fetchAllPages() {
    try {
      // Pega as OS das duas primeiras páginas
      for (let page = 1; page < 3; page++) {
        const data = await fetchPage(page);
        allData.push(...data);
      }

      // Filtra a OS com base no código enviado
      const selectedOrder = allData.find(order => order.codigo === osId);
      console.log(selectedOrder.equipamentos)
      if (selectedOrder) {
        // Constrói o objeto do termo de responsabilidade com os dados da OS
        // Gera o termo de responsabilidade como PDF
        console.log(selectedOrder)
        termoDeEntregaNotebook(selectedOrder, res);
      } else {
        res.status(404).json({ message: 'Ordem de serviço não encontrada.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao obter os dados da API.' });
    }
  }

  fetchAllPages();
});

app.get('/gerar-termo/telaNaoLiga', (req, res) => {
  const osId = req.query.osId;  // Obtém o código da OS enviado no formulário

  // Função para pegar todas as OS
  function fetchPage(page) {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'GET',
        url: `https://api.gestaoclick.com/ordens_servicos?page=${page}`,
        headers: {
          'Content-Type': 'application/json',
          'access-token': 'bf8388411ae3f29922f51a5c1faeaa7f6f94f8f3',
          'secret-access-token': '01ee10e2ce0e8c75e4a89a8c0b9615946105e890'
        }
      };

      request(options, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          const responseBody = JSON.parse(body);
          const orders = responseBody.data;
          resolve(orders);
        } else {
          reject(`Erro ao obter os dados da página ${page}`);
        }
      });
    });
  }

  const allData = [];

  async function fetchAllPages() {
    try {
      // Pega as OS das duas primeiras páginas
      for (let page = 1; page < 3; page++) {
        const data = await fetchPage(page);
        allData.push(...data);
      }

      // Filtra a OS com base no código enviado
      const selectedOrder = allData.find(order => order.codigo === osId);
      console.log(selectedOrder.equipamentos)
      if (selectedOrder) {
        // Constrói o objeto do termo de responsabilidade com os dados da OS
        // Gera o termo de responsabilidade como PDF
        console.log(selectedOrder)
        termoTelaNaoLiga  (selectedOrder, res);
      } else {
        res.status(404).json({ message: 'Ordem de serviço não encontrada.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao obter os dados da API.' });
    }
  }

  fetchAllPages();
});

app.get('/gerar-termo/entrega/Desktop', (req, res) => {
  const osId = req.query.osId;  // Obtém o código da OS enviado no formulário

  // Função para pegar todas as OS
  function fetchPage(page) {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'GET',
        url: `https://api.gestaoclick.com/ordens_servicos?page=${page}`,
        headers: {
          'Content-Type': 'application/json',
          'access-token': 'bf8388411ae3f29922f51a5c1faeaa7f6f94f8f3',
          'secret-access-token': '01ee10e2ce0e8c75e4a89a8c0b9615946105e890'
        }
      };

      request(options, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          const responseBody = JSON.parse(body);
          const orders = responseBody.data;
          resolve(orders);
        } else {
          reject(`Erro ao obter os dados da página ${page}`);
        }
      });
    });
  }

  const allData = [];

  async function fetchAllPages() {
    try {
      // Pega as OS das duas primeiras páginas
      for (let page = 1; page < 3; page++) {
        const data = await fetchPage(page);
        allData.push(...data);
      }

      // Filtra a OS com base no código enviado
      const selectedOrder = allData.find(order => order.codigo === osId);
      console.log(selectedOrder.equipamentos)
      if (selectedOrder) {
        // Constrói o objeto do termo de responsabilidade com os dados da OS
        // Gera o termo de responsabilidade como PDF
        console.log(selectedOrder)
        termoDeEntregaDesktop(selectedOrder, res);
      } else {
        res.status(404).json({ message: 'Ordem de serviço não encontrada.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao obter os dados da API.' });
    }
  }

  fetchAllPages();
});

app.get('/gerar-termo/entrouLiquido', (req, res) => {
  const osId = req.query.osId;  // Obtém o código da OS enviado no formulário

  // Função para pegar todas as OS
  function fetchPage(page) {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'GET',
        url: `https://api.gestaoclick.com/ordens_servicos?page=${page}`,
        headers: {
          'Content-Type': 'application/json',
          'access-token': 'bf8388411ae3f29922f51a5c1faeaa7f6f94f8f3',
          'secret-access-token': '01ee10e2ce0e8c75e4a89a8c0b9615946105e890'
        }
      };

      request(options, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          const responseBody = JSON.parse(body);
          const orders = responseBody.data;
          resolve(orders);
        } else {
          reject(`Erro ao obter os dados da página ${page}`);
        }
      });
    });
  }

  const allData = [];

  async function fetchAllPages() {
    try {
      // Pega as OS das duas primeiras páginas
      for (let page = 1; page < 3; page++) {
        const data = await fetchPage(page);
        allData.push(...data);
      }

      // Filtra a OS com base no código enviado
      const selectedOrder = allData.find(order => order.codigo === osId);
      console.log(selectedOrder.equipamentos)
      if (selectedOrder) {
        // Constrói o objeto do termo de responsabilidade com os dados da OS
        // Gera o termo de responsabilidade como PDF
        console.log(selectedOrder)
        termoDeEntrouLiquido(selectedOrder, res);
      } else {
        res.status(404).json({ message: 'Ordem de serviço não encontrada.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao obter os dados da API.' });
    }
  }

  fetchAllPages();
});





app.get('/gerar-termo/naoQuerEsperar', (req, res) => {
  const osId = req.query.osId;  // Obtém o código da OS enviado no formulário

  // Função para pegar todas as OS
  function fetchPage(page) {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'GET',
        url: `https://api.gestaoclick.com/ordens_servicos?page=${page}`,
        headers: {
          'Content-Type': 'application/json',
          'access-token': 'bf8388411ae3f29922f51a5c1faeaa7f6f94f8f3',
          'secret-access-token': '01ee10e2ce0e8c75e4a89a8c0b9615946105e890'
        }
      };

      request(options, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          const responseBody = JSON.parse(body);
          const orders = responseBody.data;
          resolve(orders);
        } else {
          reject(`Erro ao obter os dados da página ${page}`);
        }
      });
    });
  }

  const allData = [];

  async function fetchAllPages() {
    try {
      // Pega as OS das duas primeiras páginas
      for (let page = 1; page < 3; page++) {
        const data = await fetchPage(page);
        allData.push(...data);
      }

      // Filtra a OS com base no código enviado
      const selectedOrder = allData.find(order => order.codigo === osId);
      if (selectedOrder) {
        // Constrói o objeto do termo de responsabilidade com os dados da OS
        // Gera o termo de responsabilidade como PDF
        console.log(selectedOrder)
        termoNaoQueroEsperar(selectedOrder, res);
      } else {
        res.status(404).json({ message: 'Ordem de serviço não encontrada.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao obter os dados da API.' });
    }
  }

  fetchAllPages();
});


app.get('/gerar-termo/naoLiga', (req, res) => {
  const osId = req.query.osId;  // Obtém o código da OS enviado no formulário

  // Função para pegar todas as OS
  function fetchPage(page) {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'GET',
        url: `https://api.gestaoclick.com/ordens_servicos?page=${page}`,
        headers: {
          'Content-Type': 'application/json',
          'access-token': 'bf8388411ae3f29922f51a5c1faeaa7f6f94f8f3',
          'secret-access-token': '01ee10e2ce0e8c75e4a89a8c0b9615946105e890'
        }
      };

      request(options, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          const responseBody = JSON.parse(body);
          const orders = responseBody.data;
          resolve(orders);
        } else {
          reject(`Erro ao obter os dados da página ${page}`);
        }
      });
    });
  }

  const allData = [];

  async function fetchAllPages() {
    try {
      // Pega as OS das duas primeiras páginas
      for (let page = 1; page < 3; page++) {
        const data = await fetchPage(page);
        allData.push(...data);
      }

      // Filtra a OS com base no código enviado
      const selectedOrder = allData.find(order => order.codigo === osId);
      if (selectedOrder) {
        // Constrói o objeto do termo de responsabilidade com os dados da OS
        // Gera o termo de responsabilidade como PDF
        console.log(selectedOrder)
        termoDeEntregaEquipamentoNaoLiga(selectedOrder, res);
      } else {
        res.status(404).json({ message: 'Ordem de serviço não encontrada.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao obter os dados da API.' });
    }
  }

  fetchAllPages();
});

app.get('/gerar-termo/entregaControle', (req, res) => {
  const osId = req.query.osId;  // Obtém o código da OS enviado no formulário

  // Função para pegar todas as OS
  function fetchPage(page) {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'GET',
        url: `https://api.gestaoclick.com/ordens_servicos?page=${page}`,
        headers: {
          'Content-Type': 'application/json',
          'access-token': 'bf8388411ae3f29922f51a5c1faeaa7f6f94f8f3',
          'secret-access-token': '01ee10e2ce0e8c75e4a89a8c0b9615946105e890'
        }
      };

      request(options, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          const responseBody = JSON.parse(body);
          const orders = responseBody.data;
          resolve(orders);
        } else {
          reject(`Erro ao obter os dados da página ${page}`);
        }
      });
    });
  }

  

  const allData = [];

  async function fetchAllPages() {
    try {
      // Pega as OS das duas primeiras páginas
      for (let page = 1; page < 3; page++) {
        const data = await fetchPage(page);
        allData.push(...data);
      }

      // Filtra a OS com base no código enviado
      const selectedOrder = allData.find(order => order.codigo === osId);
      if (selectedOrder) {
        // Constrói o objeto do termo de responsabilidade com os dados da OS
        // Gera o termo de responsabilidade como PDF
        console.log(selectedOrder)
        termoDeEntregaControle(selectedOrder, res);
      } else {
        res.status(404).json({ message: 'Ordem de serviço não encontrada.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao obter os dados da API.' });
    }
  }

  fetchAllPages();
});

app.get('/gerar-termo/entregaConsole', (req, res) => {
  const osId = req.query.osId;  // Obtém o código da OS enviado no formulário

  // Função para pegar todas as OS
  function fetchPage(page) {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'GET',
        url: `https://api.gestaoclick.com/ordens_servicos?page=${page}`,
        headers: {
          'Content-Type': 'application/json',
          'access-token': 'bf8388411ae3f29922f51a5c1faeaa7f6f94f8f3',
          'secret-access-token': '01ee10e2ce0e8c75e4a89a8c0b9615946105e890'
        }
      };

      request(options, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          const responseBody = JSON.parse(body);
          const orders = responseBody.data;
          resolve(orders);
        } else {
          reject(`Erro ao obter os dados da página ${page}`);
        }
      });
    });
  }

  

  const allData = [];

  async function fetchAllPages() {
    try {
      // Pega as OS das duas primeiras páginas
      for (let page = 1; page < 3; page++) {
        const data = await fetchPage(page);
        allData.push(...data);
      }

      // Filtra a OS com base no código enviado
      const selectedOrder = allData.find(order => order.codigo === osId);
      if (selectedOrder) {
        // Constrói o objeto do termo de responsabilidade com os dados da OS
        // Gera o termo de responsabilidade como PDF
        console.log(selectedOrder)
        termoDeEntregaConsole(selectedOrder, res);
      } else {
        res.status(404).json({ message: 'Ordem de serviço não encontrada.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao obter os dados da API.' });
    }
  }

  fetchAllPages();
});

app.get('/gerar-termo/entrega/semServico', (req, res) => {
  const osId = req.query.osId;  // Obtém o código da OS enviado no formulário

  // Função para pegar todas as OS
  function fetchPage(page) {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'GET',
        url: `https://api.gestaoclick.com/ordens_servicos?page=${page}`,
        headers: {
          'Content-Type': 'application/json',
          'access-token': 'bf8388411ae3f29922f51a5c1faeaa7f6f94f8f3',
          'secret-access-token': '01ee10e2ce0e8c75e4a89a8c0b9615946105e890'
        }
      };

      request(options, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          const responseBody = JSON.parse(body);
          const orders = responseBody.data;
          resolve(orders);
        } else {
          reject(`Erro ao obter os dados da página ${page}`);
        }
      });
    });
  }

  

  const allData = [];

  async function fetchAllPages() {
    try {
      // Pega as OS das duas primeiras páginas
      for (let page = 1; page < 3; page++) {
        const data = await fetchPage(page);
        allData.push(...data);
      }

      // Filtra a OS com base no código enviado
      const selectedOrder = allData.find(order => order.codigo === osId);
      if (selectedOrder) {
        // Constrói o objeto do termo de responsabilidade com os dados da OS
        // Gera o termo de responsabilidade como PDF
        console.log(selectedOrder)
        termoDeEntregaEquipamentoSemServico(selectedOrder, res);
      } else {
        res.status(404).json({ message: 'Ordem de serviço não encontrada.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao obter os dados da API.' });
    }
  }

  fetchAllPages();
});

app.get('/gerar-termo/entregaImpressora', (req, res) => {
  const osId = req.query.osId;  // Obtém o código da OS enviado no formulário

  // Função para pegar todas as OS
  function fetchPage(page) {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'GET',
        url: `https://api.gestaoclick.com/ordens_servicos?page=${page}`,
        headers: {
          'Content-Type': 'application/json',
          'access-token': 'bf8388411ae3f29922f51a5c1faeaa7f6f94f8f3',
          'secret-access-token': '01ee10e2ce0e8c75e4a89a8c0b9615946105e890'
        }
      };

      request(options, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          const responseBody = JSON.parse(body);
          const orders = responseBody.data;
          resolve(orders);
        } else {
          reject(`Erro ao obter os dados da página ${page}`);
        }
      });
    });
  }

  

  const allData = [];

  async function fetchAllPages() {
    try {
      // Pega as OS das duas primeiras páginas
      for (let page = 1; page < 3; page++) {
        const data = await fetchPage(page);
        allData.push(...data);
      }

      // Filtra a OS com base no código enviado
      const selectedOrder = allData.find(order => order.codigo === osId);
      if (selectedOrder) {
        // Constrói o objeto do termo de responsabilidade com os dados da OS
        // Gera o termo de responsabilidade como PDF
        console.log(selectedOrder)
        termoDeEntregaImpressora(selectedOrder, res);
      } else {
        res.status(404).json({ message: 'Ordem de serviço não encontrada.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao obter os dados da API.' });
    }
  }

  fetchAllPages();
});


function termoDeEntregaNotebook(object, res) {//OKK!!!!!
  let dataHoje = new Date();
  const doc = new PDFDocument({size: 'A4'});
  const pageWidth = doc.page.width - 30;
  // Definir o arquivo de saída para o cliente como "attachment" (força download)
  res.setHeader('Content-disposition', "attachment; filename=termo_responsabilidade_ " +object.nome_cliente+".pdf");
  res.setHeader('Content-type', 'application/pdf');
  doc.pipe(res);  // Enviar o documento diretamente na resposta
  doc.image('./paginas/img/topo.jpeg', 0, 0, { width: pageWidth }); // A imagem começa no topo e ocupa toda a largura
  
  doc.text(' ');
  doc.fontSize(14).text('DADOS DA ORDEM DE SERVIÇO: ');
  doc.text(`Cliente: ${object.nome_cliente}`);
  doc.text(`Número da OS : #${object.codigo}`);
  doc.text(`Tipo de Equipamento: ${object.equipamentos[0].equipamento.equipamento}`);
  doc.text(`Marca: ${object.equipamentos[0].equipamento.marca}`);
  doc.text(`Modelo: ${object.equipamentos[0].equipamento.modelo}`);
  doc.text(`Número de Série: ${object.equipamentos[0].equipamento.serie || 'Não possui número de série'}`);

  doc.text(' ');
  doc.fontSize(14).text('Condições do Equipamento:');
  doc.fontSize(12).text('Atesto que o equipamento foi entregue em perfeitas condições de uso, estando livre de danos extras, como arranhões, manchas ou listras na tela, partes quebradas, peças faltantes ou qualquer outra falha que possa comprometer seu funcionamento adequado.');

  doc.text(' ');
  doc.fontSize(14).text('Funcionalidades Verificadas:');
  doc.fontSize(12).text('Declaro ter verificado todas as funcionalidades do equipamento e que todas estão operando corretamente. Isso inclui, mas não se limita a: liga/desliga, tela, teclado, câmera, microfone, conexão wifi, carregador, acessórios fornecidos, entre outros.');

  doc.text(' ');
  doc.fontSize(14).text('Responsabilidades:');
  doc.fontSize(12).text('Como receptor do equipamento, assumo total responsabilidade pela sua guarda e transporte. Qualquer dano causado ao equipamento devido ao transporte será de minha inteira responsabilidade.');

  doc.text(' ');
  doc.fontSize(14).text('Prazo de Garantia:');
  doc.fontSize(12).text(`Fui informado de que o(s) serviço(s) e/ou produto(s) possui um período de garantia conforme estabelecido pela ORDEM DE SERVIÇO Nº ${object.codigo} que recebi pelo WhatsApp. Caso ocorra qualquer problema durante o prazo de garantia, me comprometo a entrar em contato com a empresa SOLTEC para obter assistência técnica. Reconheço que caso algum do(s) serviço(s) ou produto(s) apresente problema(s) e eu não leve o equipamento até a empresa SOLTEC dentro do período da garantia, a empresa não tem o dever de prestar suporte fora do período da garantia, mesmo que tenha sido comunicada do acontecido dentro do período da garantia.`);


  doc.text(' ');
  doc.text(`Caicó, ${dataHoje.getDate()} de ${dataHoje.toLocaleString('default', { month: 'long' })} de ${dataHoje.getFullYear()}`);
  
  doc.text(' ');
  doc.text('Eu, __________________________________,');
  doc.text('sob o RG/CPF ______________________, declaro que li e aceito as condições contidas nesse documento.');


  doc.end();  

}

function termoDeEntregaCarregador(object, res) {//OKKKK!!!!!
  let dataHoje = new Date();
  const doc = new PDFDocument({size: 'A4'});
  const pageWidth = doc.page.width - 30;

  // Definir o arquivo de saída para o cliente como "attachment" (força download)
  res.setHeader('Content-disposition', "attachment; filename=termo_responsabilidade_" + object.nome_cliente + ".pdf");
  res.setHeader('Content-type', 'application/pdf');
  doc.pipe(res);  // Enviar o documento diretamente na resposta
  doc.image('./paginas/img/topo.jpeg', 0, 0, { width: pageWidth }); // A imagem começa no topo e ocupa toda a largura
  


  doc.text(' ');
  doc.text(' ');
  doc.fontSize(14).text('DADOS DA ORDEM DE SERVIÇO: ');
  doc.text(`Cliente: ${object.nome_cliente}`);
  doc.text(`Número da OS : #${object.codigo}`);
  doc.text(`Tipo de Equipamento: ${object.equipamentos[0].equipamento.equipamento}`);
  doc.text(`Marca: ${object.equipamentos[0].equipamento.marca}`);
  doc.text(`Modelo: ${object.equipamentos[0].equipamento.modelo}`);
  doc.text(`Número de Série: ${object.equipamentos[0].equipamento.serie || 'Não possui número de série'}`);

  doc.text(' ');
  doc.fontSize(14).text('Condições do Equipamento:');
  doc.fontSize(12).text('Atesto que o equipamento foi entregue em perfeitas condições de uso, estando livre de danos extras, como arranhões, manchas, partes quebradas, peças faltantes ou qualquer outra falha que possa comprometer seu funcionamento adequado.');

  doc.text(' ');
  doc.fontSize(14).text('Funcionalidades Verificadas:');
  doc.fontSize(12).text('Declaro ter verificado todas as funcionalidades do equipamento e que todas as tensões estão sendo fornecidas corretamente.');

  doc.text(' ');
  doc.fontSize(14).text('Responsabilidades:');
  doc.fontSize(12).text('Como receptor do equipamento, assumo total responsabilidade pela sua guarda e transporte. Qualquer dano causado ao equipamento devido ao transporte será de minha inteira responsabilidade.');

  doc.text(' ');
  doc.fontSize(14).text('Prazo de Garantia:');
  doc.fontSize(12).text(`Fui informado de que o(s) serviço(s) e/ou produto(s) possui um período de garantia conforme estabelecido pela ORDEM DE SERVIÇO Nº ${object.codigo} que recebi pelo WhatsApp. Caso ocorra qualquer problema durante o prazo de garantia, me comprometo a entrar em contato com a empresa SOLTEC para obter assistência técnica. Reconheço que caso algum do(s) serviço(s) ou produto(s) apresente problema(s) e eu não leve o equipamento até a empresa SOLTEC dentro do período da garantia, a empresa não tem o dever de prestar suporte fora do período da garantia, mesmo que tenha sido comunicada do acontecido dentro do período da garantia.`);

  doc.text(' ');
  doc.text(`Caicó, ${dataHoje.getDate()} de ${dataHoje.toLocaleString('default', { month: 'long' })} de ${dataHoje.getFullYear()}`);
  
  doc.text(' ');
  doc.text('Eu, __________________________________,');
  doc.text('sob o RG/CPF ______________________, declaro que li e aceito as condições contidas nesse documento.');


  doc.end();  
}


function termoDeEntregaConsole(object, res){//OKKK!!!!!!
    let dataHoje = new Date();
    const doc = new PDFDocument({size: 'A4'});
    const pageWidth = doc.page.width - 30;
    
    // Definir o arquivo de saída para o cliente como "attachment" (força download)
    res.setHeader('Content-disposition', "attachment; filename=termo_responsabilidade_" + object.nome_cliente + ".pdf");
    res.setHeader('Content-type', 'application/pdf');
    doc.pipe(res);  // Enviar o documento diretamente na resposta
    doc.image('./paginas/img/topo.jpeg', 0, 0, { width: pageWidth }); // A imagem começa no topo e ocupa toda a largura
    
  
    doc.text(' ');
    doc.text(' ');
    doc.fontSize(14).text('DADOS DA ORDEM DE SERVIÇO: ');
    doc.text(`Cliente: ${object.nome_cliente}`);
    doc.text(`Número da OS : #${object.codigo}`);
    doc.text(`Tipo de Equipamento: ${object.equipamentos[0].equipamento.equipamento}`);
    doc.text(`Marca: ${object.equipamentos[0].equipamento.marca}`);
    doc.text(`Modelo: ${object.equipamentos[0].equipamento.modelo}`);
    doc.text(`Número de Série: ${object.equipamentos[0].equipamento.serie || 'Não possui número de série'}`);
  
    doc.text(' ');
    doc.fontSize(14).text('Condições do Equipamento:');
    doc.fontSize(12).text('Atesto que o equipamento foi entregue em perfeitas condições de uso, estando livre de danos extras, como arranhões, manchas, partes quebradas, peças faltantes ou qualquer outra falha que possa comprometer seu funcionamento adequado.');
  
    doc.text(' ');
    doc.fontSize(14).text('Funcionalidades Verificadas:');
    doc.fontSize(12).text('Declaro ter verificado todas as funcionalidades do equipamento e que todas estão operando corretamente. Isso inclui, mas não se limita a: liga/desliga, entrada USB, HDMI, entrada de rede, conexão Wi-Fi, acessórios fornecidos, entre outros.');
  
    doc.text(' ');
    doc.fontSize(14).text('Responsabilidades:');
    doc.fontSize(12).text('Como receptor do equipamento, assumo total responsabilidade pela sua guarda e transporte. Qualquer dano causado ao equipamento devido ao transporte será de minha inteira responsabilidade.');
  
    doc.text(' ');
    doc.fontSize(14).text('Prazo de Garantia:');
    doc.fontSize(12).text(`Fui informado de que o(s) serviço(s) e/ou produto(s) possui um período de garantia conforme estabelecido pela ORDEM DE SERVIÇO Nº ${object.codigo} que recebi pelo WhatsApp. Caso ocorra qualquer problema durante o prazo de garantia, me comprometo a entrar em contato com a empresa SOLTEC para obter assistência técnica. Reconheço que caso algum do(s) serviço(s) ou produto(s) apresente problema(s) e eu não leve o equipamento até a empresa SOLTEC dentro do período da garantia, a empresa não tem o dever de prestar suporte fora do período da garantia, mesmo que tenha sido comunicada do acontecido dentro do período da garantia.`);

  
    doc.text(' ');
    doc.text(`Caicó, ${dataHoje.getDate()} de ${dataHoje.toLocaleString('default', { month: 'long' })} de ${dataHoje.getFullYear()}`);
    
    doc.text(' ');
    doc.text('Eu, __________________________________,');
    doc.text('sob o RG/CPF ______________________, declaro que li e aceito as condições contidas nesse documento.');

  
    doc.end();  
  }
  
function termoDeEntregaControle(object, res) {//OK!!!!!
  let dataHoje = new Date();
  const doc = new PDFDocument({size: 'A4'});
  const pageWidth = doc.page.width - 30;
  
  // Definir o arquivo de saída para o cliente como "attachment" (força download)
  res.setHeader('Content-disposition', "attachment; filename=termo_responsabilidade_" + object.nome_cliente + ".pdf");
  res.setHeader('Content-type', 'application/pdf');
  doc.pipe(res);  // Enviar o documento diretamente na resposta
  doc.image('./paginas/img/topo.jpeg', 0, 0, { width: pageWidth }); // A imagem começa no topo e ocupa toda a largura
  

  doc.text(' ');
  doc.text(' ');
  doc.fontSize(14).text('DADOS DA ORDEM DE SERVIÇO: ');
  doc.text(`Cliente: ${object.nome_cliente}`);
  doc.text(`Número da OS : #${object.codigo}`);
  doc.text(`Tipo de Equipamento: ${object.equipamentos[0].equipamento.equipamento}`);
  doc.text(`Marca: ${object.equipamentos[0].equipamento.marca}`);
  doc.text(`Modelo: ${object.equipamentos[0].equipamento.modelo}`);
  doc.text(`Número de Série: ${object.equipamentos[0].equipamento.serie || 'Não possui número de série'}`);

  doc.text(' ');
  doc.fontSize(14).text('Condições do Equipamento:');
  doc.fontSize(12).text('Atesto que o equipamento foi entregue em perfeitas condições de uso, estando livre de danos extras, como arranhões, partes quebradas, peças faltantes ou qualquer outra falha que possa comprometer seu funcionamento adequado.');

  doc.text(' ');
  doc.fontSize(14).text('Funcionalidades Verificadas:');
  doc.fontSize(12).text('Declaro ter verificado todas as funcionalidades do equipamento e que todas estão operando corretamente. Isso inclui liga/desliga, todos os botões, analógico esquerdo e analógico direito, conector do cabo.');

  doc.text(' ');
  doc.fontSize(14).text('Responsabilidades:');
  doc.fontSize(12).text('Como receptor do equipamento, assumo total responsabilidade pela sua guarda e transporte. Qualquer dano causado ao equipamento devido ao transporte será de minha inteira responsabilidade.');

  doc.text(' ');
  doc.fontSize(14).text('Prazo de Garantia:');
  doc.fontSize(12).text(`Fui informado de que o(s) serviço(s) e/ou produto(s) possui um período de garantia conforme estabelecido pela ORDEM DE SERVIÇO Nº ${object.codigo} que recebi pelo WhatsApp. Caso ocorra qualquer problema durante o prazo de garantia, me comprometo a entrar em contato com a empresa SOLTEC para obter assistência técnica. Reconheço que caso algum do(s) serviço(s) ou produto(s) apresente problema(s) e eu não leve o equipamento até a empresa SOLTEC dentro do período da garantia, a empresa não tem o dever de prestar suporte fora do período da garantia, mesmo que tenha sido comunicada do acontecido dentro do período da garantia.`);



  doc.text(' ');
  doc.text(`Caicó, ${dataHoje.getDate()} de ${dataHoje.toLocaleString('default', { month: 'long' })} de ${dataHoje.getFullYear()}`);
  
  doc.text(' ');
  doc.text('Eu, __________________________________,');
  doc.text('sob o RG/CPF ______________________, declaro que li e aceito as condições contidas nesse documento.');


  doc.end();  
}

function termoDeEntregaImpressora(object, res) {//OKKKK!!!!!
  let dataHoje = new Date();
  const doc = new PDFDocument({size: 'A4'});
  const pageWidth = doc.page.width - 30;
  
  // Definir o arquivo de saída para o cliente como "attachment" (força download)
  res.setHeader('Content-disposition', "attachment; filename=termo_responsabilidade_" + object.nome_cliente + ".pdf");
  res.setHeader('Content-type', 'application/pdf');
  doc.pipe(res);  // Enviar o documento diretamente na resposta
  doc.image('./paginas/img/topo.jpeg', 0, 0, { width: pageWidth }); // A imagem começa no topo e ocupa toda a largura
  
 


  doc.text(' ');
  doc.text(' ');
  doc.fontSize(14).text('DADOS DA ORDEM DE SERVIÇO: ');
  doc.text(`Cliente: ${object.nome_cliente}`);
  doc.text(`Número da OS : #${object.codigo}`);
  doc.text(`Tipo de Equipamento: ${object.equipamentos[0].equipamento.equipamento}`);
  doc.text(`Marca: ${object.equipamentos[0].equipamento.marca}`);
  doc.text(`Modelo: ${object.equipamentos[0].equipamento.modelo}`);
  doc.text(`Número de Série: ${object.equipamentos[0].equipamento.serie || 'Não possui número de série'}`);

  doc.text(' ');
  doc.fontSize(14).text('Condições do Equipamento:');
  doc.fontSize(12).text('Atesto que o equipamento foi entregue em perfeitas condições de uso, estando livre de danos extras, como arranhões, partes quebradas, peças faltantes ou qualquer outra falha que possa comprometer seu funcionamento adequado.');

  doc.text(' ');
  doc.fontSize(14).text('Funcionalidades Verificadas:');
  doc.fontSize(12).text('Declaro ter verificado que as funcionalidades de ligar/desligar, puxar folha, imprimir e escanear estão operando corretamente. ');

  doc.text(' ');
  doc.fontSize(14).text('Responsabilidades:');
  doc.fontSize(12).text('Como receptor do equipamento, assumo total responsabilidade pela sua guarda e transporte. Qualquer dano causado ao equipamento devido ao transporte será de minha inteira responsabilidade.');

  doc.text(' ');
  doc.fontSize(14).text('Prazo de Garantia:');
  doc.fontSize(12).text(`Fui informado de que o(s) serviço(s) e/ou produto(s) possui um período de garantia conforme estabelecido pela ORDEM DE SERVIÇO Nº ${object.codigo} que recebi pelo WhatsApp. Caso ocorra qualquer problema durante o prazo de garantia, me comprometo a entrar em contato com a empresa SOLTEC para obter assistência técnica. Reconheço que caso algum do(s) serviço(s) ou produto(s) apresente problema(s) e eu não leve o equipamento até a empresa SOLTEC dentro do período da garantia, a empresa não tem o dever de prestar suporte fora do período da garantia, mesmo que tenha sido comunicada do acontecido dentro do período da garantia.`);


  doc.text(' ');
  doc.text(`Caicó, ${dataHoje.getDate()} de ${dataHoje.toLocaleString('default', { month: 'long' })} de ${dataHoje.getFullYear()}`);
  
  doc.text(' ');
  doc.text('Eu, __________________________________,');
  doc.text('sob o RG/CPF ______________________, declaro que li e aceito as condições contidas nesse documento.');


  doc.end();  
}


function termoDeEntrouLiquido(object, res) {//OKKKK!!!!!!
  let dataHoje = new Date();
  const doc = new PDFDocument({size: 'A4'});
  const pageWidth = doc.page.width - 30;
  // Definir o arquivo de saída para o cliente como "attachment" (força download)
  res.setHeader('Content-disposition', "attachment; filename=termo_responsabilidade_ " +object.nome_cliente+".pdf");
  res.setHeader('Content-type', 'application/pdf');
  doc.pipe(res);  // Enviar o documento diretamente na resposta
  doc.image('./paginas/img/topo.jpeg', 0, 0, { width: pageWidth }); // A imagem começa no topo e ocupa toda a largura

  doc.text(' ');
  doc.text(' ');
  doc.fontSize(14).text('DADOS DA ORDEM DE SERVIÇO: ');
  doc.text(`Cliente: ${object.nome_cliente}`);
  doc.text(`Número da OS : #${object.codigo}`);
  doc.text(`Tipo de Equipamento: ${object.equipamentos[0].equipamento.equipamento}`);
  doc.text(`Marca: ${object.equipamentos[0].equipamento.marca}`);
  doc.text(`Modelo: ${object.equipamentos[0].equipamento.modelo}`);
  doc.text(`Número de Série: ${object.equipamentos[0].equipamento.serie || 'Não possui número de série'}`);

  doc.text(' ');
  doc.fontSize(14).text('CONDIÇÕES PARA RECEBIMENTO DO EQUIPAMENTO');
  doc.fontSize(12).text('1.   A SOLTEC cobra uma taxa de R$ 70,00 reais para analisar o equipamento e fornecer o orçamento. Caso o cliente aprove o orçamento e contrate o serviço, a taxa de análise será dispensada (não será cobrada).');
  doc.text(' ');
  doc.fontSize(12).text(`2.   Como foi derramado líquido no equipamento, é aconselhavél que não ligue o mesmo devido existir o risco da placa entrar em curto, logo o CLIENTE se responsabiliza e isenta a SOLTEC sobre o estado e funcionamento de todas as funcionalidades e partes físicas do equipamento, visto que não é possível a realização dos testes iniciais no equipamento.`);
  doc.text(' ');
  doc.fontSize(12).text(`3. DA RETIRADA DO EQUIPAMENTO:
    3.1 - É obrigatório a apresentação de um documento de identificação. 
    3.2 - Caso a pessoa que venha retirar não seja o responsável pelo equipamento, é necessário que o responsável envie no whatsaap da SOLTEC (84996809447) o nome completo e número do RG/CPF de quem que vai retirar o equipamento, e esse, por sua vez, tem que cumprir o item 3.1.
    3.3 -   Após a SOLTEC comunicar a  finalização do serviço ao cliente, o mesmo tem 5 dias úteis para retirar o equipamento da assistência, após esse prazo, é cobrado uma taxa de R$ 5,00 reais por dia, para arcar com os custos de armazenamento!`);
  doc.fontSize(12).text(`4.  O cliente declara está ciente que com o orçamento não aprovado ou quando o equipamento não teve conserto, a SOLTEC pede o prazo de 48h úteis para fechar o equipamento e entregar ao cliente.  `);

  doc.text(' ');
  doc.text(`Caicó, ${dataHoje.getDate()} de ${dataHoje.toLocaleString('default', { month: 'long' })} de ${dataHoje.getFullYear()}`);
  
  doc.text(' ');
  doc.text('Eu, __________________________________,');
  doc.text('sob o RG/CPF ______________________, declaro que li e aceito as condições contidas nesse documento.');

  doc.text('');
  doc.text('Resposável SOLTEC: __________________________________');
  

  doc.end();  
}

function termoTelaNaoLiga(object, res) {//OKKKK!!!!!!
  let dataHoje = new Date();
  const doc = new PDFDocument({size: 'A4'});
  const pageWidth = doc.page.width - 30;
  // Definir o arquivo de saída para o cliente como "attachment" (força download)
  res.setHeader('Content-disposition', "attachment; filename=termo_responsabilidade_ " +object.nome_cliente+".pdf");
  res.setHeader('Content-type', 'application/pdf');
  doc.pipe(res);  // Enviar o documento diretamente na resposta
  doc.image('./paginas/img/topo.jpeg', 0, 0, { width: pageWidth }); // A imagem começa no topo e ocupa toda a largura

  doc.text(' ');
  doc.text(' ');
  doc.fontSize(14).text('DADOS DA ORDEM DE SERVIÇO: ');
  doc.text(`Cliente: ${object.nome_cliente}`);
  doc.text(`Número da OS : #${object.codigo}`);
  doc.text(`Tipo de Equipamento: ${object.equipamentos[0].equipamento.equipamento}`);
  doc.text(`Marca: ${object.equipamentos[0].equipamento.marca}`);
  doc.text(`Modelo: ${object.equipamentos[0].equipamento.modelo}`);
  doc.text(`Número de Série: ${object.equipamentos[0].equipamento.serie || 'Não possui número de série'}`);

  doc.text(' ');
  doc.fontSize(14).text('CONDIÇÕES PARA RECEBIMENTO DO EQUIPAMENTO');
  doc.fontSize(12).text('1.   A SOLTEC cobra uma taxa de R$ 70,00 reais para analisar o equipamento e fornecer o orçamento. Caso o cliente aprove o orçamento e contrate o serviço, a taxa de análise será dispensada (não será cobrada).');
  doc.text(' ');
  doc.fontSize(12).text(`2.  Como o equipamento não está exibindo imagem, o CLIENTE se responsabiliza e isenta a SOLTEC sobre o estado e funcionamento de todas as funcionalidades e partes físicas do equipamento, visto que não é possível a realização dos testes iniciais no equipamento.`);
  doc.text(' ');
  doc.fontSize(12).text(`3. DA RETIRADA DO EQUIPAMENTO:
    3.1 - É obrigatório a apresentação de um documento de identificação. 
    3.2 - Caso a pessoa que venha retirar não seja o responsável pelo equipamento, é necessário que o responsável envie no whatsaap da SOLTEC (84996809447) o nome completo e número do RG/CPF de quem que vai retirar o equipamento, e esse, por sua vez, tem que cumprir o item 3.1.
    3.3 -   Após a SOLTEC comunicar a  finalização do serviço ao cliente, o mesmo tem 5 dias úteis para retirar o equipamento da assistência, após esse prazo, é cobrado uma taxa de R$ 5,00 reais por dia, para arcar com os custos de armazenamento!`);
  doc.fontSize(12).text(`4.  O cliente declara está ciente que com o orçamento não aprovado ou quando o equipamento não teve conserto, a SOLTEC pede o prazo de 48h úteis para fechar o equipamento e entregar ao cliente.  `);
  doc.text(' ');
  doc.text(`Caicó, ${dataHoje.getDate()} de ${dataHoje.toLocaleString('default', { month: 'long' })} de ${dataHoje.getFullYear()}`);
  
  doc.text(' ');
  doc.text('Eu, __________________________________,');
  doc.text('sob o RG/CPF ______________________, declaro que li e aceito as condições contidas nesse documento.');
 
  doc.text('');
  doc.text('Resposável SOLTEC: __________________________________');
  

  doc.end();  
}

function termoDeEntregaEquipamentoNaoLiga(object, res) {//OKK!!!!!
  let dataHoje = new Date();
  const doc = new PDFDocument({ size: 'A4' });
  const pageWidth = doc.page.width - 30;
  var controle = "Controle";
  // Definir o arquivo de saída para o cliente como "attachment" (força download)
  res.setHeader('Content-disposition', "attachment; filename=termo_responsabilidade_" + object.nome_cliente + ".pdf");
  res.setHeader('Content-type', 'application/pdf');
  doc.pipe(res);  // Enviar o documento diretamente na resposta
  doc.image('./paginas/img/topo.jpeg', 0, 0, { width: pageWidth }); // A imagem começa no topo e ocupa toda a largura
  

  doc.text(' ');
  doc.text(' ');
  doc.fontSize(14).text('DADOS DA ORDEM DE SERVIÇO: ');
  doc.text(`Cliente: ${object.nome_cliente}`);
  doc.text(`Número da OS : #${object.codigo}`);
  doc.text(`Tipo de Equipamento: ${object.equipamentos[0].equipamento.equipamento}`);
  doc.text(`Marca: ${object.equipamentos[0].equipamento.marca}`);
  doc.text(`Modelo: ${object.equipamentos[0].equipamento.modelo}`);
  doc.text(`Número de Série: ${object.equipamentos[0].equipamento.serie || 'Não possui número de série'}`);

  doc.text(' ');
  doc.fontSize(14).text('CONDIÇÕES PARA RECEBIMENTO DO EQUIPAMENTO');
  doc.fontSize(12).text('1.   A SOLTEC cobra uma taxa de R$ 70,00 reais para analisar o equipamento e fornecer o orçamento. Caso o cliente aprove o orçamento e contrate o serviço, a taxa de análise será dispensada (não será cobrada).');
  doc.text(' ');
  doc.fontSize(12).text(`2.   Como o equipamento não está ligando, o CLIENTE se responsabiliza e isenta a SOLTEC sobre o estado e funcionamento de todas as funcionalidades e partes físicas do equipamento, visto que não é possível a realização dos testes iniciais no equipamento.`);
  doc.text(' ');
  doc.fontSize(12).text(`3. DA RETIRADA DO EQUIPAMENTO:
    3.1 - É obrigatório a apresentação de um documento de identificação. 
    3.2 - Caso a pessoa que venha retirar não seja o responsável pelo equipamento, é necessário que o responsável envie no whatsaap da SOLTEC (84996809447) o nome completo e número do RG/CPF de quem que vai retirar o equipamento, e esse, por sua vez, tem que cumprir o item 3.1.
    3.3 -   Após a SOLTEC comunicar a  finalização do serviço ao cliente, o mesmo tem 5 dias úteis para retirar o equipamento da assistência, após esse prazo, é cobrado uma taxa de R$ 5,00 reais por dia, para arcar com os custos de armazenamento!`);
  doc.fontSize(12).text(`4.  O cliente declara está ciente que com o orçamento não aprovado ou quando o equipamento não teve conserto, a SOLTEC pede o prazo de 48h úteis para fechar o equipamento e entregar ao cliente.  `);

  doc.text(' ');
  doc.text(' ');

  doc.text(`Caicó, ${dataHoje.getDate()} de ${dataHoje.toLocaleString('default', { month: 'long' })} de ${dataHoje.getFullYear()}`);
  
  doc.text(' ');
  doc.text('Eu, __________________________________,');
  doc.text('sob o RG/CPF ______________________, declaro que li e aceito as condições contidas nesse documento.');


  doc.end();  
}

async function termoNaoQueroEsperar(object, res) { //OK!!!!!!!!!!!!!!!!!
  try {
    let cliente = await findCliente(object.id_cliente); // Esperar o cliente ser carregado
    console.log(cliente);

    let dataHoje = new Date();
    const doc = new PDFDocument({ size: 'A4' });
    const pageWidth = doc.page.width - 30;

    res.setHeader('Content-disposition', "attachment; filename=termo_responsabilidade_" + object.nome_cliente + ".pdf");
    res.setHeader('Content-type', 'application/pdf');
    doc.pipe(res);

    doc.image('./paginas/img/topo.jpeg', 0, 0, { width: pageWidth });

    // Adicionando o RG/CPF do cliente

    doc.text(' ');
    doc.text(' ');
    doc.fontSize(14).text('DADOS DA ORDEM DE SERVIÇO: ');
    doc.text(`Cliente: ${object.nome_cliente}`);
    doc.text(`Número da OS : #${object.codigo}`);
    doc.text(`Tipo de Equipamento: ${object.equipamentos[0].equipamento.equipamento}`);
    doc.text(`Marca: ${object.equipamentos[0].equipamento.marca}`);
    doc.text(`Modelo: ${object.equipamentos[0].equipamento.modelo}`);
    doc.text(`Número de Série: ${object.equipamentos[0].equipamento.serie || 'Não possui número de série'}`);

 
    doc.text(' ');
    doc.fontSize(14).text('CONDIÇÕES PARA RECEBIMENTO DO EQUIPAMENTO');
    doc.fontSize(12).text('1.   A SOLTEC cobra uma taxa de R$ 70,00 reais para analisar o equipamento e fornecer o orçamento. Caso o cliente aprove o orçamento e contrate o serviço, a taxa de análise será dispensada (não será cobrada).');
    doc.text(' ');
    doc.fontSize(12).text(`2.  Como o cliente optou por não esperar a realização dos testes iniciais para verificação do estado de entrada do equipamento nas instalações da SOLTEC, o CLIENTE se responsabiliza e isenta a SOLTEC sobre o estado e funcionamento de todas as funcionalidades e partes fisícas do equipamento. A SOLTEC irá realizar os testes iniciais, atualizar a ordem de serviço com o resultado de todos os testes e enviar para o cliente via whatsapp, momento em que poderá atestar como estão todas as funcionalidades. Após o cliente concordar com as condições do equipamento, a SOLTEC passa a ser a responsável pelo equipamento.`);
    doc.text(' ');
    doc.fontSize(12).text(`3. DA RETIRADA DO EQUIPAMENTO:
      3.1 - É obrigatório a apresentação de um documento de identificação. 
      3.2 - Caso a pessoa que venha retirar não seja o responsável pelo equipamento, é necessário que o responsável envie no whatsaap da SOLTEC (84996809447) o nome completo e número do RG/CPF de quem que vai retirar o equipamento, e esse, por sua vez, tem que cumprir o item 3.1.
      3.3 -   Após a SOLTEC comunicar a  finalização do serviço ao cliente, o mesmo tem 5 dias úteis para retirar o equipamento da assistência, após esse prazo, é cobrado uma taxa de R$ 5,00 reais por dia, para arcar com os custos de armazenamento!`);
    doc.fontSize(12).text(`4.  O cliente declara está ciente que com o orçamento não aprovado ou quando o equipamento não teve conserto, a SOLTEC pede o prazo de 48h úteis para fechar o equipamento e entregar ao cliente.  `);

    doc.text(' ');
    doc.text(`Caicó, ${dataHoje.getDate()} de ${dataHoje.toLocaleString('default', { month: 'long' })} de ${dataHoje.getFullYear()}`);
    
    doc.text(' ');
    doc.text('Eu, __________________________________,');
    doc.text('sob o RG/CPF ______________________, declaro que li e aceito as condições contidas nesse documento.');
    doc.text('');
    doc.text('Resposável SOLTEC: __________________________________');


  
    
  
    doc.end();  

  } catch (error) {
    console.error('Erro ao buscar o cliente:', error);
    res.status(500).send('Erro ao gerar o documento.');
  }
}



function termoDeEntregaEquipamentoSemServico(object, res) {//OKKK!!!  
  let dataHoje = new Date();
  const doc = new PDFDocument({size: 'A4'});
  const pageWidth = doc.page.width - 30;

  // Definir o arquivo de saída para o cliente como "attachment" (força download)
  res.setHeader('Content-disposition', "attachment; filename=termo_responsabilidade_" + object.nome_cliente + ".pdf");
  res.setHeader('Content-type', 'application/pdf');
  doc.pipe(res);  // Enviar o documento diretamente na resposta
  doc.image('./paginas/img/topo.jpeg', 0, 0, { width: pageWidth }); // A imagem começa no topo e ocupa toda a largura

  doc.text(' ');
  doc.fontSize(14).text('DADOS DA ORDEM DE SERVIÇO: ');
  doc.text(`Cliente: ${object.nome_cliente}`);
  doc.text(`Número da OS : #${object.codigo}`);
  doc.text(`Tipo de Equipamento: ${object.equipamentos[0].equipamento.equipamento}`);
  doc.text(`Marca: ${object.equipamentos[0].equipamento.marca}`);
  doc.text(`Modelo: ${object.equipamentos[0].equipamento.modelo}`);
  doc.text(`Número de Série: ${object.equipamentos[0].equipamento.serie || 'Não possui número de série'}`);

  doc.text(' ');
  doc.fontSize(14).text('Condições do Equipamento:');
  doc.fontSize(12).text('Atesto que o equipamento foi entregue nas mesmas condições que eu entreguei na assistência.');

  doc.text(' ');
  doc.fontSize(14).text('Funcionalidades Verificadas:');
  doc.fontSize(12).text('Declaro ter verificado todas as funcionalidades do equipamento e que todas estão operando nas mesmas condições que eu entreguei na assistência.');

  doc.text(' ');
  doc.fontSize(14).text('Responsabilidades:');
  doc.fontSize(12).text('Como receptor do equipamento, assumo total responsabilidade pela sua guarda e transporte. Qualquer dano causado ao equipamento devido ao transporte será de minha inteira responsabilidade.');

  doc.text(' ');
  doc.text(`Caicó, ${dataHoje.getDate()} de ${dataHoje.toLocaleString('default', { month: 'long' })} de ${dataHoje.getFullYear()}`);
  
  doc.text(' ');
  doc.text('Eu, __________________________________,');
  doc.text('sob o RG/CPF ______________________, declaro, portanto, que recebi o equipamento acima mencionado nas mesmas condições que eu entreguei na assistência, estando ciente das minhas responsabilidades e direitos.');


  doc.end();  
}

function termoDeEntregaDesktop(object, res) {//OKKKK!!!!!!
  let dataHoje = new Date();
  const doc = new PDFDocument({size: 'A4'});
  const pageWidth = doc.page.width - 30;

  // Definir o arquivo de saída para o cliente como "attachment" (força download)
  res.setHeader('Content-disposition', "attachment; filename=termo_responsabilidade_" + object.nome_cliente + ".pdf");
  res.setHeader('Content-type', 'application/pdf');
  doc.pipe(res);  // Enviar o documento diretamente na resposta
  doc.image('./paginas/img/topo.jpeg', 0, 0, { width: pageWidth }); // A imagem começa no topo e ocupa toda a largura
  


  doc.text(' ');
  doc.text(' ');
  doc.fontSize(14).text('DADOS DA ORDEM DE SERVIÇO: ');
  doc.text(`Cliente: ${object.nome_cliente}`);
  doc.text(`Número da OS : #${object.codigo}`);
  doc.text(`Tipo de Equipamento: ${object.equipamentos[0].equipamento.equipamento}`);
  doc.text(`Marca: ${object.equipamentos[0].equipamento.marca}`);
  doc.text(`Modelo: ${object.equipamentos[0].equipamento.modelo}`);
  doc.text(`Número de Série: ${object.equipamentos[0].equipamento.serie || 'Não possui número de série'}`);

  doc.text(' ');
  doc.fontSize(14).text('Condições do Equipamento:');
  doc.fontSize(12).text('Atesto que o equipamento foi entregue em perfeitas condições de uso, estando livre de danos extras, como arranhões, partes quebradas, peças faltantes ou qualquer outra falha que possa comprometer seu funcionamento adequado.');

  doc.text(' ');
  doc.fontSize(14).text('Funcionalidades Verificadas:');
  doc.fontSize(12).text('Declaro ter verificado todas as funcionalidades do equipamento e que todas estão operando corretamente. Isso inclui, mas não se limita a: liga/desliga, entrada de rede, USBs, HDMI, VGA, saída P2, acessórios fornecidos, entre outros.');

  doc.text(' ');
  doc.fontSize(14).text('Responsabilidades:');
  doc.fontSize(12).text('Como receptor do equipamento, assumo total responsabilidade pela sua guarda e transporte. Qualquer dano causado ao equipamento devido ao transporte será de minha inteira responsabilidade.');

  doc.text(' ');
  doc.fontSize(14).text('Prazo de Garantia:');
  doc.fontSize(12).text(`Fui informado de que o(s) serviço(s) e/ou produto(s) possui um período de garantia conforme estabelecido pela ORDEM DE SERVIÇO Nº ${object.codigo} que recebi pelo WhatsApp. Caso ocorra qualquer problema durante o prazo de garantia, me comprometo a entrar em contato com a empresa SOLTEC para obter assistência técnica. Reconheço que caso algum do(s) serviço(s) ou produto(s) apresente problema(s) e eu não leve o equipamento até a empresa SOLTEC dentro do período da garantia, a empresa não tem o dever de prestar suporte fora do período da garantia, mesmo que tenha sido comunicada do acontecido dentro do período da garantia.`);


  doc.text(' ');
  doc.text(`Caicó, ${dataHoje.getDate()} de ${dataHoje.toLocaleString('default', { month: 'long' })} de ${dataHoje.getFullYear()}`);
  
  doc.text(' ');
  doc.text('Eu, __________________________________,');
  doc.text('sob o RG/CPF ______________________, declaro, portanto, que recebi o equipamento acima mencionado nas mesmas condições que eu entreguei na assistência, estando ciente das minhas responsabilidades e direitos.');



  doc.end();  
}




async function findCliente(id) {
  const request = require('request');

  return new Promise((resolve, reject) => {
    request({
      method: 'GET',
      url: `https://api.beteltecnologia.com/clientes/${id}`,
      headers: {
        'Content-Type': 'application/json',
        'access-token': 'bf8388411ae3f29922f51a5c1faeaa7f6f94f8f3',
        'secret-access-token': '01ee10e2ce0e8c75e4a89a8c0b9615946105e890'
      }
    }, function (error, response, body) {
      if (error) {
        reject(error); // Rejeitar em caso de erro
      } else {
        resolve(JSON.parse(body)); // Resolver com os dados do cliente
      }
    });
  });
}
