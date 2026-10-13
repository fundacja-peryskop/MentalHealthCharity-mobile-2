import React from 'react';

export interface Pagination<T> {
    page: number;
    size: number;
    total: number;
    pages: number;
    items: T[];
}

export interface DefaultPaginationOptions {
    page?: number;
    size?: number;
}

export interface ApiError {
    detail: string;
}

export interface RouteType {
    url: string;
    onRender: React.ReactNode;
    requiresAuth?: boolean;
    permission?: Permissions;
}

export class ApiError extends Error {
    status: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(message: string, status = 0, data: any = null) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.data = data;
    }
}


export enum ErrorMessage {
    FAILED_TO_FETCH_CHAT = "failed_to_fetch_chat",
    ARTICLE_CATEGORY_IS_USED = "article_category_is_used",
    INACTIVE_USER = "inactive_user",
    INVALID_OR_EXPIRED_TOKEN = "invalid_or_expired_confirmation_token",
    ARTICLE_CATEGORY_WITH_THAT_NAME_ALREADY_EXISTS = "article_category_with_that_name_already_exists",
    FAILED_TO_FETCH_CHAT_NOTE = "failed_to_fetch_chat_note",
    THE_USER_WITH_THIS_USERNAME_ALREADY_EXISTS_IN_THE_SYSTEM = "the_user_with_this_username_already_exists_in_the_system",
    FAILED_TO_SAVE_NOTE = "failed_to_save_note",
    USER_NOT_FOUND = "user_not_found",
    ARTICLE_CATEGORY_NOT_FOUND = "article_category_not_found",
    INCORRECT_EMAIL_OR_PASSWORD = "incorrect_email_or_password",
    FAILED_TO_CREATE_REPORT = "failed_to_create_report",
    FAILED_TO_FETCH_PUBLIC_PROFILE = "failed_to_fetch_public_profile",
    FAILED_TO_UPDATE_PUBLIC_PROFILE = "failed_to_update_public_profile",
    FAILED_TO_FETCH_REPORTS = "failed_to_fetch_reports",
    FAILED_TO_FETCH_USER = "failed_to_fetch_user",
    FAILED_TO_CREATE_CHAT = "failed_to_create_chat",
    FAILED_TO_EDIT_CHAT = "failed_to_edit_chat",
    UNKNOWN = "unknown",
}


export enum SessionStorage {
    SEND_FORM = 'send_form',
}