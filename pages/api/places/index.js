import Place from "../../../db/models/Place";
import dbConnect from "../../../db/dbConnect";

export default async function handler(request, response) {
  await dbConnect();
  if (request.method === "GET") {
    const places = await Place.find();
    console.log(places);
    return response.status(200).json(places);
  } else {
    return response.status(405).json({ message: "GET method not allowed" });
  }
}
