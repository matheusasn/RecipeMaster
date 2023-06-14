import HttpServiceInterface from './HttpServiceInterface';
import ServerEvent from './ServerEvent';
export default interface EventRequest {
    _access_token: string;
    _pixel_id: string;
    _events: ServerEvent[];
    _partner_agent: string | null | undefined;
    _test_event_code: string | null | undefined;
    _namespace_id: string | null | undefined;
    _upload_id: string | null | undefined;
    _upload_tag: string | null | undefined;
    _upload_source: string | null | undefined;
    _debug_mode: boolean;
    _api: Record<string, any>;
    _http_service: HttpServiceInterface | null | undefined;
}