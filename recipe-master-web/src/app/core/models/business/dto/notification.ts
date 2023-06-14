export enum NotificationType {
    RECIPE = "RECIPE",
    MESSAGE = "MESSAGE"
}

export interface Notification {
    id?:number;
    inclusion?: Date;
    userid: number;
    type: NotificationType;
    objectId: number;
    message: string;
    read?: boolean;
}