import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Colors } from '../theme/colors';
import { properties, neighborhoods } from '../data/properties';
import PropertyCard from '../components/PropertyCard';
import SearchBar from '../components/SearchBar';
import { PropertyType } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<any>;
};

export default function PropertyListScreen({ navigation, route }: Props) {
  const initialFilter = route.params?.filter as PropertyType | undefined;
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>(initialFilter || 'all');
  const [neighborhoodFilter, setNeighborhoodFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'rating'>('rating');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProperties = useMemo(() => {
    let result = [...properties];

    if (typeFilter !== 'all') {
      result = result.filter((p) => p.type === typeFilter);
    }
    if (neighborhoodFilter !== 'all') {
      result = result.filter((p) => p.neighborhood === neighborhoodFilter);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.neighborhood.toLowerCase().includes(query)
      );
    }

    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.pricePerNight - b.pricePerNight);
        break;
      case 'price_desc':
        result.sort((a, b) => b.pricePerNight - a.pricePerNight);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [typeFilter, neighborhoodFilter, searchQuery, sortBy]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Hébergements</Text>
        <View style={{ width: 40 }} />
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFilterPress={() => setShowFilters(true)}
      />

      {/* Sort tabs */}
      <View style={styles.sortRow}>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'rating' && styles.sortButtonActive]}
          onPress={() => setSortBy('rating')}
        >
          <Text style={[styles.sortText, sortBy === 'rating' && styles.sortTextActive]}>
            Mieux notés
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'price_asc' && styles.sortButtonActive]}
          onPress={() => setSortBy('price_asc')}
        >
          <Text style={[styles.sortText, sortBy === 'price_asc' && styles.sortTextActive]}>
            Prix ↑
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'price_desc' && styles.sortButtonActive]}
          onPress={() => setSortBy('price_desc')}
        >
          <Text style={[styles.sortText, sortBy === 'price_desc' && styles.sortTextActive]}>
            Prix ↓
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.resultCount}>
        {filteredProperties.length} hébergement{filteredProperties.length > 1 ? 's' : ''} trouvé{filteredProperties.length > 1 ? 's' : ''}
      </Text>

      <FlatList
        data={filteredProperties}
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
            <Ionicons name="search-outline" size={64} color={Colors.border} />
            <Text style={styles.emptyText}>Aucun résultat trouvé</Text>
            <Text style={styles.emptySubtext}>Essayez de modifier vos filtres</Text>
          </View>
        }
      />

      {/* Filter Modal */}
      <Modal visible={showFilters} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtres</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Ionicons name="close" size={28} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.filterLabel}>Type d'hébergement</Text>
            <View style={styles.filterRow}>
              {[
                { id: 'all', label: 'Tout' },
                { id: 'hotel', label: 'Hôtels' },
                { id: 'apartment', label: 'Appartements' },
              ].map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.filterChip, typeFilter === item.id && styles.filterChipActive]}
                  onPress={() => setTypeFilter(item.id)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      typeFilter === item.id && styles.filterChipTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.filterLabel}>Quartier</Text>
            <View style={styles.filterRow}>
              <TouchableOpacity
                style={[styles.filterChip, neighborhoodFilter === 'all' && styles.filterChipActive]}
                onPress={() => setNeighborhoodFilter('all')}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    neighborhoodFilter === 'all' && styles.filterChipTextActive,
                  ]}
                >
                  Tous
                </Text>
              </TouchableOpacity>
              {neighborhoods.map((n) => (
                <TouchableOpacity
                  key={n}
                  style={[styles.filterChip, neighborhoodFilter === n && styles.filterChipActive]}
                  onPress={() => setNeighborhoodFilter(n)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      neighborhoodFilter === n && styles.filterChipTextActive,
                    ]}
                  >
                    {n}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setShowFilters(false)}
            >
              <Text style={styles.applyButtonText}>Appliquer les filtres</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  sortRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sortButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  sortText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  sortTextActive: {
    color: Colors.textLight,
  },
  resultCount: {
    fontSize: 13,
    color: Colors.textSecondary,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
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
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 13,
    color: Colors.text,
  },
  filterChipTextActive: {
    color: Colors.textLight,
    fontWeight: '600',
  },
  applyButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  applyButtonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: '700',
  },
});
