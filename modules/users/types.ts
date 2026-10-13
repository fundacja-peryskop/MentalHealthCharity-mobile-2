import { User } from "../auth/types";

export interface ReadSearchUsersOptions {
    query?: string;
    role?: string;
}

export interface ReadUserByIdOptions {
    id: number;
}

export interface PublicProfileOptions {
    id: number;
}

export interface ConfirmEmailCompletePayload {
    token: string;
}

export interface PublicProfile {
    avatar_url: string;
    description: string;
    id: number;
    user: User;
}

export interface ReadUsersReportsOptions {
    report_type?: string;
    is_considered?: boolean;
    page?: number;
    size?: number;
}

export interface editPublicProfilePayload {
    avatar_url: string;
    description: string;
    id: number;
}

export interface UpdatePublicProfilePayload {
    user_id: number;
    avatar_url: string;
    description: string;
}

export interface UpdateAvatarPayload {
    user_id: number;
    avatar: {
        uri: string;
        name: string;
        type: string;
    };
}

export interface ChangePasswordBeginPayload {
    email: string;
}

export interface ChangePasswordCompletePayload {
    token: string;
    new_password: string;
}

export interface EditUserFormValues {
    full_name: string;
    user_role: string;
}

export interface EditUserAvatar {
    avatar: File;
}