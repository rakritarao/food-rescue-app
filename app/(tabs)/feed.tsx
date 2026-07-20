import { collection, doc, getDocs, onSnapshot, orderBy, query, runTransaction, Timestamp, where, writeBatch } from 'firebase/firestore'
import { useCallback, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { db } from '../../firebase/config'

type Listing = {
  id: string
  foodName: string
  quantity: number
  pickupTime: string
  restaurantName: string
  status: string
}

export default function FeedScreen() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  const checkAndExpireListings = useCallback(async () => {
    try {
      const now = Timestamp.now()
      const snapshot = await getDocs(
        query(
          collection(db, 'listings'),
          where('status', '==', 'available'),
          where('pickupDeadline', '<=', now)
        )
      )

      if (snapshot.empty) return

      const batch = writeBatch(db)
      snapshot.docs.forEach(document => {
        batch.update(doc(db, 'listings', document.id), { status: 'expired' })
      })
      await batch.commit()

      console.log(`Expired ${snapshot.docs.length} listings`)
    } catch (error) {
      console.log('Expiry check error:', error)
    }
  }, [])

  useEffect(() => {
    checkAndExpireListings()

    const q = query(
      collection(db, 'listings'),
      where('status', '==', 'available'),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Listing[]

      setListings(data)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [checkAndExpireListings])

  async function handleClaim(listingId: string) {
    try {
      await runTransaction(db, async (transaction) => {
        const listingRef = doc(db, 'listings', listingId)
        const listingSnap = await transaction.get(listingRef)

        if (!listingSnap.exists()) {
          throw new Error('This listing no longer exists.')
        }

        if (listingSnap.data().status !== 'available') {
          throw new Error('Sorry, this food was just claimed by someone else.')
        }

        transaction.update(listingRef, { status: 'claimed' })
      })

      Alert.alert('Claimed!', 'You have successfully claimed this food. Please pick it up in time.')

    } catch (error: any) {
      Alert.alert('Could not claim', error.message)
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2D6A4F" />
        <Text style={styles.loadingText}>Finding food near you...</Text>
      </View>
    )
  }

  return (
    <FlatList
      data={listings}
      keyExtractor={item => item.id}
      contentContainerStyle={
        listings.length === 0 ? styles.emptyContainer : styles.list
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.foodName}>{item.foodName}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Available</Text>
            </View>
          </View>
          <Text style={styles.restaurant}>🍽 {item.restaurantName}</Text>
          <Text style={styles.quantity}>🥡 {item.quantity} portions</Text>
          <Text style={styles.pickup}>⏰ Pickup by {item.pickupTime}</Text>
          <TouchableOpacity
            style={styles.claimButton}
            onPress={() => handleClaim(item.id)}
          >
            <Text style={styles.claimButtonText}>Claim This Food</Text>
          </TouchableOpacity>
        </View>
      )}
      ListEmptyComponent={
        <View style={styles.center}>
          <Text style={styles.emptyText}>🎉 No food available right now.</Text>
          <Text style={styles.emptySubtext}>Check back soon or post your own surplus!</Text>
        </View>
      }
    />
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#666',
  },
  list: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  foodName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  badge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    color: '#2D6A4F',
    fontWeight: '600',
  },
  restaurant: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  quantity: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  pickup: {
    fontSize: 14,
    color: '#E76F51',
    marginBottom: 14,
    fontWeight: '500',
  },
  claimButton: {
    backgroundColor: '#2D6A4F',
    padding: 13,
    borderRadius: 10,
    alignItems: 'center',
  },
  claimButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
})