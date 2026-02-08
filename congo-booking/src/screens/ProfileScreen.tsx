import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { formatPrice, formatDate } from '../utils/format';
import { Booking } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const statusLabels: Record<Booking['status'], string> = {
  confirmed: 'Confirmée',
  pending: 'En attente',
  cancelled: 'Annulée',
  completed: 'Terminée',
};

const statusColors: Record<Booking['status'], string> = {
  confirmed: Colors.success,
  pending: Colors.secondary,
  cancelled: Colors.error,
  completed: Colors.textSecondary,
};

export default function ProfileScreen({ navigation }: Props) {
  const { user, isAuthenticated, bookings, cancelBooking, logout } = useApp();

  if (!isAuthenticated) {
    return (
      <View style={styles.notAuthContainer}>
        <Ionicons name="person-circle-outline" size={80} color={Colors.border} />
        <Text style={styles.notAuthTitle}>Bienvenue</Text>
        <Text style={styles.notAuthSubtitle}>
          Connectez-vous pour gérer vos réservations
        </Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Auth')}
        >
          <Text style={styles.loginButtonText}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCancelBooking = (bookingId: string) => {
    Alert.alert(
      'Annuler la réservation',
      'Êtes-vous sûr de vouloir annuler cette réservation ?',
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui, annuler',
          style: 'destructive',
          onPress: () => cancelBooking(bookingId),
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vous déconnecter ?',
      [
        { text: 'Non', style: 'cancel' },
        { text: 'Oui', onPress: logout },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={40} color={Colors.textLight} />
        </View>
        <Text style={styles.userName}>{user?.fullName}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        <Text style={styles.userPhone}>{user?.phone}</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="search" size={24} color={Colors.primary} />
          <Text style={styles.actionText}>Chercher</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Favorites')}>
          <Ionicons name="heart" size={24} color={Colors.accent} />
          <Text style={styles.actionText}>Favoris</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={24} color={Colors.textSecondary} />
          <Text style={styles.actionText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      {/* Bookings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Mes réservations ({bookings.length})
        </Text>

        {bookings.length === 0 ? (
          <View style={styles.emptyBookings}>
            <Ionicons name="calendar-outline" size={48} color={Colors.border} />
            <Text style={styles.emptyText}>Aucune réservation</Text>
            <Text style={styles.emptySubtext}>
              Explorez nos hébergements et réservez votre prochain séjour
            </Text>
          </View>
        ) : (
          bookings.map((booking) => (
            <View key={booking.id} style={styles.bookingCard}>
              <Image
                source={{ uri: booking.propertyImage }}
                style={styles.bookingImage}
              />
              <View style={styles.bookingInfo}>
                <View style={styles.bookingHeader}>
                  <Text style={styles.bookingName} numberOfLines={1}>
                    {booking.propertyName}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: statusColors[booking.status] + '20' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: statusColors[booking.status] },
                      ]}
                    >
                      {statusLabels[booking.status]}
                    </Text>
                  </View>
                </View>

                <Text style={styles.bookingRef}>Réf: {booking.id}</Text>

                <View style={styles.bookingDates}>
                  <View style={styles.dateItem}>
                    <Ionicons name="calendar-outline" size={14} color={Colors.textSecondary} />
                    <Text style={styles.dateText}>
                      {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}
                    </Text>
                  </View>
                  <View style={styles.dateItem}>
                    <Ionicons name="people-outline" size={14} color={Colors.textSecondary} />
                    <Text style={styles.dateText}>
                      {booking.guests} voyageur{booking.guests > 1 ? 's' : ''}
                    </Text>
                  </View>
                </View>

                <View style={styles.bookingBottom}>
                  <Text style={styles.bookingPrice}>
                    {formatPrice(booking.totalPrice, booking.currency)}
                  </Text>
                  {booking.status === 'confirmed' && (
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => handleCancelBooking(booking.id)}
                    >
                      <Text style={styles.cancelText}>Annuler</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  notAuthContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  notAuthTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 16,
  },
  notAuthSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 14,
  },
  loginButtonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: '700',
  },
  profileHeader: {
    backgroundColor: Colors.primary,
    paddingTop: 70,
    paddingBottom: 30,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textLight,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.textLight,
    opacity: 0.8,
    marginTop: 4,
  },
  userPhone: {
    fontSize: 14,
    color: Colors.textLight,
    opacity: 0.8,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 16,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButton: {
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: '500',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  emptyBookings: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  bookingCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bookingImage: {
    width: '100%',
    height: 120,
    backgroundColor: Colors.border,
  },
  bookingInfo: {
    padding: 14,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  bookingName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bookingRef: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  bookingDates: {
    gap: 4,
    marginBottom: 10,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  bookingBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingPrice: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.primary,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: Colors.error,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  cancelText: {
    fontSize: 13,
    color: Colors.error,
    fontWeight: '600',
  },
});
