import { Schema, model } from "mongoose";

const FavoriteBookSchema = new Schema({
  bookId: {
    type: Schema.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: Schema.ObjectId,
    required: true,
  },
});

const FavoriteBookModel = model("FavoriteBook", FavoriteBookSchema);
export default FavoriteBookModel;
