import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../theme/colors';
import { properties } from '../data/properties';
import PropertyCard from '../components/PropertyCard';
import { useApp } from '../context/AppContext';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function FavoritesScreen({ navigation }: Props) {
  const { favorites } = useApp();
  const favoriteProperties = properties.filter((p) => favorites.includes(p.id));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes Favoris</Text>
        <Text style={styles.count}>{favoriteProperties.length} hébergement{favoriteProperties.length !== 1 ? 's' : ''}</Text>
      </View>

      <FlatList
        data={favoriteProperties}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <PropertyCard
            property={item}
            onPress={() => navigation.navigate('PropertyDetail', { property: item })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={64} color={Colors.border} />
            <Text style={styles.emptyText}>Aucun favori</Text>
            <Text style={styles.emptySubtext}>
              Appuyez sur le coeur pour ajouter des hébergements à vos favoris
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.exploreText}>Explorer</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
  },
  count: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 14,
  },
  exploreText: {
    color: Colors.textLight,
    fontSize: 15,
    fontWeight: '700',
  },
});
