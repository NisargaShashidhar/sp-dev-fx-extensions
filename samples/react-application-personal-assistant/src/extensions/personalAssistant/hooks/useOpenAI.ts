import * as React from 'react';
import { HttpClient } from "@microsoft/sp-http";
import { OPENAI_API_KEY, GPT_MODELTO_USE } from '../constants/constants';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useOpenAI = (httpClient: HttpClient) => {

    const callOpenAI = React.useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async (messages: any[], functions: any[]) => {
            try {

                const endpoint: string = "https://ca-web-lwaqutnfw7yny.yellowcliff-105b26b2.eastus2.azurecontainerapps.io/chat";
                //const endpoint: string = OPENAI_API_ENDPOINT;

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const requestHeaders: any = {};
                requestHeaders['Content-Type'] = 'application/json';
                // eslint-disable-next-line dot-notation
                requestHeaders['Authorization'] = `Bearer ${OPENAI_API_KEY}`;

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const chatHistory: any[] = [];
                for (const message of messages) {
                    const chatRole: string = message.title;
                    const chatContent: string = message.text;
                    const chat: any = {};
                    chat.role = chatRole;
                    chat.content = chatContent;
                    chatHistory.push(chat);
                }

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const requestOverrides: any = {};
                requestOverrides.model = GPT_MODELTO_USE;
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
                requestOverrides.lastUserQuestion = messages.length > 0 ? messages[messages.length - 1].text : ""; // Assuming the last message text is the last user question
                requestOverrides.approach = 0; // Assuming approach is a fixed value as in the example

                const response = await httpClient.post(
                    endpoint,
                    HttpClient.configurations.v1,
                    {
                        headers: requestHeaders,
                        body: JSON.stringify(requestOverrides)
                    }
                );


                //single question asked
                //{"messages":
                    //[{"role": "user", "content": "How often does the Quality Council meet?", "isUser": true}],
                //"overrides": { "semantic_ranker": false, "retrieval_mode": "Vector",
                    //"semantic_captions": null, "exclude_category": [], "top": 3, "temperature": null, "prompt_template": null,
                    //"prompt_template_prefix": null, "prompt_template_suffix": null, "suggest_followup_questions": true, "use_gpt4v": false,
                    //"use_oid_security_filter": false, "use_groups_security_filter": false, "vector_fields": false},
                //"lastUserQuestion": "How often does the Quality Council meet?", "approach": 0}

                //multiple questions asked
                //{"messages":[{"role":"user","content":"How often does the Quality Council meet?","isUser":true},
                    //{"role":"assistant","content":"The Quality Council meets at least monthly, with the possibility of more frequent meetings upon request or at the discretion of QA or executive leadership team. [QA-021-1.pdf] \u003C\u003CWho is responsible for scheduling the Quality Council meetings?\u003E\u003E  \u003C\u003CWhat is the purpose of the Quality Council meetings?\u003E\u003E  \u003C\u003CAre the Quality Council meetings open to all employees or only specific individuals?\u003E\u003E ","isUser":false},
                    //{"role":"user","content":"What is the purpose of the Quality Council meetings?","isUser":true}],
                //"overrides":{"semantic_ranker":false,"retrieval_mode":"Vector","semantic_captions":null,"exclude_category":[],"top":3,"temperature":null,"prompt_template":null,
                    //"prompt_template_prefix":null,"prompt_template_suffix":null,"suggest_followup_questions":true,"use_gpt4v":false,"use_oid_security_filter":false,"use_groups_security_filter":false,"vector_fields":false},
                //"lastUserQuestion":"What is the purpose of the Quality Council meetings?","approach":0}




                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                /*const request: any = {};
                request.model = GPT_MODELTO_USE;
                request.messages = messages;
                request.functions = functions;*/
                /* 
                    "temperature": 0,
                    "max_tokens": 256,
                    "top_p": 1.0,
                    "frequency_penalty": 0.0,
                    "presence_penalty": 0.0
                 */

                /*request.temperature = 0;
                request.max_tokens = 256;
                request.top_p = 1.0;
                request.frequency_penalty = 0.0;
                request.presence_penalty = 0.0;

                const response = await httpClient.post(
                    endpoint,
                    HttpClient.configurations.v1,
                    {
                        headers: requestHeaders,
                        body: JSON.stringify(request)
                    }
                );*/

                console.log('response', response);

                if(!response.ok) {
                    console.error('Error:', response);
                    return undefined;
                }

                const result = await response.json();
                console.log('OpenAI API result - ', result);
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