import { Router } from "express";
import UserModel from "../models/user.model";

export const UserRouter = (router: Router) => {
  router.post("/users", async (request, resp) => {
    try {
      const user = new UserModel(request.body);
      await user.save();
      resp.json({
        user,
      });
    } catch (error) {
      resp.status(500).json(error);
    }
  });

  router.get("/users", async (req, res) => {
    try {
      const users = await UserModel.find({
        email: {
          $ne: null,
        },
      });
      return res.json({
        users,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  });

  router.delete("/users/:id", async (req, res) => {
    try {
      const { deletedCount } = await UserModel.deleteOne({
        _id: {
          $eq: req.params.id,
        },
      });
      return res.json({
        deletedCount,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  });

  router.put("/users/:id", async (req, res) => {
    const existUser = await UserModel.findById(String(req.params.id));
    if (!existUser) {
      return res
        .json({
          message: "User doesn't exists",
        })
        .status(404);
    }
    const newUser = {};

    for (const [key, value] of Object.entries(req.body)) {
      Object.assign(newUser, {
        [key]: value,
      });
    }

    const { modifiedCount } = await UserModel.updateOne({
      email: {
        $eq: existUser.email,
      },
      ...newUser,
    });

    return res.json({
      modifiedCount,
      book: newUser,
    });
  });

  return router;
};
