import {RecursiveCharacterTextSplitter} from "langchain/text_splitter";
import {Pinecone} from '@pinecone-database/pinecone';
import {getProfessorData} from "@/app/Components/searchRPM";
import Together from "together-ai";

const pc = new Pinecone({apiKey: `6ab0b040-9b31-4302-9126-4a003c376152`});
const index = pc.index("professorsvd");

export async function queryData(query) {
    const embeddings = await generateEmbeddings(JSON.stringify(query));
    return await index.query({
        topK: 10, vector: embeddings, includeValues: false, includeMetadata: true
    });
}

export async function addProfessorToVD(data) {
    try {

        data = await getProfessorData(data);

        // console.log("Professor Data:", data);
        const stringifiedJson = JSON.stringify({
            name: data.data.node.firstName + " " + data.data.node.lastName,
            department: data.data.node.department,
            avgDifficulty: data.data.node.avgDifficulty,
            avgRating: data.data.node.avgRating,
            numRatings: data.data.node.numRatings,
            school: `${data.data.node.school.name} at ${data.data.node.school.city} in ${data.data.node.school.country}`,
        }).replace(/null/g, '""');

        let isInDb = await queryData(data.data.node.firstName + " " + data.data.node.lastName);

        console.log("isInDb:", isInDb)

        console.log("Is found:", isInDb.matches[0].metadata.name === (data.data.node.firstName + " " + data.data.node.lastName));
        if (isInDb.matches[0].metadata.name !== (data.data.node.firstName + " " + data.data.node.lastName)) {
            const embeddedData = await generateEmbeddings(stringifiedJson);
            await upsertData({
                passage: {
                    ...JSON.parse(stringifiedJson),
                    ratings: data.data.node.ratings.edges.map(rating => `${rating?.node?.class}: ${rating?.node?.comment}, difficulty rating: ${rating?.node?.difficultyRating}`).slice(0, 4),
                    relatedTeachers: data.data.node.relatedTeachers
                }
            }, embeddedData);
        }

        return {success: true, ...JSON.parse(stringifiedJson)}
    } catch (e) {
        console.error("Error adding professor to VD:", e);
        return {success: false, reason: data.errors[0].message};
    }
}

export async function updateProfessorInVD(data) {
    const splitDocuments = await splitTextIntoChunks({'passage': data.metadata});
    const embeddedData = await Promise.all(splitDocuments.map(doc => generateEmbeddings(doc.pageContent)));
    const flattenedMetadata = flattenObject(data.metadata);
    return await Promise.all(embeddedData.map((embedding, i) => (index.update({
        id: data.id, values: embedding, metadata: flattenedMetadata
    }))));
}

async function upsertData(originalData, data) {
    const flattenedMetadata = flattenObject(originalData.passage);

    return await index.upsert([{id: `${Date.now()}`, values: data, metadata: flattenedMetadata}]);
}

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


    const together = new Together({apiKey: process.env.TOGETHER_API_KEY});

    const response = await together.embeddings.create({
        model: "WhereIsAI/UAE-Large-V1", input: text.slice(0, 2049)
    });

    // console.log("Generated Embeddings:", response.data)

    return response.data[0].embedding;

}

async function splitTextIntoChunks(data) {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 512, chunkOverlap: 1,
    });

    return await splitter.createDocuments([JSON.stringify(data)]);
}