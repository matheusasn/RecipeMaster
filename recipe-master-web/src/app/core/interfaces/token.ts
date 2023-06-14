import { User } from "../models/user";

export interface Token {
    user: User;
    token: string;
}
