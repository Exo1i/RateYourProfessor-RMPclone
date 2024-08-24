import {queryData, updateProfessorInVD} from "@/app/Components/RAGstuff";
//
//  !TO BE DELETED!
//
export async function GET(request) {
    const {searchParams} = new URL(request.url);
    const data = searchParams.get('data');
    const type = searchParams.get('type');

    console.log(data, type);

    let resp;

    if (type === 'tutorSearch') {
        const [firstName, lastName] = data.split(' ');
        resp = (await queryData(JSON.stringify({
            firstName,
            lastName
        }))).matches.map((match) => ({
            id: match.id,
            metadata: match.metadata
        }));
    } else if (type === 'departmentSearch') {
        resp = (await queryData(JSON.stringify({
            department: data
        }))).matches.map((match) => ({
            id: match.id,
            metadata: match.metadata
        }));
    } else {
        resp = (await queryData('')).matches.map((match) => ({
            id: match.id,
            metadata: match.metadata
        }));
    }

    return new Response(JSON.stringify(resp), {
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
