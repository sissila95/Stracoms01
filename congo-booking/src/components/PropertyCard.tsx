import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Property } from '../types';
import { Colors } from '../theme/colors';
import { formatPrice } from '../utils/format';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');

interface PropertyCardProps {
  property: Property;
  onPress: () => void;
  horizontal?: boolean;
}

export default function PropertyCard({ property, onPress, horizontal }: PropertyCardProps) {
  const { favorites, toggleFavorite } = useApp();
  const isFavorite = favorites.includes(property.id);

  if (horizontal) {
    return (
      <TouchableOpacity style={styles.horizontalCard} onPress={onPress} activeOpacity={0.8}>
        <Image source={{ uri: property.images[0] }} style={styles.horizontalImage} />
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(property.id)}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={22}
            color={isFavorite ? Colors.accent : Colors.textLight}
          />
        </TouchableOpacity>
        <View style={styles.horizontalInfo}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>
              {property.type === 'hotel' ? 'Hôtel' : 'Appartement'}
            </Text>
          </View>
          <Text style={styles.horizontalName} numberOfLines={1}>
            {property.name}
          </Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.locationText}>{property.neighborhood}</Text>
          </View>
          <View style={styles.bottomRow}>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color={Colors.star} />
              <Text style={styles.ratingText}>{property.rating}</Text>
              <Text style={styles.reviewText}>({property.reviewCount})</Text>
            </View>
            <Text style={styles.price}>
              {formatPrice(property.pricePerNight)}
              <Text style={styles.perNight}>/nuit</Text>
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: property.images[0] }} style={styles.image} />
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => toggleFavorite(property.id)}
      >
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={22}
          color={isFavorite ? Colors.accent : Colors.textLight}
        />
      </TouchableOpacity>
      <View style={styles.typeBadge}>
        <Text style={styles.typeBadgeText}>
          {property.type === 'hotel' ? 'Hôtel' : 'Appartement'}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {property.name}
        </Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
          <Text style={styles.locationText}>{property.neighborhood}, {property.city}</Text>
        </View>
        <View style={styles.bottomRow}>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color={Colors.star} />
            <Text style={styles.ratingText}>{property.rating}</Text>
            <Text style={styles.reviewText}>({property.reviewCount} avis)</Text>
          </View>
          <Text style={styles.price}>
            {formatPrice(property.pricePerNight)}
            <Text style={styles.perNight}>/nuit</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.border,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 8,
  },
  typeBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: {
    color: Colors.textLight,
    fontSize: 12,
    fontWeight: '600',
  },
  info: {
    padding: 14,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
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
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 4,
  },
  reviewText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  perNight: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  // Horizontal card styles
  horizontalCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginRight: 16,
    width: width * 0.7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  horizontalImage: {
    width: '100%',
    height: 150,
    backgroundColor: Colors.border,
  },
  horizontalInfo: {
    padding: 12,
  },
  horizontalName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
});
