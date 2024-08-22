import {RecursiveCharacterTextSplitter} from "langchain/text_splitter";
import {Pinecone} from '@pinecone-database/pinecone';

const pc = new Pinecone({apiKey: process.env.PINECONE_API_KEY});
const index = pc.index("professorsvd");


/// Query the database with a given query string and return the top 10 results with their metadata
/// Access the metadata for the original data
export async function queryData(query) {
    const embeddings = await generateEmbeddings(JSON.stringify(query));
    // console.log(JSON.stringify(embeddings))
    return await index.query({
        topK: 10, vector: embeddings, includeValues: false,
        includeMetadata: true
    });
}

/// Add a professor to the vector database with the given JSON data
export async function addProfessorToVD(data) {
    data = {'passage': data}
    const splitDocuments = await splitTextIntoChunks(data);
    const embeddedData = await Promise.all(splitDocuments.map(doc => generateEmbeddings(doc.pageContent)));
    return await upsertData(data, embeddedData);
}

export async function updateProfessorInVD(data) {
    data = {'passage': data}
    const splitDocuments = await splitTextIntoChunks(data);
    const embeddedData = await Promise.all(splitDocuments.map(doc => generateEmbeddings(doc.pageContent)));
    return await upsertData(data, embeddedData);
}

async function upsertData(originalData, data) {
    const vectors = data.map((embedding, i) => ({
        id: `${Date.now()}-${i}`, values: embedding, metadata: originalData.passage
    }));
    await index.upsert(vectors);
    return vectors;
}

async function updateData(originalData, data) {
    const vectors = data.map((embedding, i) => ({
        id: `${Date.now()}-${i}`, values: embedding, metadata: originalData.passage
    }));
    await index.upsert(vectors);
    return vectors;
}


async function generateEmbeddings(text) {
    const response = await fetch("https://api-inference.huggingface.co/models/intfloat/multilingual-e5-large", {
        headers: {
            Authorization: `Bearer ${process.env.HF_ACCESS_TOKEN}`, "Content-Type": "application/json",
        }, method: "POST", body: JSON.stringify({inputs: text}),
    });

    if (response.status === 503) {
        const respBody = await response.json();
        await new Promise(resolve => setTimeout(resolve, Math.ceil(respBody.estimated_time * 2 / 3) * 1000));
        return generateEmbeddings(text);
    } else if (response.status !== 200) {
        console.log("Error: ", response.status);
        console.log("Response: ", await response.text());
        throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
}

async function splitTextIntoChunks(data) {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 512, chunkOverlap: 1,
    });

    return await splitter.createDocuments([JSON.stringify(data)]);
}


