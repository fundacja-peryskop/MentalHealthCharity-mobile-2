import { Dimensions, Modal, Pressable, ScrollView, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Avatar, Badge, Button, Typography } from "@fundacja-peryskop/ui";
import { User } from "@/modules/auth/types";
import { Roles } from "@/modules/users/constants";
import { Chat } from "../types";

interface ChatParticipantsModalProps {
    chat: Chat | null;
    onClose: () => void;
}

const roleBadgeTone: Record<
    Roles,
    "default" | "primary" | "secondary" | "success" | "muted"
> = {
    [Roles.ADMIN]: "secondary",
    [Roles.REDACTOR]: "muted",
    [Roles.USER]: "default",
    [Roles.VOLUNTEER]: "success",
    [Roles.VOLUNTEERSUPERVISOR]: "primary",
};

const getParticipantAvatar = (participant: User) =>
    participant.chat_avatar_url ?? participant.user_public_profile?.avatar_url;

const ChatParticipantsModal = ({
    chat,
    onClose,
}: ChatParticipantsModalProps) => {
    const { t } = useTranslation();
    const participants = chat?.participants ?? [];

    return (
        <Modal
            visible={chat !== null}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable
                className="flex-1 items-center justify-center bg-slate-950/60 px-6"
                onPress={onClose}
            >
                <Pressable
                    onPress={() => undefined}
                    className="w-full max-w-lg overflow-hidden rounded-2xl bg-white"
                >
                    <View className="flex-row items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                        <View className="min-w-0 flex-1">
                            <View className="flex-row items-center gap-2">
                                <Typography
                                    variant="regularSemibold"
                                    className="text-slate-950"
                                >
                                    {t("chat_list.participants_title")}
                                </Typography>
                                <Badge tone="primary" size="sm">
                                    {participants.length}
                                </Badge>
                            </View>

                            {chat ? (
                                <Typography
                                    variant="smallRegular"
                                    className="mt-1 text-slate-500"
                                    numberOfLines={1}
                                >
                                    {chat.name}
                                </Typography>
                            ) : null}
                        </View>

                        <Button
                            variant="secondary"
                            outlined
                            onPress={onClose}
                            aria-label={t("chat_list.participants_close")}
                            className="h-9 w-9 p-0"
                        >
                            <Ionicons name="close" size={18} color="#0F172A" />
                        </Button>
                    </View>

                    <ScrollView
                        style={{
                            maxHeight: Math.round(
                                Dimensions.get("window").height * 0.5,
                            ),
                        }}
                        contentContainerClassName="py-1"
                        keyboardShouldPersistTaps="handled"
                    >
                        {participants.length > 0 ? (
                            participants.map((participant) => (
                                <View
                                    key={participant.id}
                                    className="flex-row items-center gap-3 border-b border-slate-100 px-5 py-3 last:border-b-0"
                                >
                                    <Avatar
                                        src={getParticipantAvatar(participant)}
                                        name={participant.full_name}
                                        size={40}
                                        ring
                                        className="bg-primary/10"
                                    />

                                    <View className="min-w-0 flex-1">
                                        <Typography
                                            variant="regularSemibold"
                                            className="text-slate-900"
                                            numberOfLines={1}
                                        >
                                            {participant.full_name}
                                        </Typography>
                                        <Typography
                                            variant="tinyRegular"
                                            className="text-slate-500"
                                            numberOfLines={1}
                                        >
                                            {participant.email}
                                        </Typography>
                                    </View>

                                    <Badge
                                        tone={
                                            roleBadgeTone[
                                                participant.user_role
                                            ] ?? "default"
                                        }
                                        size="sm"
                                    >
                                        {t(`roles.${participant.user_role}`, {
                                            defaultValue: participant.user_role,
                                        })}
                                    </Badge>
                                </View>
                            ))
                        ) : (
                            <View className="items-center px-5 py-8">
                                <Ionicons
                                    name="people-outline"
                                    size={32}
                                    color="#94A3B8"
                                />
                                <Typography
                                    variant="smallRegular"
                                    className="mt-2 text-center text-slate-500"
                                >
                                    {t("chat_list.participants_empty")}
                                </Typography>
                            </View>
                        )}
                    </ScrollView>

                    <View className="border-t border-slate-100 px-5 py-4">
                        <Button variant="secondary" fullWidth onPress={onClose}>
                            {t("chat_list.participants_close")}
                        </Button>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

export default ChatParticipantsModal;
