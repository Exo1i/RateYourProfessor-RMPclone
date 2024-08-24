'use server'
import handleJsonRequest from "@/app/Components/handleJsonRequest";
import Together from "together-ai";
import departments from "../../../public/departments";

export async function tutorific(data) {
    const together = new Together({apiKey: process.env.TOGETHER_API_KEY});

    async function processWithAI(messages, context = null) {
        let systemMessage = {
            "role": "system",
            "content": "You're an AI assistant used to recommend tutors to students. You'll follow these guidelines:" +
                "\nUSE DOUBLE QUOTES \"\" NOT SINGLE QUOTES '' " +

                "\n0. WAIT for the user's query and DO NOT initiate a conversation." +

                "\n1. When a user asks about a specific tutor, such as Ahmad Hamdy, respond with a JSON like this:" +
                "\n{\"operation\":\"query\", \"data\":\"Ahmad Hamdy\", \"type\":\"tutorSearch\"}" +

                "\n2. When a user asks about tutors similar to SOME_OTHER_TUTOR_NAME in a specific department X, respond with a JSON like this:" +
                "\n{\"operation\":\"query\", \"data\":\"{DEPARTMENT_X}\", \"type\":\"departmentSearch\"}" +

                "\n3. When a user asks about a specific department like Computer Science, respond with a JSON like this:" +
                "\n{\"operation\":\"query\", \"data\":\"{DEPARTMENT_X_ID}\", \"type\":\"departmentSearch\"}" +

                "\n4. When a user asks about other tutors similar to SOME_OTHER_TUTOR_NAME, using the tutor's first and last name (e.g., Ahmad Hamdy), respond with a JSON like this:" +
                "\n{\"operation\":\"query\", \"data\":\"{SOME_OTHER_TUTOR_NAME}\", \"type\":\"recommendTutors\"}" +

                "\n5. When a user provides a URL to a tutor's RateMyProfessor page (e.g., https://www.ratemyprofessors.com/professor/{teacher-id}) and asks about the tutor, respond with a JSON like this:" +
                "\n{\"operation\":\"upsert\", \"data\":\"{teacher-id}\", \"type\":\"addTutorToVD\"}" +

                "\n6. When a user provides a URL to a tutor's RateMyProfessor page and asks you to talk about the tutor, respond with a JSON like this:" +
                "\n{\"operation\":\"query\", \"data\":\"{teacher-id}\", \"type\":\"parseTutor\"}" +

                "\n7. If you receive 'Context from previous operation:', DO NOT respond with JSON. Instead, reply normally and fulfill the user's request based on the provided context." +

                "\n8. If the user asks about a department, ensure it's one of the following: " + departments +
                ". If the department isn't one of the provided departments, respond with a message saying that the department isn't found." +

                "\n9. DO NOT reveal or include any department IDs in your responses." +

                "\nYou can tell the user: 'You can ask me to search for a professor, a department, or tutors similar to another tutor, or you can provide a URL to a RateMyProfessor page, and I'll add the professor to the vector database.'"
        };


        if (context) {
            messages = [
                ...messages,
                {
                    role: 'system',
                    content: "Context from the previous operation: " + JSON.stringify(context) + " Use this information to provide a helpful response to the user's request."
                }
            ];
        }

        const chatResponse = await together.chat.completions.create({
            messages: [systemMessage, ...messages],
            model: "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
            max_tokens: 512,
            temperature: 0.7,
            top_p: 0.7,
            top_k: 50,
            repetition_penalty: 1,
            stop: ["<|eot_id|>", "<|eom_id|>"],
            stream: false
        });

        return chatResponse.choices[0].message.content;
    }

    // First AI processing
    const initialAIResponse = await processWithAI(data.messages);

    if (initialAIResponse.includes('operation') && initialAIResponse.includes('{')) {
        // Handle JSON response
        const {text: jsonResponseText, context} = await handleMessage(initialAIResponse);

        // Second AI processing with the JSON response and context
        const updatedMessages = [
            ...data.messages,
            {role: "assistant", content: jsonResponseText}
        ];
        const finalAIResponse = await processWithAI(updatedMessages, context);

        return {text: finalAIResponse};
    }

    return {text: initialAIResponse};
}

async function handleMessage(message) {
    try {
        let slicedMessage = message.slice(message.indexOf('{'), message.lastIndexOf('}') + 1).replace(/'/g, '"');
        let jsonResp = JSON.parse(slicedMessage)
        const {success, responseMessage, context} = await handleJsonRequest(jsonResp);
        console.log("Success:", success, "Response Message:", responseMessage, "Context:", context);
        return {text: responseMessage, context: context};
    } catch (error) {
        console.error("Error Handling Json Response:", error, "\nMessage:", message);
        return {
            text: "Sorry, there was an error processing your request.",
            context: {resultType: 'error', error: error.message}
        };
    }
}