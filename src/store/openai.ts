import {defineStore} from "pinia";
import {Configuration, OpenAIApi, CreateChatCompletionRequest, ChatCompletionRequestMessage} from "openai";
import {ChatCompletionRequestMessageRoleEnum} from "openai/api";

export const useOpenAIStore = defineStore({
    id: "openAIStore",
    state: () => ({
        openAI: null as OpenAIApi | null,
        messages: [] as ChatCompletionRequestMessage[],
    }),
    getters: {
        getOpenAI(): any {
            return this.openAI;
        },
        getMessages(): ChatCompletionRequestMessage[] {
            return this.messages;
        }
    },
    actions: {
        async setupOpenAI(sk: string) {
            this.openAI = null;
            let configuration = new Configuration({
                apiKey: sk,
                basePath: "https://chatapi.t502.fun/v1",
            });
            this.openAI = new OpenAIApi(configuration);

            this.messages = []

            let messages: ChatCompletionRequestMessage[] = [
                {
                    "role": "system",
                    "content": "用中文回复我"
                },
            ]
            this.messages.push({
                "role": "system",
                "content": "用中文回复我"
            })
            let req: CreateChatCompletionRequest = {
                model: 'gpt-3.5-turbo-0613',
                messages: messages,
            }

            let resp = await this.openAI.createChatCompletion(req)
            // @ts-ignore
            this.messages.push(resp.data.choices[0].message)

        },
        sendMessage(message: string) {
            this.messages.push({
                "role": "user",
                "content": message
            })
            this.openAI?.createChatCompletion({
                model: 'gpt-3.5-turbo-0613',
                messages: this.messages,
            }).then(resp => {
                // @ts-ignore
                this.messages.push(resp.data.choices[0].message)
            })
        }
    },

})