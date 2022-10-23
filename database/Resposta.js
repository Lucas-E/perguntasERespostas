const Sequelize = require('sequelize');
const conn = require('./database')

const Resposta = conn.define('resposta', {
    titulo : {
        type: Sequelize.STRING,
        allowNull: false
    },
    resposta: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    pergunta_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

conn.sync({force: false}).then(() => {
    console.log('Tabela Resposta Criada com Sucesso!')
})


module.exports = Resposta;