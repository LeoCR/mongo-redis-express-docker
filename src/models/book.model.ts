import {Schema, model} from "mongoose";

const BookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  imageSrc: {
    type: String,
  },
  year: {
    type: Number,
    required: true,
  },
  pages: {
    type: Number,
    required: true,
  },
  dateCreated: { type: Date, default: Date.now },
});

const BookModel = model("Book", BookSchema);
export default BookModel;
