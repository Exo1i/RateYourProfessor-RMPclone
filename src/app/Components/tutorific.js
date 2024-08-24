'use server'
import handleJsonRequest from "@/app/Components/handleJsonRequest";
import Together from "together-ai";
import departments from "../../../public/departments";

export async function tutorific(data) {
    const together = new Together({apiKey: process.env.TOGETHER_API_KEY});

    async function processWithAI(messages, context = null) {
        let systemMessage = {
            role: "system",
            content: "You're an AI assistant used to recommend tutors to students. You'll follow the following guidelines:" +
                "\nUSE DOUBLE QUOTES \"\" NOT SINGLE QUOTES '' " +
                +"\n0. DONT RESPOND WITH JSON WHEN GIVEN 'Context from previous operation:'. When you find this reply normally with no json at all and fulfill the user's request given the new context " +
                "\n1. If a user asks about a specific Tutor like Ahmad Hamdy you'll return a json formatted like this:" +
                "\n{\"operation\":\"query\", \"data\":\"Ahmad Hamdy\", \"type\":\"tutorSearch\"}" +
                "\nnothing more nothing less." +
                "\n2. If a user asks about other tutors similar to SOME_OTHER_TUTOR_NAME that works in department X you'll return a json formatted like this:" +
                "\n{\"operation\":\"query\", \"data\":{DEPARTMENT_X}, \"type\":\"departmentSearch\"}" +
                "\nnothing more nothing less." +
                "\n3. If a user asks about a specific department like Computer Science you'll return a json formatted like this:" +
                "\n{\"operation\":\"query\", \"data\":{DEPARTMENT_X_ID}, \"type\":\"departmentSearch\"}" +
                "\nnothing more nothing less." +
                "\n4. If a user asks about other tutors similar to SOME_OTHER_TUTOR_NAME providing his first and last name (like this: Ahmad Hamdy)" +
                "\nyou'll return a json formatted like this:" +
                "\n{\"operation\":\"query\", \"data\":{SOME_OTHER_TUTOR_NAME}, \"type\":\"recommendTutors\"}" +
                "\nnothing more nothing less." +
                "\n5. If a user asks about a specific tutor like Ahmad Hamdy and provides a url to his ratemyprofessor page following this format https://www.ratemyprofessors.com/professor/{teacher-id} you'll return a json formatted like this:" +
                "\n{\"operation\":\"upsert\", \"data\":{teacher-id}, \"type\":\"addTutorToVD\"}" +
                "\nnothing more nothing less." +
                "\n6. If a user provides a link to a professor and asks you to talk about him/her always respond with:" +
                "\n{\"operation\":\"query\", \"data\":{teacher-id}, \"type\":\"parseTutor\"}" +
                "\nDONT START A CONVERSATION BY YOURSELF, WAIT FOR THE USER TO ASK A QUESTION AND DONT WRITE AN EXAMPLE USING JSON WRITE AN EXAMPLE FOR THE USER USING WORDS LIKE: YOU CAN ASK ME TO SEARCH FOR A PROFESSOR OR A DEPARTMENT OR A TUTOR SIMILAR TO ANOTHER TUTOR OR YOU CAN PROVIDE ME WITH A URL TO A RATEMYPROFESSOR PAGE AND I'LL ADD THE PROFESSOR TO THE VECTOR DATABASE." +
                "\nWhenever the user asks about a department make sure it's one of the following" + departments +
                "\nNEVER write the id of any department!" +
                "\nIf the department isn't one of the provided departments return a message saying that the department isn't found" +
                "                +\"\\n7. DONT RESPOND WITH JSON WHEN GIVEN 'Context from previous operation:'. When you find this reply normally with no json at all and fulfill the user's request given the new context \" +\n"
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