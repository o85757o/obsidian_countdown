export interface NotificationSettings {
    percentage: number;
    enabled: boolean;
    sound?: boolean;
    desktop?: boolean;
    message?: string;
}

export interface CountdownSettings {
    defaultDialId: string;
    refreshInterval: number;
    notifications: NotificationSettings[];
    maxNotificationsPerDay: number;
    notificationQuietHours: {
        enabled: boolean;
        start: string; // HH:mm format
        end: string;   // HH:mm format
    };
    appearance: {
        defaultSize: 'small' | 'medium' | 'large';
        showDays: boolean;
        showHours: boolean;
        showMinutes: boolean;
        showSeconds: boolean;
        showProgress: boolean;
    };
}

export const DEFAULT_SETTINGS: CountdownSettings = {
    defaultDialId: 'ios-circular',
    refreshInterval: 60000, // 1 minute
    notifications: [
        { percentage: 75, enabled: true, sound: true, desktop: true },
        { percentage: 50, enabled: true, sound: true, desktop: true },
        { percentage: 25, enabled: true, sound: true, desktop: true }
    ],
    maxNotificationsPerDay: 10,
    notificationQuietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00'
    },
    appearance: {
        defaultSize: 'medium',
        showDays: true,
        showHours: true,
        showMinutes: true,
        showSeconds: false,
        showProgress: true
    }
};
