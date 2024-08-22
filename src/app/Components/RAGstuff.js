import {RecursiveCharacterTextSplitter} from "langchain/text_splitter";
import {Pinecone} from '@pinecone-database/pinecone';

const pc = new Pinecone({apiKey: `6ab0b040-9b31-4302-9126-4a003c376152`});
const index = pc.index("professorsvd");


/// Query the database with a given query string and return the top 10 results with their metadata
/// Access the metadata for the original data
export async function queryData(query) {

    const embeddings = await generateEmbeddings(JSON.stringify(query));

    return await index.query({
        topK: 10, vector: embeddings, includeValues: false,
        includeMetadata: true
    });
}

/// Add a professor to the vector database with the given JSON data
export async function addProfessorToVD(data) {
    data = {'passage': data}
    console.log(data)
    const splitDocuments = await splitTextIntoChunks(data);
    const embeddedData = await Promise.all(splitDocuments.map(doc => generateEmbeddings(doc.pageContent)));
    return await upsertData(data, embeddedData);
}

export async function updateProfessorInVD(data) {
    const splitDocuments = await splitTextIntoChunks({'passage': data.metadata});
    const embeddedData = await Promise.all(splitDocuments.map(doc => generateEmbeddings(doc.pageContent)));
    let idk = await Promise.all(embeddedData.map((embedding, i) => (
        index.update({
            id: data.id,
            values: embedding,
            metadata: flattenObject(data.metadata)

        }))))
    console.log(idk)
    return idk;
}

async function upsertData(originalData, data) {
    const flattenedMetadata = flattenObject(originalData.passage);
    const vectors = data.map((embedding, i) => ({
        id: `${Date.now()}-${i}`,
        values: embedding,
        metadata: flattenedMetadata
    }));
    await index.upsert(vectors);
    return vectors;
}

// Utility function to flatten nested objects
function flattenObject(ob) {
    let toReturn = {};

    for (let i in ob) {
        if (!ob.hasOwnProperty(i)) continue;

        if ((typeof ob[i]) === 'object' && ob[i] !== null) {
            const flatObject = flattenObject(ob[i]);
            for (let x in flatObject) {
                if (!flatObject.hasOwnProperty(x)) continue;

                toReturn[i + '.' + x] = flatObject[x];
            }
        } else {
            toReturn[i] = ob[i];
        }
    }
    return toReturn;
}


async function updateData(originalData, data) {
    const vectors = data.map((embedding, i) => ({
        id: `${Date.now()}-${i}`, values: embedding, metadata: JSON.stringify(originalData.passage)
    }));
    await index.upsert(vectors);
    return vectors;
}


async function generateEmbeddings(text) {
    const response = await fetch("https://api-inference.huggingface.co/models/intfloat/multilingual-e5-large", {
        headers: {
            Authorization: `Bearer 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`, "Content-Type": "application/json",
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


