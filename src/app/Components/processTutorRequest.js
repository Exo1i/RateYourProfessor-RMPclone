'use server'
import handleTutorRequest from "@/app/Components/handleTutorRequest";
import Together from "together-ai";
import validDepartments from "../../../public/validDepartments";

export async function processTutorRequest(data) {
    const together = new Together({apiKey: process.env.TOGETHER_API_KEY});

    async function generateAIResponse(messages, context = null) {
        const systemInstructions = {
            "role": "system",
            "content": `You are an AI tutor recommendation assistant. CRUCIAL: You must ONLY use the data and methods provided through the specified API calls. DO NOT rely on or reference any pre-existing knowledge about professors or educational institutions. Follow these guidelines strictly:

1. ALWAYS use double quotes "" for JSON, never single quotes ''.
2. WAIT for user queries. DO NOT initiate conversations.
3. For specific tutor queries (e.g., "Ahmad Hamdy"), ALWAYS respond with:
   {"operation":"query", "data":"Ahmad Hamdy", "type":"tutorSearch"}
4. For similar tutors in a department (e.g., "like John Doe in Computer Science"), ALWAYS respond with:
   {"operation":"query", "data":"Computer Science", "type":"departmentSearch"}
5. For department queries (e.g., "Computer Science tutors"), ALWAYS respond with:
   {"operation":"query", "data":"Computer Science", "type":"departmentSearch"}
6. For similar tutors to a specific tutor, ALWAYS respond with:
   {"operation":"query", "data":"John Doe", "type":"recommendTutors"}
7. For RateMyProfessor URL queries, ALWAYS respond with:
   {"operation":"upsert", "data":"teacher-id", "type":"addTutorToVD"}
8. To parse a tutor's RateMyProfessor page, ALWAYS respond with:
   {"operation":"query", "data":"teacher-id", "type":"parseTutor"}
9. When given context from a previous operation, DO NOT respond with JSON. Instead, provide a normal response based ONLY on the given context.
10. Only use departments from this list: ${JSON.stringify(validDepartments)}. If not found, inform the user.
11. NEVER reveal department IDs in responses.
12. If you're unsure or don't have information, admit it clearly. DO NOT make up or infer information about any professor.

Remember: You have NO pre-existing knowledge about specific professors or institutions. ALL information MUST come from the API responses.`
        };

        if (context) {
            messages = [
                ...messages,
                {
                    role: 'system',
                    content: `Context from previous operation: ${JSON.stringify(context)}. Provide a helpful response based ONLY on this context. DO NOT add any information not present in this context.`
                }
            ];
        }

        const chatResponse = await together.chat.completions.create({
            messages: [systemInstructions, ...messages],
            model: "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
            max_tokens: 512,
            temperature: 0.9,
            top_p: 0.7,
            top_k: 50,
            repetition_penalty: 1,
            stop: ["<|eot_id|>", "<|eom_id|>"],
            stream: false
        });

        return chatResponse.choices[0].message.content;
    }

    const initialResponse = await generateAIResponse(data.messages);

    if (initialResponse.includes('operation') && initialResponse.includes('{')) {
        const {text: jsonResponseText, context} = await processJsonResponse(initialResponse);

        const updatedMessages = [
            ...data.messages,
            {role: "assistant", content: jsonResponseText}
        ];
        const finalResponse = await generateAIResponse(updatedMessages, context);

        return {text: finalResponse};
    }

    return {text: initialResponse};
}

async function processJsonResponse(response) {
    try {
        let jsonString = response.slice(response.indexOf('{'), response.lastIndexOf('}') + 1).replace(/'/g, '"');
        let parsedJson = JSON.parse(jsonString)
        const {success, responseMessage, context} = await handleTutorRequest(parsedJson);
        console.log("Success:", success, "Response Message:", responseMessage, "Context:", context);
        return {text: responseMessage, context: context};
    } catch (error) {
        console.error("Error processing JSON response:", error, "\nResponse:", response);
        return {
            text: "An error occurred while processing your request.",
            context: {resultType: 'error', error: error.message}
        };
    }
}