var express = require("express");
var router = express.Router();
const tarefasController = require("../controllers/tarefasController");
const { body } = require("express-validator");

// Listar tarefas (página inicial)
router.get("/", tarefasController.listarTarefas);

// Exibir formulário para nova tarefa
router.get("/nova-tarefa", tarefasController.novaTarefa);

// Criar ou atualizar tarefa (com validação)
router.post("/manter-tarefa",
	[
		body('id').default(0).toInt(),
		body('nome')
			.trim()
			.notEmpty().withMessage('O nome é obrigatório')
			.bail()
			.isLength({ min: 3 }).withMessage('O nome deve ter ao menos 3 caracteres'),
		body('prazo')
			.notEmpty().withMessage('O prazo é obrigatório')
			.bail()
			.isISO8601().withMessage('Prazo inválido'),
		body('situacao')
			.notEmpty().withMessage('A situação é obrigatória')
			.bail()
			.isInt({ min: 0, max: 4 }).withMessage('Situação inválida')
	],
	tarefasController.manterTarefa
);

// Exibir formulário para editar tarefa
router.get("/editar", tarefasController.editarTarefa);

// Excluir tarefa
router.get('/excluir', tarefasController.excluirTarefa);

// Teste de inserção
router.get("/teste-insert", tarefasController.testeInsert);

// Exclusão física - hard delete
router.get("/teste-delete", tarefasController.testeDeleteFisico);

// Exclusão lógica - soft delete
router.get("/teste-delete-logico", tarefasController.testeDeleteLogico);

module.exports = router;