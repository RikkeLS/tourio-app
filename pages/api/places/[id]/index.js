import Place from "../../../../db/models/Place";
import dbConnect from "../../../../db/dbConnect";

import { db_comments } from "../../../../lib/db_comments";

export default async function handler(request, response) {
  const { id } = request.query;

  if (!id) {
    return;
  }

  await dbConnect();

  if (request.method === "GET") {
    const place = await Place.findById(id);

    const comment = place?.comments;
    const allCommentIds = comment?.map((comment) => comment.$oid) || [];
    const comments = db_comments.filter((comment) =>
      allCommentIds.includes(comment._id.$oid)
    );

    if (!place) {
      return response.status(404).json({ status: "Not found" });
    }
    response.status(200).json({ place: place, comments: comments });
  }

  if (request.method === "PATCH") {
    await Place.findByIdAndUpdate(id, {
      $set: request.body,
    });
    response.status(200).json({ status: `Place ${id} updated!` });
  }
}
