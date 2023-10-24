import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const GET = async (request) => {
  const searchTerm = request.nextUrl.searchParams.get("search");

  try {
    await connectToDB();

    const prompts = await Prompt.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'creator',
          foreignField: '_id',
          as: 'creator'
        }
      },
      {
        $match: {
          $or: [
            { prompt: { $regex: searchTerm, $options: "i" } },
            { tag: { $regex: searchTerm, $options: "i" } },
            { 'creator.username': { $regex: searchTerm, $options: "i" } }
          ]
        }
      },
      {
        $project: {
          creator: { $arrayElemAt: ['$creator', 0] },
          prompt: 1,
          tag: 1,
          __v: 1
        }
      }
    ]);

    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch prompts", { status: 500 });
  }
};
