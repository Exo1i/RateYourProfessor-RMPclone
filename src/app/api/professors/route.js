import {addProfessorToVD, queryData, updateProfessorInVD} from "@/app/Components/RAGstuff";

export async function GET(request) {
    let resp = (await queryData('')).matches.map((match) => ({id: match.id, metadata: match.metadata}));
    return new Response(
        JSON.stringify(resp), {
            status: 200,
        }
    );
}

export async function POST(request) {
    let data = await request.json();


    const addResp = await addProfessorToVD(data);
    return new Response(
        JSON.stringify({success: true, message: "Professor added successfully", data: addResp}), {
            status: 200,
        }
    );


}

export async function PUT(request) {
    let data = await request.json();


    const updateResp = await updateProfessorInVD(data);
    return new Response(
        JSON.stringify({success: true, message: "Professor updated successfully", data: updateResp}), {
            status: 200,
        });


}
