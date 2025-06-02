// You're using the Appwrite SDK for React Native. These are the tools:
// Client: Sets up the connection to your Appwrite backend.
// Databases: Lets you read/write from databases.
// ID: Helps generate unique document IDs.
// Query: Helps filter or sort data when fetching.

// updateSearchCount(query, movie)	Checks if a movie was searched before. If yes, increase count. If no, create a new entry.

// getTrendingMovies()	Fetches the top 5 most searched movies from Appwrite.

import { Client, Databases, ID, Query } from "react-native-appwrite";

//! means “I guarantee this value exists” (avoids TypeScript error).
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

// Which server to talk to (cloud endpoint)
// Which project it belongs to (project ID)
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);

//Updates how many times a movie has been searched for a specific term.
export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    //It checks if there is already a document with this searchTerm.
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", query),
    ]);

    // add count
    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];
      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        }
      );
    }
    // create new entry and count
    else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        title: movie.title,
        count: 1,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (err) {
    console.error("Error updating search count:", err);
    throw err;
  }
};

//Returns the top 5 movies with the highest search coun
export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    return result.documents as unknown as TrendingMovie[];
  } catch (err) {
    console.error(err);
    return undefined;
  }
};
