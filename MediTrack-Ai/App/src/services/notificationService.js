import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';


// Configure notification behavior — show alert with sound even in foreground
try {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
            shouldShowBanner: true,
            shouldShowList: true,
        }),
    });
} catch (e) {
    console.warn('⚠️ Notification handler setup skipped (Expo Go limitation):', e.message);
}

// Request permissions + set up alarm-style notification channel
export const requestNotificationPermissions = async () => {
    try {
        const { status: existing } = await Notifications.getPermissionsAsync();
        let finalStatus = existing;

        if (existing !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync({
                ios: {
                    allowAlert: true,
                    allowBadge: true,
                    allowSound: true,
                    allowCriticalAlerts: true,
                },
            });
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('Notification permission not granted');
            return false;
        }

        if (Platform.OS === 'android') {
            // ALARM channel — max importance, bypasses DND, full-screen
            await Notifications.setNotificationChannelAsync('medicine-alarm', {
                name: 'Medicine Alarm',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 1000, 500, 1000, 500, 1000],
                sound: 'default',
                enableVibrate: true,
                enableLights: true,
                lightColor: '#FF0000',
                bypassDnd: true,
                lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
                showBadge: true,
            });

            // Warning channel — for 5-min heads up
            await Notifications.setNotificationChannelAsync('medicine-warning', {
                name: 'Medicine Warning',
                importance: Notifications.AndroidImportance.HIGH,
                vibrationPattern: [0, 300, 200, 300],
                sound: 'default',
                enableVibrate: true,
            });
        }

        return true;
    } catch (e) {
        console.warn('⚠️ Notification permissions skipped (Expo Go limitation):', e.message);
        return false;
    }
};

// Schedule alarm-style notification for medicine
export const scheduleMedicineNotification = async (medicine, timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);

    const hDisplay = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const timeLabel = `${hDisplay}:${String(minutes).padStart(2, '0')} ${ampm}`;

    const identifier = await Notifications.scheduleNotificationAsync({
        content: {
            title: `🔔 MEDICINE TIME — ${medicine.name}`,
            body: `Take ${medicine.dosage} now! (${timeLabel} IST)\n${medicine.instruction || ''}`,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.MAX,
            sticky: true,  // Can't be swiped away easily
            autoDismiss: false,
            data: {
                medicineId: medicine.id,
                medicineName: medicine.name,
                dosage: medicine.dosage,
                instruction: medicine.instruction || '',
                time: timeStr,
                timeIST: timeLabel,
                type: 'medicine_alarm',
            },
            ...(Platform.OS === 'android' && {
                channelId: 'medicine-alarm',
            }),
            // Category for action buttons
            categoryIdentifier: 'medicine_alarm',
        },
        trigger: {
            type: 'daily',
            hour: hours,
            minute: minutes,
            repeats: true,
        },
    });

    return identifier;
};

// Schedule 5-minute warning
export const scheduleWarningNotification = async (medicine, timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);

    let warnHour = hours;
    let warnMin = minutes - 5;
    if (warnMin < 0) {
        warnMin += 60;
        warnHour = (warnHour - 1 + 24) % 24;
    }

    const hDisplay = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const timeLabel = `${hDisplay}:${String(minutes).padStart(2, '0')} ${ampm}`;

    const identifier = await Notifications.scheduleNotificationAsync({
        content: {
            title: `⏰ ${medicine.name} in 5 minutes`,
            body: `Get ready — ${medicine.dosage} at ${timeLabel} IST`,
            sound: true,
            data: {
                medicineId: medicine.id,
                type: 'medicine_warning',
            },
            ...(Platform.OS === 'android' && { channelId: 'medicine-warning' }),
        },
        trigger: {
            type: 'daily',
            hour: warnHour,
            minute: warnMin,
            repeats: true,
        },
    });

    return identifier;
};

// Schedule all notifications for a medicine
export const scheduleAllForMedicine = async (medicine, scheduleTimes) => {
    const identifiers = [];
    for (const time of scheduleTimes) {
        try {
            const mainId = await scheduleMedicineNotification(medicine, time);
            identifiers.push(mainId);
            const warnId = await scheduleWarningNotification(medicine, time);
            identifiers.push(warnId);
        } catch (err) {
            console.log(`Failed to schedule for ${medicine.name} at ${time}:`, err.message);
        }
    }
    return identifiers;
};

// Cancel all scheduled notifications
export const cancelAllNotifications = async () => {
    try {
        await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (e) {
        console.warn('⚠️ Cancel notifications skipped:', e.message);
    }
};

// Re-schedule all notifications from medicines list
export const rescheduleAllNotifications = async (medicines) => {
    try {
        await cancelAllNotifications();

        for (const med of medicines) {
            const schedules = med.schedule || [];
            if (schedules.length > 0) {
                await scheduleAllForMedicine(med, schedules);
            }
        }

        const all = await Notifications.getAllScheduledNotificationsAsync();
        console.log(`📅 Scheduled ${all.length} notifications for ${medicines.length} medicines`);
    } catch (e) {
        console.warn('⚠️ Reschedule notifications skipped:', e.message);
    }
};

// Set up notification action buttons (Take / Snooze)
export const setupNotificationCategories = async () => {
    try {
        await Notifications.setNotificationCategoryAsync('medicine_alarm', [
            {
                identifier: 'TAKE_MEDICINE',
                buttonTitle: '✅ Taken',
                options: { opensAppToForeground: true },
            },
            {
                identifier: 'SNOOZE_MEDICINE',
                buttonTitle: '💤 Snooze 2min',
                options: { opensAppToForeground: false },
            },
        ]);
    } catch (e) {
        console.warn('⚠️ Notification categories skipped:', e.message);
    }
};

// Get all scheduled notifications (debug)
export const getScheduledNotifications = async () => {
    try {
        return await Notifications.getAllScheduledNotificationsAsync();
    } catch (e) {
        console.warn('⚠️ Get scheduled notifications skipped:', e.message);
        return [];
    }
};
