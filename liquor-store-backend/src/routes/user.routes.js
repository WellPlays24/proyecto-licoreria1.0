const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
// Todas estas rutas requieren estar logueado
// Idealmente agregarías también un middleware 'isAdmin' aquí
router.get('/', verifyToken, userController.getAll);
router.get('/:id', verifyToken, userController.getById);
router.post('/', verifyToken, userController.create);
router.put('/:id', verifyToken, userController.update);
router.delete('/:id', verifyToken, userController.remove);
module.exports = router;