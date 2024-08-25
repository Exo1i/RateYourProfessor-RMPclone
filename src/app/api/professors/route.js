import {
    addProfessorToVD,
    generateEmbeddings,
    queryData,
    updateProfessorInVD,
    upsertData
} from "@/app/Components/RAGstuff";


export async function GET(request) {

    let resp = (await queryData('school')).matches.map((match) => ({
        id: match.id, metadata: match.metadata
    }));
    console.log("Response:", resp)

    return new Response(JSON.stringify(resp), {
        status: 200,
    });
}

export async function POST(request) {
    let data = await request.json();

    console.log(data);
    try {

        if (data.id.includes('manuallyAdded')) {
            let isInDb = await queryData(data.name);
            console.log("isInDb:", isInDb)
            if (isInDb.matches.length !== 0 && isInDb.matches[0].metadata.name === (data.name)) {
                console.log("Is found:", isInDb.matches[0].metadata.name === (data.name))
            } else if (data.id.includes('manuallyAdded')) {
                console.log('adding manually added professor to VD:', data);
                const embedding = await generateEmbeddings(data);
                await upsertData({passage: data}, embedding);
            }
        } else {
            addProfessorToVD(data.id)
        }

    } catch
        (e) {
        console.error("Error adding professor to VD:", e);
        return new Response(JSON.stringify({
            success: false, reason: data.errors[0].message
        }), {
            status: 400,
        });
    }
    return new Response(JSON.stringify({
        success: true, message: "Professor added successfully"
    }), {
        status: 200,
    });

}

export async function PUT(request) {
    let data = await request.json();


    const updateResp = await updateProfessorInVD(data);
    return new Response(JSON.stringify({
        success: true, message: "Professor updated successfully", data: updateResp
    }), {
        status: 200,
    });


}
