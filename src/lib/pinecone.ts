import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { Vector } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch";
import { promises as fs } from "fs"; // Import the promises API from 'fs' for async file operations
import { Document } from "langchain/document";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import md5 from "md5";
import { getEmbeddings } from "./embeddings";
import { downloadFromS3 } from "./s3-server";
import { convertToAscii } from "./utils";

let pinecone: Pinecone | null = null;

export const getPineconeClient = async () => {
  if (!pinecone) {
    pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
  }
  return pinecone;
};

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};
// interface Config {
//   id: string;
//   values?: number[];
//   metadata: any; // Replace 'any' with a more specific type if needed
// }
async function logVectorsToFile(vectors: any[]) {
  const filePath = "./vectors.log"; // Specify the path to the log file
  const contentToLog = JSON.stringify(vectors, null, 2); // Convert vectors to formatted JSON string

  try {
    await fs.appendFile(filePath, contentToLog + "\n"); // Append the content to the log file with a new line
    console.log(`Successfully logged vectors to ${filePath}`);
  } catch (error) {
    console.error(`Failed to log vectors to file: ${error}`);
  }
}
export async function loadS3IntoPinecone(file_key: string) {
  try {
    console.log("Downloading S3 object into file system");
    const file_name = await downloadFromS3(file_key);

    console.log(`Loading PDF into memory: ${file_name}`);
    const loader = new PDFLoader(file_name!);
    const pages = (await loader.load()) as PDFPage[];

    console.log("Preparing documents");
    const documents = await Promise.all(pages.map(prepareDocument));

    console.log(`Number of documents: ${documents.length}`);

    console.log("Vectorizing and embedding individual documents");
    let vectors = await Promise.all(documents.flat().map(embedDocument));
    console.log("Vectors", vectors);
    vectors = vectors.filter((v) => v?.values !== undefined);
    await logVectorsToFile(vectors);

    console.log("Uploading vectors to Pinecone");
    const client = await getPineconeClient();
    const pineconeIndex = client.Index("chatpdf");

    console.log("Inserting embeddings into Pinecone");
    const namespace = convertToAscii(file_key);

    // Use the upsert method correctly by awaiting its result
    await pineconeIndex
      .namespace(namespace)
      .upsert(vectors as PineconeRecord[]);

    return documents;
  } catch (err) {
    console.error("An error occurred:", err); // Log the error for debugging purposes

    // Rethrow a more specific error message depending on where the error occurred
    throw err instanceof Error
      ? err
      : new Error(`Error in loadS3IntoPinecone: ${err}`);
  }
}

async function embedDocument(doc: Document) {
  try {
    const embedding = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);
    return {
      id: hash,
      values: embedding,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as Vector;
  } catch (error) {
    console.log("Error embedding document", error);
  }
}

export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

async function prepareDocument(page: PDFPage) {
  let { pageContent, metadata } = page;

  pageContent = pageContent.replace(/(\r\n|\n|\r)/gm, " ");
  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        //we are doing this because to vectorise it will be too long
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);
  return docs;
}
