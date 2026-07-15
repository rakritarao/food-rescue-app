import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
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

export default function PostScreen() {
  const [foodName, setFoodName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [pickupTime, setPickupTime] = useState('')
  const [restaurantName, setRestaurantName] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    // basic validation
    if (!foodName || !quantity || !pickupTime || !restaurantName) {
      Alert.alert('Missing fields', 'Please fill in all fields before submitting.')
      return
    }

    setLoading(true)

    try {
      await addDoc(collection(db, 'listings'), {
        foodName,
        quantity: Number(quantity),
        pickupTime,
        restaurantName,
        status: 'available',
        createdAt: serverTimestamp(),
      })

      Alert.alert('Posted!', 'Your food listing is now live.')

      // clear the form
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
        Fill in the details below and NGOs near you will be notified.
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