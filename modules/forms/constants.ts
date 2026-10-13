import i18n from "../../locales/i18n/i18n";
import { formSorting, formStatus } from "./types";

export const translatedFormStatus = {
    [formStatus.ACCEPTED]: i18n.t("form_status.accepted"),
    [formStatus.REJECTED]: i18n.t("form_status.rejected"),
    [formStatus.WAITED]: i18n.t("form_status.waited"),
};

export const translateFormSorting = {
    [formSorting.MIN_STAGE]: i18n.t("form_sorting.min_stage"),
    [formSorting.MAX_STAGE]: i18n.t("form_sorting.max_stage"),
    [formSorting.NEWEST]: i18n.t("form_sorting.newest"),
    [formSorting.OLDEST]: i18n.t("form_sorting.oldest"),
};
