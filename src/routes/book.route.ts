import { Router } from "express";
import BookModel from "../models/book.model";

export const BookRouter = (router: Router) => {
    router.post("/books", async (request, response) => {
      try {
        const book = new BookModel(request.body);
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
          const books = await BookModel.find({
            year: {
              $gt: 0
            }
          });
          return res.json({
            books
          })
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
      const newBook = {}

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
