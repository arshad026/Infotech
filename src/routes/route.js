const express = require('express')
const router = express.Router()
const {userCreate, userLogin, forgetPassword, resetPassword} = require('../controllers/userController')
const {createTask, getTask, updateTask, deleteTask} = require('../controllers/taskController')
const { authentication, authorisation } = require('../middlewares/auth')



router.post('/register', userCreate)
router.post('/login', userLogin)
router.post('/api/forgetPassword', forgetPassword)
router.post('/api/resetPassword', resetPassword)


router.post('/tasks', authentication, createTask)
router.get('/tasks', authentication, authorisation, getTask)
router.put('/tasks/:taskId', authentication, authorisation, updateTask)
router.delete('/tasks/:taskId', authentication, authorisation, deleteTask)


module.exports = router