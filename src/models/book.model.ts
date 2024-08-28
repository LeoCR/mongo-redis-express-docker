import {Schema, model} from "mongoose";

const BookSchema = new Schema({
  author: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  country: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  imageSrc: {
    type: String,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  pages: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
});

const BookModel = model("Book", BookSchema);
export default BookModel;
