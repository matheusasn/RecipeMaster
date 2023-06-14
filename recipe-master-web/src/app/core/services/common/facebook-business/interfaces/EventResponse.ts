export class EventResponse {
    events_received: number;
    events_dropped: number;
    message: Array<Record<string, any>>;
}
