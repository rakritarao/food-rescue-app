import { addDoc, collection, getDocs, query, serverTimestamp, where } from 'firebase/firestore'
import { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native'
import { db } from '../../firebase/config'

async function notifyNGOs(listing: {
  foodName: string
  quantity: number
  pickupTime: string
  restaurantName: string
}) {
  try {
    // get all NGO push tokens from Firestore
    const ngoSnap = await getDocs(
      query(
        collection(db, 'users'),
        where('role', '==', 'ngo'),
      )
    )

    const tokens = ngoSnap.docs
      .map(doc => doc.data().pushToken)
      .filter(Boolean)

    if (tokens.length === 0) return

    const messages = tokens.map(token => ({
      to: token,
      sound: 'default',
      title: '🍱 New Food Available!',
      body: `${listing.restaurantName} posted ${listing.quantity} portions of ${listing.foodName}. Pickup by ${listing.pickupTime}.`,
    }))

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messages),
    })

  } catch (error) {
    console.log('Notification error:', error)
  }
}

export default function PostScreen() {
  const [foodName, setFoodName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [pickupTime, setPickupTime] = useState('')
  const [restaurantName, setRestaurantName] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!foodName || !quantity || !pickupTime || !restaurantName) {
      Alert.alert('Missing fields', 'Please fill in all fields before submitting.')
      return
    }

    setLoading(true)

    try {
      const listing = {
        foodName,
        quantity: Number(quantity),
        pickupTime,
        restaurantName,
      }

      await addDoc(collection(db, 'listings'), {
        ...listing,
        status: 'available',
        createdAt: serverTimestamp(),
      })

      // notify all NGOs
      await notifyNGOs(listing)

      Alert.alert('Posted!', 'Your food listing is now live and NGOs have been notified.')

      setFoodName('')
      setQuantity('')
      setPickupTime('')
      setRestaurantName('')

    } catch (error: any) {
      Alert.alert('Error', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Post Surplus Food</Text>
      <Text style={styles.subheading}>
        Fill in the details below and NGOs near you will be notified instantly.
      </Text>

      <Text style={styles.label}>Restaurant Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Spice Garden"
        value={restaurantName}
        onChangeText={setRestaurantName}
      />

      <Text style={styles.label}>Food Item</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Biryani, Dal, Roti"
        value={foodName}
        onChangeText={setFoodName}
      />

      <Text style={styles.label}>Number of Portions</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 20"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Pickup By</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 9:00 PM today"
        value={pickupTime}
        onChangeText={setPickupTime}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Post Listing</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D6A4F',
    marginBottom: 6,
  },
  subheading: {
    fontSize: 14,
    color: '#666',
    marginBottom: 28,
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    marginBottom: 18,
    color: '#333',
  },
  button: {
    backgroundColor: '#2D6A4F',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#8fbc8f',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
})