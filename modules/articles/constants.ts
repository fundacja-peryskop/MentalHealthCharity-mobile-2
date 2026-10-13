import { Roles } from "@/modules/users/constants";

export enum ArticleStatus {
    DRAFT = "DRAFT",
    SENT = "SENT",
    REJECTED = "REJECTED",
    CORRECTED = "CORRECTED",
    PUBLISHED = "PUBLISHED",
    DELETED = "DELETED",
}

export enum ArticleRequiredRoles {
    ANYONE = "ANYONE",
    ADMIN = Roles.ADMIN,
    VOLUNTEER = Roles.VOLUNTEER,
    SUPERVISOR = Roles.VOLUNTEERSUPERVISOR,
}
