import { Router } from "express";
import FavoriteBookModel from "../models/favoriteBooks.model";
import { ObjectId } from "mongodb";

export const FavoriteBooksRouter = (router: Router) => {
  router.post("/favorite-books", async (req, resp) => {
    try {
      const favoriteBook = new FavoriteBookModel({
        userId: ObjectId.createFromHexString(req.body.userId),
        bookId: ObjectId.createFromHexString(req.body.bookId),
      });
      await favoriteBook.save();
      resp.json({
        favoriteBook,
      });
    } catch (error) {
      resp.status(500).json(error);
    }
  });

  router.get("/favorite-books/:userId", async (req, res) => {
    try {
      const favoriteBooks = await FavoriteBookModel.find({
        userId: {
          $eq: String(req.params.userId),
        },
      });
      return res.json({
        favoriteBooks,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  });

  router.delete("/favorite-books/:userId", async (req, res) => {
    try {
      const { deletedCount } = await FavoriteBookModel.deleteMany({
        userId: {
          $in: req.params.userId,
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
    const existFavoriteBook = await FavoriteBookModel.findById(String(req.params.id));
    if (!existFavoriteBook) {
      return res
        .json({
          message: "The Favorite Books list doesn't exists for this user.",
        })
        .status(404);
    }
    const newFavoriteBook = {};

    for (const [key, value] of Object.entries(req.body)) {
      Object.assign(newFavoriteBook, {
        [key]: value,
      });
    }

    const { modifiedCount } = await FavoriteBookModel.updateOne({
      userId: {
        $eq: existFavoriteBook.userId,
      },
      ...newFavoriteBook,
    });

    return res.json({
      modifiedCount,
      book: newFavoriteBook,
    });
  });

  return router;
};
