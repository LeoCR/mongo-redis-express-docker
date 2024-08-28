import { Router } from "express";
import BookModel from "../models/book.model";
import { redisClient } from "../utils/redis.client";

export const BookRouter = (router: Router) => {
    router.post("/books", async (request, response) => {
      try {
        const newBook = Object.assign(request.body,{
          updatedAt: Date.now()
        });
        const book = new BookModel(newBook);
        await book.save();
        response.json({
          book,
        });
      } catch (error) {
        response.status(500).json(error);
      }
    });

    router.get("/books", async(req, res) => {
        try {
          const redisKey = "books";
          const cachedData = await redisClient.get(redisKey);
          const cachedBooks = cachedData ? JSON.parse(cachedData) : null;

          const latestBook = await BookModel.find({
            title: {
              $ne: null,
            },
          })
            .sort({ updatedAt: -1 })
            .exec();

          if (!latestBook && cachedBooks) {
            return res.json({
              books: cachedBooks,
            });
          }
          const latestUpdatedAt =
            latestBook && latestBook[0] ? latestBook[0].updatedAt.getTime() : 0;
          const cachedUpdatedAt =
            cachedBooks && cachedBooks.length > 0
              ? new Date(cachedBooks[0].updatedAt).getTime()
              : 0;

          // If the data in MongoDB is newer, update the cache
          if (latestUpdatedAt > cachedUpdatedAt) {
            redisClient.setEx(redisKey, 3600, JSON.stringify(latestBook));

            return res.json({
              books: latestBook,
            });
          } else {
            // If the cache is up to date, return cached data
            return res.json({
              books: cachedBooks,
            });
          }
        } catch (error) {
          res.status(500).json(error);
        }
    });

    router.delete("/books/:id", async (req, res) => {
      try {
        const { deletedCount } = await BookModel.deleteOne({
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

    router.put("/books/:id", async(req,res)=>{
      const existBook = await BookModel.findById(String(req.params.id));
      if(!existBook){
        return res.json({
          message: "Book doesn't exists"
        }).status(404)
      }
      const newBook = {
        updatedAt: Date.now(),
      }

      for(const [key, value] of Object.entries(req.body)){
        Object.assign(newBook, {
          [key]: value,
        })
      }

      const { modifiedCount } = await BookModel.updateOne({
        title: {
          $eq: existBook.title,
        },
        ...newBook,
      });

      return res.json({
        modifiedCount,
        book: newBook,
      })
    })

    return router;
}
