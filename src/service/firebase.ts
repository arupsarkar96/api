import admin from 'firebase-admin';

admin.initializeApp({
    credential: admin.credential.cert('./firebase.json')
});


export async function wakeupUserDevice(token: string): Promise<void> {
    const message: admin.messaging.Message = {
        data: {
            type: "wakeup",
        },
        token: token,
        android: {
            priority: 'high', // Set priority to 'high' for Android devices
        },
        apns: {
            payload: {
                aps: {
                    priority: '10', // Set priority to '10' for iOS devices (high priority)
                },
            },
        },
    };

    try {
        const response = await admin.messaging().send(message);
        console.log('Successfully sent Wakeup:', response);
    } catch (error) {
        console.error('Error sending message:', error);
    }
}


export async function sendPushCallNotification(token: string, from: string, call_id: string, mode: string, timestamp: string): Promise<void> {
    const message: admin.messaging.Message = {
        data: {
            type: "phone_call",
            caller: from,
            call_id: call_id,
            mode: mode,
            timestamp: timestamp
        },
        token: token,
        android: {
            priority: 'high', // Set priority to 'high' for Android devices
        },
        apns: {
            payload: {
                aps: {
                    priority: '10', // Set priority to '10' for iOS devices (high priority)
                },
            },
        },
    };

    try {
        const response = await admin.messaging().send(message);
        console.log('Successfully sent call:', response);
    } catch (error) {
        console.error('Error sending message:', error);
    }
}