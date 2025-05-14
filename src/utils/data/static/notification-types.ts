import { Heart, UserPlus, DollarSign, MessageSquareText, Repeat2, MessageSquare, Radio, Sparkle } from "@lucide/svelte"
import type { NotificationType } from "../../../types/notification"

export const NotificationIcontypes: NotificationType[] = [
    {
        type: 'like',
        icon: Heart,
        params: { size: 37, strokeWidth: 1, fill: "indianred" },
        color: 'indianred'
    },
    {
        type: 'follow',
        icon: UserPlus,
        params: { size: 37, strokeWidth: 1, fill: "green" },
        color: 'green'
    },
    {
        type: 'purchase',
        icon: DollarSign,
        params: { size: 37, strokeWidth: 1 },
        color: 'gold'
    },
    {
        type: 'comment',
        icon: MessageSquareText,
        params: { size: 37, strokeWidth: 1, fill: "gray" },
        color: 'gray'
    },
    {
        type: 'repost',
        icon: Repeat2,
        params: { size: 37, strokeWidth: 1 },
        color: 'cadetblue'
    },
    {
        type: 'message',
        icon: MessageSquare,
        params: { size: 37, strokeWidth: 1, fill: "skyblue" },
        color: 'skyblue'
    },
    {
        type: 'live',
        icon: Radio,
        params: { size: 37, strokeWidth: 1 },
        color: 'red'
    },
    {
        type: 'sparkle',
        icon: Sparkle,
        params: { size: 37, strokeWidth: 1, fill: "gold" },
        color: 'gold'
    }
];