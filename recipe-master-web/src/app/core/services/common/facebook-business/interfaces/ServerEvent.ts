import UserData from './UserData';
import CustomData from './CustomData';
export default interface ServerEvent {
    event_name: string;
    event_time: number;
    event_source_url?: string;
    event_id?: string;
    action_source?: string;
    opt_out?: boolean;
    user_data?: UserData;
    custom_data?: CustomData;
    data_processing_options?: string[];
    data_processing_options_state?: number;
    data_processing_options_country?: number;
}