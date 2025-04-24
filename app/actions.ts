'use server'

import webpush from 'web-push'
import type { PushSubscription as WebPushSubscription } from 'web-push'


const NEXT_PUBLIC_VAPID_PUBLIC_KEY = 'BBtC5z2WZ3BwUkRhLBhOc3zAHnQofRoX7O9QUOdAUWfRbDrpx3BJc5byPGFLVL_OLHskH_ZZHF8-6Ie3usrgM48'
const VAPID_PRIVATE_KEY = 'OAI7MZc-jb-HfErUzo0NzUsdBn3qhyUnMh99PIeorMI'


// Set VAPID details
webpush.setVapidDetails(
    '',
    NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
)

export async function sendNotification(
    subscription: WebPushSubscription,
    message: string
) {
    try {
        await webpush.sendNotification(
            subscription,
            JSON.stringify({
                title: 'Test Notification',
                body: message,
                icon: '/assets/img/favicon.png',
            })
        )
        return { success: true }
    } catch (error) {
        console.error('Error sending push notification:', error)
        return { success: false, error: 'Failed to send notification' }
    }
}
