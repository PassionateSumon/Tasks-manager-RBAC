const apiErrorHandler = require("../utils/apiErrorHandler.util");
const apiResponseHandler = require("../utils/apiResponseHandler.util");
const Task = require("../models/task.model");
const { default: mongoose } = require("mongoose");

exports.createTask = async (req, res) => {
  try {
    const userId = req?.user?.id;
    const { title, description } = req?.body;

    if (!userId) {
      return res.status(403).json(new apiErrorHandler(403, "Unauthorized"));
    }

    if (!title) {
      return res
        .status(400)
        .json(
          new apiErrorHandler(400, "Title must be required to create task!")
        );
    }

    const newTask = await Task.create({
      title,
      description: description || "",
      owner: userId,
    });

    if (!newTask) {
      return res
        .status(500)
        .json(
          new apiErrorHandler(500, "Task is not created by internal error!")
        );
    }

    return res
      .status(200)
      .json(new apiResponseHandler(200, "Task created", newTask));
  } catch (error) {
    return res
      .status(400)
      .json(new apiErrorHandler(400, "Internal server error at catch!!"));
  }
};

// This needs to be changed --> see later...
exports.updateTask = async (req, res) => {
  try {
    const userId = req?.user?.id;
    const requestedTaskId = req?.params?.id;
    const role = req?.role;
    const { title, description, status } = req?.body;
    if (!userId) {
      return res
        .status(403)
        .json(new apiErrorHandler(403, "Unauthorized user!"));
    }
    if (!role) {
      return res
        .status(403)
        .json(new apiErrorHandler(403, "Unauthorized role!"));
    }
    if (!requestedTaskId) {
      return res
        .status(404)
        .json(new apiErrorHandler(404, "Can't find the task id!"));
    }

    const existedTask = await Task.findById(requestedTaskId);
    if (!existedTask) {
      return res
        .status(404)
        .json(new apiErrorHandler(404, "Can't find the task to be updated!"));
    }

    existedTask.title = title || existedTask.title;
    existedTask.description = description || existedTask.description;
    existedTask.status = status || existedTask.status;
    return res
      .status(200)
      .json(
        new apiResponseHandler(200, "Task updated successfully.", existedTask)
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new apiErrorHandler(500, "Internal server error for updating at catch!")
      );
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const userId = req?.user?.id;
    const requestedTaskId = req?.params?.id;
    const role = req?.role;
    if (!userId) {
      return res
        .status(403)
        .json(new apiErrorHandler(403, "Unauthorized user!"));
    }
    if (!role) {
      return res
        .status(403)
        .json(new apiErrorHandler(403, "Unauthorized role!"));
    }
    if (!requestedTaskId) {
      return res
        .status(404)
        .json(new apiErrorHandler(404, "Can't find the task id!"));
    }

    const updatedTaskAfterDelete = await Task.findByIdAndDelete(
      requestedTaskId
    );
    if (!updatedTaskAfterDelete) {
      return res
        .status(404)
        .json(new apiErrorHandler(404, "Internal problem in delete task!!"));
    }
    return res
      .status(200)
      .json(
        new apiResponseHandler(
          200,
          "Successfully delete!",
          updatedTaskAfterDelete
        )
      );
  } catch (error) {
    return res
      .status(400)
      .json(
        new apiErrorHandler(400, "Internal problem in delete task at catch!!")
      );
  }
};

// I send "actual task" for Frontend
exports.getSingleTask = async (req, res) => {
  try {
    const userId = req?.user?.id;
    const requestedTaskId = req?.params?.id;
    const role = req?.role;
    if (!userId) {
      return res
        .status(403)
        .json(new apiErrorHandler(403, "Unauthorized user!"));
    }
    if (!role) {
      return res
        .status(403)
        .json(new apiErrorHandler(403, "Unauthorized role!"));
    }
    if (!requestedTaskId) {
      return res.status(400).json(new apiErrorHandler(400, "Invalid task ID!"));
    }

    const foundTask = await Task.findById(requestedTaskId);
    if (!foundTask) {
      return res
        .status(404)
        .json(new apiErrorHandler(404, "task can't be found!"));
    }
    const taskAggregation = await Task.aggregate([
      {
        $match: {
          _id: foundTask._id,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          password: 0,
        },
      },
    ]);
    const actualTask = taskAggregation[0];
    return res
      .status(200)
      .json(new apiResponseHandler(200, "Task found", actualTask));
  } catch (error) {
    return res
      .status(400)
      .json(
        new apiErrorHandler(400, "Internal server error to get task at catch!")
      );
  }
};

exports.getAllTasksByRoles = async (req, res) => {
  try {
    
  } catch (error) {}
};
