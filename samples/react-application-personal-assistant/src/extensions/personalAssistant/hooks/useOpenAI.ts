import * as React from 'react';
import { HttpClient } from "@microsoft/sp-http";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useOpenAI = (httpClient: HttpClient) => {

    const callOpenAI = React.useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async (messages: any[], functions: any[]) => {
            try {
                

                //const endpoint: string = OPENAI_API_ENDPOINT;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const requestHeaders: any = {};
                requestHeaders['Content-Type'] = 'application/json';

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const chatHistory: any[] = [];
                class chat {
                    role: string;
                    content: string;
                    isUser: boolean;
                }

                for (const message of messages) {

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                   
                    const thischat: chat = new chat();
                    thischat.role = message.title === "You" ? "user" : "assistant";
                    thischat.content = message.msg;
                    thischat.isUser = message.title === "You" ? true : false;
                    chatHistory.push(thischat);
                }

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const requestOverrides: any = {};
                requestOverrides.messages = chatHistory; // Assuming chatHistory is correctly formatted as in the example
                requestOverrides.overrides = {
                    semantic_ranker: false,
                    retrieval_mode: "Vector",
                    semantic_captions: null, // Changed from false to null
                    exclude_category: [], // Changed from null to an empty array
                    top: 3,
                    temperature: null, // Changed from 0 to null
                    prompt_template: null,
                    prompt_template_prefix: null,
                    prompt_template_suffix: null,
                    suggest_followup_questions: true,
                    use_gpt4v: false,
                    use_oid_security_filter: false,
                    use_groups_security_filter: false,
                    vector_fields: false
                };
                requestOverrides.approach = 0; // Assuming approach is a fixed value as in the example


                const endpoint: string = "https://ca-web-lwaqutnfw7yny.yellowcliff-105b26b2.eastus2.azurecontainerapps.io/api/chat";
                const response1 = await httpClient.post(
                    endpoint,
                    HttpClient.configurations.v1,
                    {
                        headers: requestHeaders,
                        body: JSON.stringify(requestOverrides)
                    }
                );
                if (!response1.ok) {
                    console.error('Error:', response1);
                    return undefined;
                }
                const result = await response1.json();
               

                return result;
            } catch (error) {
                if (!DEBUG) {
                    console.error('Error:', error);
                }
                return undefined;
            }
        },
        [httpClient]
    );

    /* const callOpenAI_GPT35 = React.useCallback(
        async (messages: any[], functions: any[]) => {
            return await callOpenAI(messages, functions, "gpt-3.5-turbo-0613");
        },
        [callOpenAI]
    );

    const callOpenAI_GPT4 = React.useCallback(
        async (messages: any[], functions: any[]) => {
            return await callOpenAI(messages, functions, "gpt-4-0613");
        },
        [callOpenAI]
    ); */

    return { callOpenAI };
};