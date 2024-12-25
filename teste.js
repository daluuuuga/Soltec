const fs = require('fs');
const { Document, Packer, Paragraph, TextRun } = require('docx');
const prompts = require('prompts');

const questions = [
  { type: 'text', name: 'nome', message: 'Nome do(a) receptor(a):' },
  { type: 'text', name: 'documento', message: 'Número do documento de identificação:' },
  { type: 'text', name: 'tipoEquipamento', message: 'Tipo de Equipamento:' },
  { type: 'text', name: 'marca', message: 'Marca:' },
  { type: 'text', name: 'modelo', message: 'Modelo:' },
  { type: 'text', name: 'numeroSerie', message: 'Número de Série:' },
  { type: 'text', name: 'data', message: 'Dia:' },
  { type: 'text', name: 'mes', message: 'Mês (por extenso):' }
];

function generateDocument(answers) {
  return new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun(`Eu, ${answers.nome}, portador(a) do documento de identificação ${answers.documento}, declaro por meio deste termo que recebi da empresa SOLTEC o equipamento descrito abaixo, em perfeitas condições de uso e funcionamento:`),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun('Dados do Equipamento:'),
              new TextRun(`Tipo de Equipamento: ${answers.tipoEquipamento}`),
              new TextRun(`Marca: ${answers.marca}`),
              new TextRun(`Modelo: ${answers.modelo}`),
              new TextRun(`Número de Série: ${answers.numeroSerie}`),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun('Condições do Equipamento:'),
              new TextRun(`Atesto que o equipamento foi entregue em perfeitas condições de uso, estando livre de danos extras, como arranhões, manchas ou listras na tela, partes quebradas, peças faltantes ou qualquer outra falha que possa comprometer seu funcionamento adequado.`),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun('Funcionalidades Verificadas:'),
              new TextRun(`Declaro ter verificado todas as funcionalidades do equipamento e que todas estão operando corretamente. Isso inclui, mas não se limita a: liga/desliga, tela, teclado, câmera, microfone, conexão wifi, carregador, acessórios fornecidos, entre outros.`),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun('Responsabilidades:'),
              new TextRun(`Como receptor do equipamento, assumo total responsabilidade pela sua guarda e transporte. Qualquer dano causado ao equipamento devido ao transporte será de minha inteira responsabilidade.`),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun('Prazo de Garantia:'),
              new TextRun(`Fui informado de que o(s) serviço(s) e/ou produto(s) possui um período de garantia conforme estabelecido na Ordem de Serviço Nº "numero" que recebi pelo whatsapp. Caso ocorra qualquer problema durante o prazo de garantia, me comprometo a entrar em contato com a empresa SOLTEC para obter assistência técnica. Reconheço que caso algum do(s) serviço(s) ou produto(s) apresente problema(s) e eu não leve o equipamento até a empresa SOLTEC dentro do período da garantia, a empresa não tem o dever de prestar suporte fora do período da garantia, mesmo que tenha sido comunicada do acontecido dentro do período da garantia.`),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun(`Declaro, portanto, que recebi o equipamento acima mencionado em perfeitas condições de uso e funcionamento, estando ciente das minhas responsabilidades e direitos.`),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun(`Caicó, ${answers.data} de ${answers.mes} de 2024`),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun('________________________________________'),
              new TextRun('Assinatura do Cliente'),
            ],
          }),
        ],
      },
    ],
  });
}

(async () => {
  try {
    const answers = await prompts(questions);
    const doc = generateDocument(answers);
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync('declaration.docx', buffer);
    console.log('Arquivo gerado com sucesso: declaration.docx');
  } catch (error) {
    console.error('Erro ao gerar o arquivo:', error);
  }
})();
