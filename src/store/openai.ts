import {defineStore} from "pinia";
import {Configuration, OpenAIApi, CreateChatCompletionRequest, ChatCompletionRequestMessage} from "openai";
import {ChatCompletionRequestMessageRoleEnum} from "openai/api";
import {db} from "../utils/db";

const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

interface messageListEntity {
    id: string,
    messages: ChatCompletionRequestMessage[]
}


export const useOpenAIStore = defineStore({
    id: "openAIStore",
    state: () => ({
        openAI: null as OpenAIApi | null,
        messages: [] as ChatCompletionRequestMessage[],
        activeId: '',
        messagesList: [] as messageListEntity[]
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
            this.activeId = generateUUID()
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

            let id_old = this.activeId

            let resp = await this.openAI.createChatCompletion(req)

            if (id_old == this.activeId) {
                // @ts-ignore
                this.messages.push(resp.data.choices[0].message)
            }
        },
        sendMessage(message: string) {
            this.messages.push({
                "role": "user",
                "content": message
            })
            let id_old = this.activeId
            this.openAI?.createChatCompletion({
                model: 'gpt-3.5-turbo-0613',
                messages: this.messages,
            }).then(resp => {
                if (id_old == this.activeId) {
                    // @ts-ignore
                    this.messages.push(resp.data.choices[0].message)
                }
                db.conversationDB.where({id: id_old}).first().then((res: any) => {
                    if (res) {
                        db.messageDB.add({
                            conversationId: id_old,
                            role: "user",
                            content: message,
                        })
                        db.messageDB.add({
                            conversationId: id_old,
                            content: resp.data.choices[0].message!.content!,
                            role: resp.data.choices[0].message!.role!,
                        })
                    } else if (id_old == this.activeId) {
                        db.conversationDB.add({
                            conversationId: id_old,
                            title: message!,
                        })
                        this.messages.forEach((item: ChatCompletionRequestMessage) => {
                            db.messageDB.add({
                                conversationId: id_old,
                                content: item.content!,
                                role: item.role!,
                            })
                        })
                    }
                })

            })
        },
        changeConv(id: string) {
            this.activeId = id
            console.log(id)
            db.messageDB.where({conversationId: id}).sortBy("id").then((res: any) => {
                this.messages = []
                res.forEach((item: any) => {
                    this.messages.push({
                        role: item.role,
                        content: item.content
                    })
                })
            })
        }
    },

})