export enum MessageType {
    NPS = "NPS",
    WELCOME = "WELCOME",
    INPUT = "INPUT",
    BUTTONS = "BUTTONS",
    NPS_RANKING = "NPS_RANKING",
    WIZARD = "WIZARD",
    WELCOME_FIREBASE = "WELCOME_FIREBASE",
		OLD_USER_WITH_X_RECIPES = "OLD_USER_WITH_X_RECIPES"
}

export interface Message {
    id?:number;
    title: string;
    text?: string;
    type: MessageType;
    config?: string;
    photoUrl?: string;

    photoContent?: string;
}

export interface MessageResponse {
    type: MessageType;
    title:string;

    util?: number;
    dificuldade?: String;
    melhoria?: String;
    recomendar?: number;  // o número NPS (das mensagem tipo wizard automáticas, após criar X receitas)
    infoMelhoria?: String;

    data?:string;
    wizard?: MessageResponse[];

    cancel?:boolean;
    migrar?:boolean;

}
