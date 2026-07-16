import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions/v1'

admin.initializeApp()

export const notifyNGOsOnNewListing = functions.firestore
  .document('listings/{listingId}')
  .onCreate(async (snap, context) => {
    const listing = snap.data()

    if (!listing) return

    // get all NGO users with push tokens
    const usersSnap = await admin.firestore()
      .collection('users')
      .where('role', '==', 'ngo')
      .where('pushToken', '!=', null)
      .get()

    if (usersSnap.empty) {
      console.log('No NGO users with push tokens found')
      return
    }

    const messages = usersSnap.docs.map(doc => ({
      to: doc.data().pushToken,
      sound: 'default',
      title: '🍱 New Food Available!',
      body: `${listing.restaurantName} just posted ${listing.quantity} portions of ${listing.foodName}. Pickup by ${listing.pickupTime}.`,
      data: { listingId: context.params.listingId },
    }))

    // send via Expo push notification service
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messages),
    })

    console.log(`Sent notifications to ${messages.length} NGOs`)
  })