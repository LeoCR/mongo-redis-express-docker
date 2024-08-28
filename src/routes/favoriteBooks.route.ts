import { Router } from "express";
import FavoriteBookModel from "../models/favoriteBooks.model";
import { ObjectId } from "mongodb";
import { redisClient } from "../utils/redis.client";

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
      const { userId } = req.params;
      const redisKey = `favorite-books/${userId}`;

      const cachedData = await redisClient.get(redisKey);
      const cachedBooks = cachedData ? JSON.parse(cachedData) : null;

      const latestBook = await FavoriteBookModel.find({ userId })
        .sort({ updatedAt: -1 })
        .exec();

      if (!latestBook && cachedBooks) {
        return res.json({
          favoriteBooks: cachedBooks,
        });
      }

      const latestUpdatedAt = latestBook.length ? latestBook[0].updatedAt.getTime() : 0;
      const cachedUpdatedAt =
        cachedBooks && cachedBooks.length > 0
          ? new Date(cachedBooks[0].updatedAt).getTime()
          : 0;

      // If the data in MongoDB is newer, update the cache
      if (latestUpdatedAt > cachedUpdatedAt) {
        redisClient.setEx(redisKey, 3600, JSON.stringify(latestBook));

        return res.json({
          favoriteBooks: latestBook,
        });
      } else {
        // If the cache is up to date, return cached data
        return res.json({
          favoriteBooks: cachedBooks,
        });
      }
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
    const existFavoriteBook = await FavoriteBookModel.findById(
      String(req.params.id)
    );
    if (!existFavoriteBook) {
      return res
        .json({
          message: "The Favorite Books list doesn't exists for this user.",
        })
        .status(404);
    }
    const newFavoriteBook = {
        updatedAt: Date.now()
    };

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
