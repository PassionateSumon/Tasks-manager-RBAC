const apiErrorHandler = require("../utils/apiErrorHandler.util");
const apiResponseHandler = require("../utils/apiResponseHandler.util");
const Task = require("../models/task.model");
const mongoose = require("mongoose");
const User = require("../models/user.model");

exports.createTask = async (req, res) => {
  try {
    const userId = req?.user?.id;
    const { title, description } = req?.body;
    // console.log("task body: ",req.body)

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
      owner: new mongoose.Types.ObjectId(userId),
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
exports.updateTask = async (req, res) => {
  try {
    const userId = req?.user?.id;
    const requestedTaskId = req?.params?.t_id;
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

    const updatedTask = await existedTask.save();
    if (!updatedTask) {
      return res
        .status(500)
        .json(
          new apiErrorHandler(500, "Task is not updated by internal error!")
        );
    }

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
    const requestedTaskId = req?.params?.t_id;
    const role = req?.role;
    // console.log(userId, "-- ", requestedTaskId, "-- ", role);
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
    const requestedTaskId = req?.params?.t_id;
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
    const adminId = req?.user?.id;
    // console.log(adminId, "1")
    if (!adminId)
      return res
        .status(403)
        .json(new apiErrorHandler(403, "Unauthorized for getting all tasks!"));
    const aggregateRes = await User.aggregate([
      {
        $match: {
          _id: adminId,
        },
      },
      {
        $lookup: {
          from: "roles",
          localField: "role",
          foreignField: "_id",
          as: "role",
        },
      },
    ]);
    // console.log("2")
    if (!aggregateRes)
      return res
        .status(500)
        .json(new apiErrorHandler(500, "Internal server error!"));
    const role = aggregateRes[0]?.role[0]?.name;
    // console.log("3")
    if (!role) {
      return res
        .status(403)
        .json(new apiErrorHandler(403, "Unauthorized for getting all tasks!"));
    }
    // console.log("4")
    let getTasksForAdmin, getTasksForModerator, getTasksForUser;
    switch (role) {
      case process.env.ADMIN_ROLE:
        getTasksForAdmin = await Task.aggregate([
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    password: 0,
                  },
                },
                {
                  $lookup: {
                    from: "roles",
                    localField: "role",
                    foreignField: "_id",
                    as: "role",
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: { $arrayElemAt: ["$owner", 0] },
            },
          },
        ]);
        break;

      case process.env.MODERATOR_ROLE:
        getTasksForModerator = await Task.aggregate([
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
            },
          },
          {
            $addFields: {
              owner: { $arrayElemAt: ["$owner", 0] },
            },
          },
          {
            $lookup: {
              from: "roles",
              localField: "owner.role",
              foreignField: "_id",
              as: "role",
            },
          },
          {
            $addFields: {
              role: { $arrayElemAt: ["$role", 0] },
            },
          },
          {
            $match: {
              "role.name": { $ne: "admin" },
            },
          },
        ]);
        break;
      case process.env.USER_ROLE:
        getTasksForUser = await Task.aggregate([
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
            },
          },
          {
            $addFields: {
              owner: { $arrayElemAt: ["$owner", 0] },
            },
          },
          {
            $lookup: {
              from: "roles",
              localField: "owner.role",
              foreignField: "_id",
              as: "role",
            },
          },
          {
            $addFields: {
              role: { $arrayElemAt: ["$role", 0] },
            },
          },
          {
            $match: {
              $and: [
                { "role.name": { $ne: "admin" } },
                { "role.name": { $ne: "moderator" } },
              ],
            },
          },
        ]);
        break;
    }
    // console.log("5")
    // console.log(getTasksForAdmin);
    if (role === process.env.ADMIN_ROLE) {
      return res
        .status(200)
        .json(
          new apiResponseHandler(200, "Successfully get.", getTasksForAdmin)
        );
    }
    // console.log("6")
    if (role === process.env.MODERATOR_ROLE) {
      return res
        .status(200)
        .json(
          new apiResponseHandler(200, "Successfully get.", getTasksForModerator)
        );
    }
    // console.log("7")
    if (role === process.env.USER_ROLE) {
      return res
        .status(200)
        .json(
          new apiResponseHandler(200, "Successfully get.", getTasksForUser)
        );
    }
    // console.log("here")
  } catch (error) {
    return res
      .status(400)
      .json(
        new apiErrorHandler(400, "Internal server error to get task at catch!")
      );
  }
};

exports.getTasksOfUser = async (req, res) => {
  try {
    const userId = req?.params?.id;
    const loggedInPersonId = req?.user.id;
    const role = req?.role;
    if (!loggedInPersonId)
      return res.status(400).json(new apiErrorHandler(400, "Unauthorized"));
    if (!role)
      return res
        .status(400)
        .json(
          new apiErrorHandler(400, "You don't have a permission to read tasks")
        );

    const person = await Task.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(userId),
        },
      },
    ]);
    if (!person)
      return res.status(404).json(new apiErrorHandler(404, "Person not found"));
    return res
      .status(200)
      .json(new apiResponseHandler(200, "Tasks found", person));
  } catch (error) {
    return res
      .status(400)
      .json(
        new apiErrorHandler(400, "Internal server error to get task at catch!")
      );
  }
};
