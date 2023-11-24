import Place from "../../../db/models/Place";
import dbConnect from "../../../db/dbConnect";

export default async function handler(request, response) {
  await dbConnect();
  if (request.method === "GET") {
    const places = await Place.find();
    if (!places) {
      return response.status(405).json({ message: "GET method not allowed" });
    }
    return response.status(200).json(places);
  }
  
  if (request.method === 'POST') {
    try {
      const place = request.body;
      await Place.create(place)
      console.log('new place:',place);
      response.status(201).json({status: 'Place created'})
    } catch (error){
      response.status(400).json({error: error.message})
    }
  }
}
