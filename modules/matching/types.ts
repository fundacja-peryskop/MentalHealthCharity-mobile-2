export enum MenteeMatchingStatus {
    WAITING = "WAITING",
    MATCHED = "MATCHED",
    PAUSED = "PAUSED",
    DECLINED = "DECLINED",
    REMATCH_REQUESTED = "REMATCH_REQUESTED",
    CLOSED = "CLOSED",
}
export interface MenteeMatchingState {
    user_id: number;
    help_form_id: number | null;
    status: MenteeMatchingStatus;
    auto_matching_enabled: boolean;
    excluded_from_automation: boolean;
    queued_at: string;
    matched_at: string | null;
    current_chat_id: number | null;
}
