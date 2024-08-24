import {generateEmbeddings, queryData, updateProfessorInVD, upsertData} from "@/app/Components/RAGstuff";
//
//  !TO BE DELETED!
//
export async function GET(request) {

    let resp = (await queryData('')).matches.map((match) => ({
        id: match.id,
        metadata: match.metadata
    }));


    return new Response(JSON.stringify(resp), {
        status: 200,
    });
}

export async function POST(request) {
    let data = await request.json();

    console.log(data);
    try {
        const embedding = await generateEmbeddings(data);

        await upsertData({passage: data}, embedding);
    } catch (e) {
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
