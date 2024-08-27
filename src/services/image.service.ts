import axios from "axios";

export const getRandomImage = async (category="books") => {
  try {
    const response = await axios.get(
      "https://api.api-ninjas.com/v1/randomimage",
      {
        headers: {
          "X-Api-Key": process.env.API_NINJAS_KEY,
          Accept: "image/jpg",
        },
        params: { category },
      }
    );
    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    console.error("ImageServiceError: ", error);
    return {
        data: null,
        error: JSON.stringify(error)
    }
  }
};
