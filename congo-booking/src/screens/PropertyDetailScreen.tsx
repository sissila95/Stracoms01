import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Colors } from '../theme/colors';
import { Property } from '../types';
import { formatPrice } from '../utils/format';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');

type RootStackParamList = {
  PropertyDetail: { property: Property };
};

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<RootStackParamList, 'PropertyDetail'>;
};

export default function PropertyDetailScreen({ navigation, route }: Props) {
  const { property } = route.params;
  const { favorites, toggleFavorite, isAuthenticated } = useApp();
  const isFavorite = favorites.includes(property.id);
  const [currentImage, setCurrentImage] = useState(0);

  const amenityIcons: Record<string, string> = {
    WiFi: 'wifi',
    Piscine: 'water',
    Restaurant: 'restaurant',
    Spa: 'flower',
    Parking: 'car',
    Climatisation: 'snow',
    'Room Service': 'room-service',
    'Salle de sport': 'fitness',
    Bar: 'wine',
    'Cuisine équipée': 'restaurant-outline',
    'Machine à laver': 'water-outline',
    'TV écran plat': 'tv',
    Balcon: 'sunny',
    Jardin: 'leaf',
    Barbecue: 'flame',
    Terrasse: 'umbrella',
    'Sécurité 24h': 'shield-checkmark',
    Sécurité: 'shield-checkmark',
    'Vue fleuve': 'eye',
    Blanchisserie: 'shirt',
    'Réception 24h': 'time',
    'Navette aéroport': 'airplane',
    'Salle de conférence': 'people',
    'Salle de réunion': 'people',
    Concierge: 'person',
    Kitchenette: 'restaurant-outline',
    TV: 'tv',
  };

  const getAmenityIcon = (amenity: string): string => {
    return amenityIcons[amenity] || 'checkmark-circle';
  };

  const handleCall = () => {
    Linking.openURL(`tel:${property.contactPhone}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${property.contactEmail}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / width);
              setCurrentImage(idx);
            }}
            scrollEventThrottle={16}
          >
            {property.images.map((img: string, idx: number) => (
              <Image key={idx} source={{ uri: img }} style={styles.image} />
            ))}
          </ScrollView>

          {/* Back & Favorite buttons */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.favButton}
            onPress={() => toggleFavorite(property.id)}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? Colors.accent : Colors.text}
            />
          </TouchableOpacity>

          {/* Image indicators */}
          <View style={styles.indicators}>
            {property.images.map((_: string, idx: number) => (
              <View
                key={idx}
                style={[
                  styles.indicator,
                  currentImage === idx && styles.indicatorActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Type badge & Rating */}
          <View style={styles.topRow}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>
                {property.type === 'hotel' ? 'Hôtel' : 'Appartement'}
              </Text>
            </View>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={18} color={Colors.star} />
              <Text style={styles.ratingText}>{property.rating}</Text>
              <Text style={styles.reviewCount}>({property.reviewCount} avis)</Text>
            </View>
          </View>

          {/* Name */}
          <Text style={styles.name}>{property.name}</Text>

          {/* Location */}
          <View style={styles.locationRow}>
            <Ionicons name="location" size={18} color={Colors.primary} />
            <Text style={styles.locationText}>
              {property.address}, {property.city}
            </Text>
          </View>

          {/* Quick Info */}
          <View style={styles.quickInfo}>
            <View style={styles.quickItem}>
              <Ionicons name="bed-outline" size={22} color={Colors.primary} />
              <Text style={styles.quickText}>{property.rooms} chambre{property.rooms > 1 ? 's' : ''}</Text>
            </View>
            <View style={styles.quickItem}>
              <Ionicons name="water-outline" size={22} color={Colors.primary} />
              <Text style={styles.quickText}>{property.bathrooms} SDB</Text>
            </View>
            <View style={styles.quickItem}>
              <Ionicons name="people-outline" size={22} color={Colors.primary} />
              <Text style={styles.quickText}>{property.maxGuests} pers.</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{property.description}</Text>

          {/* Amenities */}
          <Text style={styles.sectionTitle}>Équipements</Text>
          <View style={styles.amenitiesGrid}>
            {property.amenities.map((amenity: string, idx: number) => (
              <View key={idx} style={styles.amenityItem}>
                <Ionicons
                  name={getAmenityIcon(amenity) as any}
                  size={20}
                  color={Colors.primary}
                />
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>

          {/* Contact */}
          <Text style={styles.sectionTitle}>Contact</Text>
          <View style={styles.contactRow}>
            <TouchableOpacity style={styles.contactButton} onPress={handleCall}>
              <Ionicons name="call" size={20} color={Colors.primary} />
              <Text style={styles.contactButtonText}>Appeler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactButton} onPress={handleEmail}>
              <Ionicons name="mail" size={20} color={Colors.primary} />
              <Text style={styles.contactButtonText}>Email</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Bottom Booking Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.priceLabel}>Prix par nuit</Text>
          <Text style={styles.price}>{formatPrice(property.pricePerNight)}</Text>
        </View>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => {
            if (!isAuthenticated) {
              navigation.navigate('Auth');
              return;
            }
            navigation.navigate('Booking', { property });
          }}
        >
          <Text style={styles.bookButtonText}>Réserver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width,
    height: 300,
    backgroundColor: Colors.border,
  },
  backButton: {
    position: 'absolute',
    top: 52,
    left: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 8,
  },
  favButton: {
    position: 'absolute',
    top: 52,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 8,
  },
  indicators: {
    position: 'absolute',
    bottom: 16,
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 6,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  indicatorActive: {
    backgroundColor: Colors.textLight,
    width: 24,
  },
  content: {
    padding: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  typeBadge: {
    backgroundColor: Colors.primaryLight + '20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 6,
    flex: 1,
  },
  quickInfo: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  quickItem: {
    alignItems: 'center',
    gap: 6,
  },
  quickText: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  amenityText: {
    fontSize: 13,
    color: Colors.text,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  contactButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary,
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
  priceLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  price: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
  },
  bookButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 14,
  },
  bookButtonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: '700',
  },
});
