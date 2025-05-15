import type { Component, IconProps } from "@lucide/svelte";

export type Notification = {
    id: number;
    read: boolean;
    notification_id: string;
    message: string;
    user_id: number;
    action: 'like' | 'comment' | 'follow' | 'repost' | 'message' | 'live' | 'purchase' | 'sparkle';
    url: string;
    created_at: string;
}

type NotificationType = {
    type: 'like' | 'comment' | 'follow' | 'repost' | 'message' | 'live' | 'purchase' | 'sparkle';
    icon: Component<IconProps, "">;
    params: { size: number; strokeWidth: number; fill?: string }
    color: string;
};