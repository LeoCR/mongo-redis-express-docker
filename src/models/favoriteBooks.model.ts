import { Schema, model } from "mongoose";

const FavoriteBookSchema = new Schema({
  userId: {
    type: Schema.ObjectId,
    required: true,
  },
  bookId: { 
    type: Schema.ObjectId,
    required: true
  },
  dateCreated: { type: Date, default: Date.now },
});

const FavoriteBookModel = model("FavoriteBook", FavoriteBookSchema);
export default FavoriteBookModel;
