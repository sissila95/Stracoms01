import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Colors } from '../theme/colors';
import { Property } from '../types';
import { formatPrice, calculateNights, generateBookingId } from '../utils/format';
import { useApp } from '../context/AppContext';

type RootStackParamList = {
  Booking: { property: Property };
};

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<RootStackParamList, 'Booking'>;
};

export default function BookingScreen({ navigation, route }: Props) {
  const { property } = route.params;
  const { addBooking, user } = useApp();

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(dayAfter.getDate() + 2);

  const [checkInText, setCheckInText] = useState(formatDateInput(tomorrow));
  const [checkOutText, setCheckOutText] = useState(formatDateInput(dayAfter));
  const [guests, setGuests] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');

  function formatDateInput(date: Date): string {
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  }

  function parseDateInput(text: string): Date | null {
    const parts = text.split('/');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    if (isNaN(date.getTime())) return null;
    return date;
  }

  const checkInDate = parseDateInput(checkInText);
  const checkOutDate = parseDateInput(checkOutText);
  const nights =
    checkInDate && checkOutDate
      ? calculateNights(checkInDate.toISOString(), checkOutDate.toISOString())
      : 0;
  const totalPrice = nights > 0 ? property.pricePerNight * nights : 0;

  const handleBooking = () => {
    if (!checkInDate || !checkOutDate) {
      Alert.alert('Erreur', 'Veuillez entrer des dates valides (JJ/MM/AAAA).');
      return;
    }
    if (checkInDate >= checkOutDate) {
      Alert.alert('Erreur', 'La date de départ doit être après la date d\'arrivée.');
      return;
    }
    if (checkInDate < today) {
      Alert.alert('Erreur', 'La date d\'arrivée ne peut pas être dans le passé.');
      return;
    }
    if (guests > property.maxGuests) {
      Alert.alert('Erreur', `Maximum ${property.maxGuests} personnes pour cet hébergement.`);
      return;
    }

    const booking = {
      id: generateBookingId(),
      propertyId: property.id,
      propertyName: property.name,
      propertyImage: property.images[0],
      checkIn: checkInDate.toISOString(),
      checkOut: checkOutDate.toISOString(),
      guests,
      totalPrice,
      currency: property.currency,
      status: 'confirmed' as const,
      createdAt: new Date().toISOString(),
    };

    addBooking(booking);

    Alert.alert(
      'Réservation confirmée !',
      `Votre réservation au ${property.name} a été confirmée.\n\nRéférence: ${booking.id}\nArrivée: ${checkInText}\nDépart: ${checkOutText}\nTotal: ${formatPrice(totalPrice)}`,
      [
        {
          text: 'Voir mes réservations',
          onPress: () => navigation.navigate('MainTabs', { screen: 'Profile' }),
        },
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Réservation</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Property Summary */}
        <View style={styles.propertySummary}>
          <View style={styles.propertyInfo}>
            <Text style={styles.propertyName}>{property.name}</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.locationText}>{property.neighborhood}, {property.city}</Text>
            </View>
            <Text style={styles.priceInfo}>
              {formatPrice(property.pricePerNight)}
              <Text style={styles.perNight}> / nuit</Text>
            </Text>
          </View>
        </View>

        {/* Date Selection */}
        <Text style={styles.sectionTitle}>Dates du séjour</Text>
        <View style={styles.dateRow}>
          <View style={styles.dateInput}>
            <Text style={styles.dateLabel}>Arrivée</Text>
            <View style={styles.dateBox}>
              <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
              <TextInput
                style={styles.dateTextInput}
                value={checkInText}
                onChangeText={setCheckInText}
                placeholder="JJ/MM/AAAA"
                keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
              />
            </View>
          </View>
          <View style={styles.dateInput}>
            <Text style={styles.dateLabel}>Départ</Text>
            <View style={styles.dateBox}>
              <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
              <TextInput
                style={styles.dateTextInput}
                value={checkOutText}
                onChangeText={setCheckOutText}
                placeholder="JJ/MM/AAAA"
                keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
              />
            </View>
          </View>
        </View>

        {/* Guest Count */}
        <Text style={styles.sectionTitle}>Nombre de voyageurs</Text>
        <View style={styles.guestRow}>
          <TouchableOpacity
            style={styles.guestButton}
            onPress={() => setGuests(Math.max(1, guests - 1))}
          >
            <Ionicons name="remove" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <View style={styles.guestCount}>
            <Text style={styles.guestNumber}>{guests}</Text>
            <Text style={styles.guestLabel}>
              voyageur{guests > 1 ? 's' : ''}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.guestButton}
            onPress={() => setGuests(Math.min(property.maxGuests, guests + 1))}
          >
            <Ionicons name="add" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.maxGuests}>
          Maximum {property.maxGuests} voyageur{property.maxGuests > 1 ? 's' : ''}
        </Text>

        {/* Special Requests */}
        <Text style={styles.sectionTitle}>Demandes spéciales (optionnel)</Text>
        <TextInput
          style={styles.textArea}
          value={specialRequests}
          onChangeText={setSpecialRequests}
          placeholder="Ex: arrivée tardive, lit bébé..."
          placeholderTextColor={Colors.textSecondary}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        {/* Price Summary */}
        <View style={styles.priceSummary}>
          <Text style={styles.summaryTitle}>Récapitulatif</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              {formatPrice(property.pricePerNight)} x {nights} nuit{nights > 1 ? 's' : ''}
            </Text>
            <Text style={styles.priceValue}>{formatPrice(totalPrice)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Frais de service</Text>
            <Text style={styles.priceValue}>Gratuit</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(totalPrice)}</Text>
          </View>
        </View>

        {/* User Info */}
        {user && (
          <View style={styles.userInfo}>
            <Ionicons name="person-circle-outline" size={24} color={Colors.primary} />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user.fullName}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.totalTextSmall}>Total</Text>
          <Text style={styles.totalPrice}>{formatPrice(totalPrice)}</Text>
        </View>
        <TouchableOpacity style={styles.confirmButton} onPress={handleBooking}>
          <Text style={styles.confirmButtonText}>Confirmer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 12,
    backgroundColor: Colors.surface,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  scrollContent: {
    padding: 20,
  },
  propertySummary: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },
  propertyInfo: {},
  propertyName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  priceInfo: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  perNight: {
    fontSize: 13,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  dateInput: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dateTextInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
  },
  guestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
    gap: 24,
  },
  guestButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestCount: {
    alignItems: 'center',
  },
  guestNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },
  guestLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  maxGuests: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  textArea: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: Colors.text,
    minHeight: 80,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
  },
  priceSummary: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 20,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  priceValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  userDetails: {},
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  userEmail: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 36,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  totalTextSmall: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 14,
  },
  confirmButtonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: '700',
  },
});
