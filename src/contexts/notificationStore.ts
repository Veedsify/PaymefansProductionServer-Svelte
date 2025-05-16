// src/lib/stores/notificationStore.ts
import { writable } from 'svelte/store';
import type { Notification } from '../types/notification';

interface NotificationStore {
    notifications: Notification[];
    hasMore: boolean;
    totalNotifications: number;
}

const notificationStore = writable<NotificationStore>({
    notifications: [],
    hasMore: false,
    totalNotifications: 0
});


export default notificationStore;