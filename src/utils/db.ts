import Dexie,{Table} from "dexie";


//会话列表
export interface ConversationDBEntity {
    id?:number
    conversationId: string;
    title: string;
}

//消息列表
export interface MessageDBEntity {
    id?:number
    role: string;
    content: string;
    conversationId: string;
}

export class ChatDexie extends Dexie{
    conversationDB!:Table<ConversationDBEntity>;
    messageDB!:Table<MessageDBEntity>;
    constructor(){
        super("chatDB");
        this.version(1).stores({
            conversationDB: "++id,conversationId, title",
            messageDB: "++id,role, content, conversationId"
        });
    }
}

export const db = new ChatDexie();