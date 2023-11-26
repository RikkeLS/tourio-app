import Place from "../../../../db/models/Place";
import Comment from "../../../../db/models/Comment";
import dbConnect from "../../../../db/dbConnect";
import mongoose from "mongoose";

export default async function handler(request, response) {
  const { id } = request.query;

  if (!id) {
    return;
  }

  await dbConnect();

  if (request.method === "GET") {
    const place = await Place.findById(id).populate('comments');

    if (!place) {
      return response.status(404).json({ status: "Not found" });
    }
    response.status(200).json(place);
  }

  if (request.method === "POST") {
    try {
      const comment = request.body;
      const newComment = await Comment.create(comment);
      // updating the comments array with new ObjectIDs in the places collection:
      const newCommentID = newComment._id
      const place = await Place.findById(id,{comments:1})
      const oldCommentIDs = place['comments']
      const newCommentsArray = [newCommentID,...oldCommentIDs]
      const commentsObject = {'comments':newCommentsArray}
      await Place.findByIdAndUpdate(id, {
        $set: commentsObject,
      });
      return response.status(201).json({ status: "Comment created" });
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }

  if (request.method === "PATCH") {
    await Place.findByIdAndUpdate(id, {
      $set: request.body,
    });
    return response
      .status(200)
      .json({ status: `Place ${request.body.name} updated!` });
  }

  if (request.method === "DELETE") {
    await Place.findByIdAndDelete(id);
    return response.status(200).json({ status: `Place with ${id} is deleted` });
  }
}
