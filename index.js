//express
const express = require('express');
const app = express();

//Sequelize
const Sequelize = require('sequelize');

//bodyparser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

//Server port
const port =  8080;

//ejs config
app.set('view engine', 'ejs');


//static files config
app.use(express.static('public'))

//database conn
const conn = require('./database/database');

//database
conn.authenticate()
    .then(() => {
        console.log('Conexão feita com sucesso!')
    })
    .catch((e)=>{
        console.log(e)
    })

//create table Pergunta
const perguntaModel = require('./database/Pergunta');

//create table Resposta
const respostaModel = require('./database/Resposta');


//ROUTES



//get routes
app.get('/', (req, res) => {
    let query = req.query;
    res.render('index', data = {...query})
})

app.get('/perguntar', (req, res) => {
    res.render('pergunta')
})

app.get('/perguntas', async (req, res) => {
    //select * from pergunta
    let qry = await perguntaModel.findAll({raw: true, order:[
        ['id', 'DESC']
    ]})

    res.render('perguntas', data = {dados: qry})
})

app.get('/responder/:id', async (req,res) => {
    let id = req.params.id;

    let ques = await perguntaModel.findOne({
        where: {
            id:id
        },
        raw: true
    });

    let resp = await respostaModel.findAll({
        raw: true,
        where: {
            pergunta_id : id
        }
    });
    console.log(resp);
    
    if(ques != undefined){
        res.render('responder', data = {id: id, ...ques, respostas:resp, exists: true, questao_feita:false})
    }else{
        res.render('responder', data = {id: id, titulo: 'Questão ainda não realizada', descricao:'', exists: false, questao_feita:false})
    }
})




//post routes
app.post('/perguntar', (req, res) => {
    titulo = req.body.titulo;
    descricao = req.body.descricao;
    perguntaModel.create({
        titulo: titulo,
        descricao: descricao,
    })
    res.redirect('/?suc=true');
})

app.post('/responder', (req, res) => {
    titulo = req.body.titulo;
    resposta = req.body.resposta;
    pergunta_id = req.body.pergunta_id;

    console.log(titulo, resposta, pergunta_id)

    respostaModel.create({
        titulo: titulo,
        resposta: resposta,
        pergunta_id: pergunta_id
    })

    res.redirect('/responder/'+pergunta_id);
})



//start server
app.listen(port, () => {
    console.log('Servidor Rodando')
}) 