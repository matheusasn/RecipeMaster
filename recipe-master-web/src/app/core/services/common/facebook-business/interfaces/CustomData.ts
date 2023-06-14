import Content from './Content';
import UserData from './UserData';

export default interface CustomData {
    _value: number;
    _currency: string;
    _contents: Content[];
    _order_id: string;
    _status: string;
    _shipping_contact: UserData;
    _billing_contact: UserData;
    _external_order_id: string;
    _original_order_id: string;
    _message: string;
}
