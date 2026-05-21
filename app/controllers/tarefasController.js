const { tarefasModel } = require("../models/tarefasModel");
const { validationResult } = require('express-validator');
const moment = require("moment");
moment.locale('pt-br');

// Listar todas as tarefas com paginação
async function listarTarefas(req, res) {
    res.locals.moment = moment;
    
    let paginaAtual = req.query.pagina == undefined ? 1 : req.query.pagina;
    let qtdeRegPagina = 5;
    // pagina 1 --> offset 0  (pagina - 1) * qtde --> 0
    // pagina 2 --> offset 5                            5
    // pagina 3 --> offset 10                           10
    let offset = (paginaAtual - 1) * qtdeRegPagina;

    let numPaginas = Math.ceil(await tarefasModel.totalReg() / qtdeRegPagina);

    let notificador = {"paginaAtual":paginaAtual,"numPaginas":numPaginas};

    try {
        const result = await tarefasModel.findAll(offset, qtdeRegPagina);
        console.log(result)

        res.render("pages/index", {
            listaTarefas: Array.isArray(result) ? result : [],
            notificador: notificador
        });
    } catch (erro) {
        console.log(erro);
        res.render("pages/index", {
            listaTarefas: [],
            notificador: notificador
        });
    }
}

// Exibir formulário para nova tarefa
function novaTarefa(req, res) {
    res.locals.moment = moment;
    res.render("pages/cadastro",
        {
            tituloPagina: "Cadastro de Tarefas", tituloAba: "Cadastro",
            tarefa: {
                id_tarefa: 0, nome_tarefa: "",
                prazo_tarefa: "", situacao_tarefa: 1
            },
            errors: [],
            fieldErrors: {}
        });
}

// Criar ou atualizar tarefa
async function manterTarefa(req, res) {
    res.locals.moment = moment;

    const errors = validationResult(req);

    const tarefaFormulario = {
        id_tarefa: req.body.id !== undefined ? req.body.id : 0,
        nome_tarefa: req.body.nome !== undefined ? req.body.nome : "",
        prazo_tarefa: req.body.prazo !== undefined ? req.body.prazo : "",
        situacao_tarefa: req.body.situacao !== undefined ? req.body.situacao : 1
    };

    if (!errors.isEmpty()) {
        const mappedErrors = errors.mapped();
        return res.render("pages/cadastro", {
            tituloPagina: tarefaFormulario.id_tarefa == 0 ? "Cadastro de Tarefas" : "Alterar Tarefa",
            tituloAba: tarefaFormulario.id_tarefa == 0 ? "Cadastro" : "Edição de Tarefa",
            tarefa: tarefaFormulario,
            errors: errors.array(),
            fieldErrors: mappedErrors
        });
    }

    const objDados = {
        id : req.body.id,
        nome: req.body.nome,
        prazo: req.body.prazo,
        situacao: req.body.situacao
    }

    try {
        if(objDados.id == 0){
            const result = await tarefasModel.create(objDados);  
        }else{
            const result = await tarefasModel.update(objDados);  
        }
        
        res.redirect("/");
    } catch (erro) {
        console.log(erro);
    }
}

// Exibir formulário para editar tarefa
async function editarTarefa(req, res) {
    res.locals.moment = moment;
    //recuperando a querystring
    const id = req.query.id;
    try {
        const result = await tarefasModel.findById(id);
        res.render("pages/cadastro",
            {
                tituloPagina: "Alterar Tarefa", tituloAba: "Edição de Tarefa",
                tarefa: result[0],
                errors: [],
                fieldErrors: {}
            });
    } catch (erro) {
        console.log(erro)
    }
}

// Excluir tarefa (soft delete)
async function excluirTarefa(req, res) {
    const id = req.query.id;

    try {
        await tarefasModel.deleteLogico(id);
        res.redirect('/');
    } catch (erro) {
        console.log(erro);
    }
}

// Teste de inserção
async function testeInsert(req, res) {
    const objDados = {
        nome: "limpar gabinete PC",
        prazo: "2026-03-23"
    }
    try {
        const result = await tarefasModel.create(objDados);
        res.send(result);
    } catch (erro) {
        console.log(erro);
    }
}

// Teste de exclusão física (hard delete)
async function testeDeleteFisico(req, res) {
    // Implementar lógica conforme necessário
    res.send("Teste de delete físico");
}

// Teste de exclusão lógica (soft delete)
async function testeDeleteLogico(req, res) {
    // Implementar lógica conforme necessário
    res.send("Teste de delete lógico");
}

module.exports = {
    listarTarefas,
    novaTarefa,
    manterTarefa,
    editarTarefa,
    excluirTarefa,
    testeInsert,
    testeDeleteFisico,
    testeDeleteLogico
};
