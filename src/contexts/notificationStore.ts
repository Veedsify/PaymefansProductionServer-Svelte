// src/lib/stores/notificationStore.ts
import { writable } from 'svelte/store';

export interface Notification {
    notification_id: string;
    read: boolean;
}

interface NotificationStore {
    notifications: Notification[];
    hasMore: boolean;
    totalNotifications: number;
}

function createNotificationStore() {
    const { subscribe, update, set } = writable<NotificationStore>({
        notifications: [],
        hasMore: false,
        totalNotifications: 0
    });

    return {
        subscribe,
        setHasMore: (hasMore: boolean) => update(state => ({ ...state, hasMore })),
        setTotalNotifications: (count: number) => update(state => ({ ...state, totalNotifications: count })),
        updateNotification: (id: string) =>
            update(state => ({
                ...state,
                notifications: state.notifications.map(note =>
                    note.notification_id === id ? { ...note, read: true } : note
                )
            })),
        addNotification: (notification: Notification) =>
            update(state => ({
                ...state,
                notifications: [...state.notifications, notification]
            })),
        addAllNotifications: (notifications: Notification[]) =>
            update(state => ({
                ...state,
                notifications
            })),
        // Optional: reset store
        reset: () => set({ notifications: [], hasMore: false, totalNotifications: 0 })
    };
}

export const notificationStore = createNotificationStore();