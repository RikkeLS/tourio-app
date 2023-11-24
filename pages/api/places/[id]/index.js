import Place from "../../../../db/models/Place";
import Comment from "../../../../db/models/Comment";
import dbConnect from "../../../../db/dbConnect";

export default async function handler(request, response) {
  const { id } = request.query;

  if (!id) {
    return;
  }

  await dbConnect();

  if (request.method === "GET") {
    const place = await Place.findById(id);

    if (!place) {
      return response.status(404).json({ status: "Not found" });
    }
    response.status(200).json(place);
  }

  if (request.method === "POST") {
    try {
      const comment = request.body;
      console.log(comment);
      await Comment.create(comment);
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
