const User = require("../models/user.model");
const apiErrorHandler = require("../utils/apiErrorHandler.util");
const { default: mongoose } = require("mongoose");

exports.verifyRoleAndPermission = async (req, res, next) => {
  try {
    //take id from the user object stored in req,
    //take id from params
    //now check if the id from req.user is in the order admin -> mod -> user and id from params is in the order user -> mod -> admin
    //now admin/mod/user can do all the things that have a permission

    // <------------ check loggedin person ------------>
    const currLoggedInPerson = req?.user?.id;
    const action = req?.params?.profile_action_update;
    if (!action)
      return res.status(400).json(new apiErrorHandler(400, "Action not found"));
    const decodedActionType = action?.split("_")[0]; //profile, task, role
    const decodedAction = `${action?.split("_")[1]}:${action?.split("_")[2]}`; //update, delete, read
    if (!currLoggedInPerson)
      return res.status(401).json(new apiErrorHandler(401, "Unauthorized"));
    const user = await User.findById(currLoggedInPerson);
    if (!user)
      return res.status(404).json(new apiErrorHandler(404, "User not found"));

    // <------------ check role of loggedin Person------------>
    const currUserWithRole = await User.aggregate([
      {
        $match: { _id: user?._id },
      },
      {
        $lookup: {
          from: "roles",
          localField: "role",
          foreignField: "_id",
          as: "userRole",
        },
      },
    ]);
    if (!currUserWithRole)
      return res
        .status(500)
        .json(new apiErrorHandler(500, "Issue in aggregating user with role"));

    //loggedin
    const currUserWithRoleName = currUserWithRole[0].userRole[0].name;

    //now I have role of loggedin person, let's check if he is higher than req.params or not
    // <------------ check role of the requested person ------------>
    const requestedPersonRole = await User.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(req.params.id) },
      },
      {
        $lookup: {
          from: "roles",
          localField: "role",
          foreignField: "_id",
          as: "userRole",
        },
      },
    ]);
    const requestedPersonRoleName = requestedPersonRole[0].userRole[0].name;

    switch (currUserWithRoleName) {
      case "admin":
        //check if requested person role name is "admin", if so then check only himself can change it's own things, not others

        if (currUserWithRoleName === requestedPersonRoleName) {
          if (currLoggedInPerson.toString() === req.params.id) {
            req.role = currUserWithRole[0];
          } else {
            req.role = null;
          }
        }

        //check if requested person role name is "moderator" or "user", if so then check the loggedin person persmissions

        if (
          requestedPersonRoleName === "moderator" ||
          requestedPersonRoleName === "user"
        ) {
          //now check for the permissions on the loggedin person, not the role
          const adminPermissions = await User.aggregate([
            {
              $match: { _id: currLoggedInPerson },
            },
            {
              $lookup: {
                from: "permissions",
                localField: "permissions",
                foreignField: "_id",
                as: "userPermissions",
              },
            },
          ]);

          console.log(adminPermissions[0].userPermissions);
          adminPermissions[0]?.userPermissions?.forEach((permission) => {
            if (Object.keys(permission).includes(decodedActionType)) {
              if (permission[decodedActionType].includes(decodedAction)) {
                console.log("not null - 101");
                req.role = currUserWithRole[0];
              } else {
                console.log("null - 104");
                req.role = null;
              }
            } else {
              console.log("null - 108");
              req.role = null;
            }
          });
        }
        break;

      case "moderator":
        //check if requested person role name is "admin", if so then just deny the request
        if (currUserWithRoleName === "admin") {
          req.role = null;
        }
        //check if requested person role name is "moderator", if so then check the only himself can change his own things
        if (currUserWithRoleName === requestedPersonRoleName) {
          if (currLoggedInPerson.toString() === req.params.id) {
            req.role = currUserWithRole[0];
          } else {
            req.role = null;
          }
        }
        //check if requested person role name is "user", if so then check the loggedin person persmissions
        if (requestedPersonRoleName === "user") {
          //now check for the permissions on the loggedin person, not the role
          const adminPermissions = await User.aggregate([
            {
              $match: { _id: currLoggedInPerson },
            },
            {
              $lookup: {
                from: "permissions",
                localField: "permissions",
                foreignField: "_id",
                as: "userPermissions",
              },
            },
          ]);

          adminPermissions[0]?.userPermissions?.forEach((permission) => {
            if (Object.keys(permission).includes(decodedActionType)) {
              if (permission[decodedActionType].includes(decodedAction)) {
                req.role = currUserWithRole[0];
              } else {
                req.role = null;
              }
            } else {
              req.role = null;
            }
          });
        }
        break;
      case "user":
        //check if requested person role name is "admin", if so then just deny the request
        if (
          currUserWithRoleName === "admin" ||
          currUserWithRoleName === "moderator"
        ) {
          req.role = null;
        }

        //check if requested person role name is "user", if so then check the only himself can change his own things
        if (currUserWithRoleName === requestedPersonRoleName) {
          if (currLoggedInPerson.toString() === req.params.id) {
            req.role = currUserWithRole[0];
          } else {
            req.role = null;
          }
        }
        break;
    }

    next();
  } catch (error) {
    return res.status(401).json(new apiErrorHandler(401, "Unauthorized"));
  }
};
