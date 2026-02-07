import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../theme/colors';
import { properties } from '../data/properties';
import PropertyCard from '../components/PropertyCard';
import SearchBar from '../components/SearchBar';
import { useApp } from '../context/AppContext';
import { PropertyType } from '../types';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const categories = [
  { id: 'all', label: 'Tout', icon: 'grid-outline' as const },
  { id: 'hotel', label: 'Hôtels', icon: 'business-outline' as const },
  { id: 'apartment', label: 'Appartements', icon: 'home-outline' as const },
];

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { user } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const featuredProperties = useMemo(
    () => properties.filter((p) => p.isFeatured),
    []
  );

  const filteredProperties = useMemo(() => {
    let result = properties;
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.type === selectedCategory);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.neighborhood.toLowerCase().includes(query) ||
          p.address.toLowerCase().includes(query)
      );
    }
    return result;
  }, [selectedCategory, searchQuery]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Bonjour{user ? `, ${user.fullName.split(' ')[0]}` : ''} !
            </Text>
            <Text style={styles.subtitle}>
              Trouvez votre hébergement à Brazzaville
            </Text>
          </View>
          <TouchableOpacity
            style={styles.notifButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-circle-outline" size={36} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFilterPress={() =>
            navigation.navigate('PropertyList', { filter: selectedCategory as PropertyType })
          }
        />

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryButton,
                selectedCategory === cat.id && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Ionicons
                name={cat.icon}
                size={20}
                color={selectedCategory === cat.id ? Colors.textLight : Colors.text}
              />
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat.id && styles.categoryTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Featured Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>En vedette</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('PropertyList', {})}
          >
            <Text style={styles.seeAll}>Voir tout</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          data={featuredProperties}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredList}
          renderItem={({ item }) => (
            <PropertyCard
              property={item}
              horizontal
              onPress={() => navigation.navigate('PropertyDetail', { property: item })}
            />
          )}
        />

        {/* Popular Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'all'
              ? 'Populaires'
              : selectedCategory === 'hotel'
              ? 'Hôtels populaires'
              : 'Appartements populaires'}
          </Text>
          <Text style={styles.resultCount}>{filteredProperties.length} résultats</Text>
        </View>

        <View style={styles.propertyList}>
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onPress={() => navigation.navigate('PropertyDetail', { property })}
            />
          ))}
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  notifButton: {
    padding: 4,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 10,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  categoryButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  categoryTextActive: {
    color: Colors.textLight,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 14,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  seeAll: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  resultCount: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  featuredList: {
    paddingLeft: 20,
    paddingRight: 4,
    paddingBottom: 8,
  },
  propertyList: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
});
