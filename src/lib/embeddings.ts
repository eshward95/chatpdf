import { Configuration, OpenAIApi } from "openai-edge";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

export async function getEmbeddings(text: string) {
  try {
    const response = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: text.replace(/(\r\n|\n|\r)/gm, " "),
    });
    const result = await response.json();
    return result.data[0].embedding as number[];
  } catch (error) {
    console.log("error calling openai", error);
  }
}
// const response = await openai.createImage({
//   prompt: "A cute baby sea otter",
//   size: "512x512",
//   response_format: "url",
// });

// const data = (await response.json()) as ResponseTypes["createImage"];

// const url = data.data?.[0]?.url;

// console.log({ url });
