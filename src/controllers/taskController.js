const taskModel = require('../models/taskModel')
const userModel = require('../models/userModel')
const mongoose = require('mongoose')


const createTask = async function (req, res) {

    try {
        let data = req.body
        let { Title, Description, Priority, Status, userId } = data

        if (Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, message: 'please provide some data' })
        }
        if (!Title) return res.status(400).send({ status: false, message: "Please Provide Title" })

        if (!Description) return res.status(400).send({ status: false, message: "Please Provide Description" })

        if (!Priority) return res.status(400).send({ status: false, message: "Please Provide Priority" })

        if (!Status) return res.status(400).send({ status: false, message: 'please provide Status' })

        if (!userId) return res.status(400).send({ status: false, message: 'please provide userId' })

        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "invalid userId format" });
        }

        let user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).send({ status: false, message: "user doesn't exist" })
        }

        const userData = await taskModel.create(data)
        res.status(201).send({ status: true, message: 'user created successfully', data: userData })

    }
    catch (error) {
        res.status(500).send({ status: false, Error: error.message })
    }
}




const getTask = async function (req, res) {

    try {
        let userId = req.decodedToken.userId

        let task = await userModel.findById({ _id: userId })
        if (!task) {
            return res.status(404).send({ status: false, msg: "task not found" })
        }

        return res.status(200).send({ status: true, message: "data fetched successfully", data: task })
    } catch (error) {
        return res.status(500).send({ status: false, message: err.message })

    }
}




const updateTask = async function (req, res) {

    try {
        const data = req.body
        let userId = req.decodedToken.userId
        let taskId = req.params.taskId

        const { Title, Description, Priority, Status } = data
        let obj = {}

        if (Title) queryFilter.Title = Title
        if (Status) queryFilter.Status = Status
        if (Priority) queryFilter.Priority = Priority
        if (Description) queryFilter.Description = Description

        if (!mongoose.isValidObjectId(taskId)) return res.status(400).send({ status: false, message: "please provide valid taskId" })
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "for updation data is required" })

        let task = await taskModel.findOne({ _id: taskId, userId: userId, isDeleted : false })
        if (!task) return res.status(404).send({ status: false, message: "task does not found" })

        const updatetask = await taskModel.findOneAndUpdate({ _id: taskId }, { $set: obj }, { new: true })

        return res.status(200).send({ status: true, message: "task update is successful", data: updatetask })

    }
    catch (error) {
        return res.status(500).send({ status: false, Error: error.message })
    }
}




const deleteTask = async function (req, res) {

    try {
        let taskId = req.params.taskId

        const task = await taskModel.findOne({ _id: taskId, isDeleted: false })
        if (!task) {
            return res.status(404).send({ status: false, message: "task does not found" })
        }

        await taskModel.updateOne({ _id: taskId, isDeleted: false }, { $set: { isDeleted: true, deletedAt: new Date() } })
        return res.status(200).send({ status: true, message: "task deleted successfully" })
    }
    catch (error) {
        res.status(500).send({ status: false, Error: error.message })
    }
}


module.exports = { createTask, getTask, updateTask, deleteTask }
