import axios, { AxiosError } from "axios";

export async function talkagpt(apikey: string) {
  try {
    // Use environment variable to store api key
    const openAiClient = axios.create({
      baseURL: "https://api.openai.com",
      headers: {
        Authorization: `Bearer ${apikey}`,
        "Content-Type": "application/json"
      }
    });

    const requestParams = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are helping a user write a TypeScript Express webservice."
        },
        {
          role: "user",
          content: "Tell me about HTTP methods"
        }
      ]
    };

    // Save the response
    openAiClient
      .post("/v1/chat/completions", requestParams)
      .then((res) => {
        console.dir(res);
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
      });

    // Return the data instead of console logging
  } catch (error) {}
}
