import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity, ScrollView, Alert, Platform, RefreshControl, TextInput, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';



const DUMMY_ARTICLES = [
  {
    id: '1',
    title: 'React Native 0.76 Released',
    description: 'The new architecture is now enabled by default for faster mobile apps.',
    source: 'Tech Crunch'
  },
  {
    id: '2',
    title: 'SpaceX Prepares for Next Starship Launch',
    description: 'Engineers finish final hot fire tests ahead of the upcoming orbital attempt.',
    source: 'Space News',
  },
  {
    id: '3',
    title: 'AI Advances in Medical Diagnostics',
    description: 'New machine learning models assist doctors in early disease detection.',
    source: 'Health Daily',
  },
];

const CATEGORIES = ['technology', 'business', 'sports', 'science', 'health', 'entertainment'];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('technology');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNews();
    setRefreshing(false);
  };

    const quickSave = async (article: any) => {
 
    try {
      const existing = await AsyncStorage.getItem('SAVED_ARTICLES');
      const savedList = existing ? JSON.parse(existing) : [];

      const currentArticle = {
        title: article.title,
        description: article.description,
        urlToImage: article.urlToImage,
        source: article.source?.name,
      };

      const exists = savedList.some((item: any) => item.title === currentArticle.title);

      if (!exists) {
        savedList.push(currentArticle);
        await AsyncStorage.setItem('SAVED_ARTICLES', JSON.stringify(savedList));
        if (Platform.OS === 'web') alert('Article saved!');
        else Alert.alert('Saved', 'Article added to bookmarks!');
      } else {
        if (Platform.OS === 'web') alert('Already saved!');
        else Alert.alert('Notice', 'Already saved in your bookmarks.');
      }
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [selectedCategory]); //Re-fetches whenever category cahnges!
  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://saurav.tech/NewsAPI/top-headlines/category/${selectedCategory}/us.json`

      );
      const data = await response.json();
      setArticles(data.articles);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };
  const filteredArticles = articles.filter((article: any) => 

  article.title?.toLowerCase().includes(searchQuery.toLowerCase())
);
  return (
    
    <View style={[styles.container, isDark && { backgroundColor: '#121212' }]}>
          {/* Search Bar */}
    <View style={[styles.searchContainer, isDark && { backgroundColor: '#202124' }]}>
      <Ionicons name="search" size={20} color={isDark ? '#9aa0a6' : '#5f6368'} style={{ marginRight: 8 }} />
      <TextInput
        placeholder="Search news..."
        placeholderTextColor="#5f6368"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={[styles.searchInput, isDark && { color: '#e8eaed' }]}
      />
      {searchQuery ? (
        <TouchableOpacity onPress={() => setSearchQuery('')}>
          <Ionicons name="close-circle" size={18} color="#5f6368" />
        </TouchableOpacity>
      ) : null}
    </View>

      {/* Category Bar*/}
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
  contentContainerStyle={{ paddingHorizontal: 12 }}>
    {CATEGORIES.map((cat) => (
      <TouchableOpacity
      key={cat}
      style={[styles.chip, selectedCategory === cat && styles.activeChip]}
      onPress={() => setSelectedCategory(cat)}
      >
        <Text style={[styles.chipText, selectedCategory === cat && styles.activeChipText]}>
          {cat.charAt(0).toUpperCase() + cat.slice(1)}
        </Text>
      </TouchableOpacity>  
    ))}
    </ScrollView>
  </View>
          {loading ? (
        <ActivityIndicator size="large" color="#1a73e8" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredArticles}
          keyExtractor={(item, index) => item.url || index.toString()}
          refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        colors={['#1a73e8']} // Google Blue on Android
        tintColor="#1a73e8"  // Google Blue on iOS
      />
    }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, isDark && { backgroundColor: '#1e1e1e', borderColor: '#3c4043' }]}
              onPress={() =>
                router.push({
                  pathname: '/details',
                  params: {
                    title: item.title,
                    description: item.description,
                    urlToImage: item.urlToImage || '',
                    source: item.source?.name || '',
                  },
                })
              }
            >
              
              {/* Source Name on Top */}
              <Text style={[styles.title, isDark && { color: '#e8eaed' }]}>{item.title}</Text>
              {item.urlToImage ? (
                <Image source={{ uri: item.urlToImage }} style={styles.image} />
  ) : null}

              <Text style={[styles.subtitle, isDark && { color: '#9aa0a6' }]}>{item.description}</Text>
              {/* Google News Card Footer */}
    <View style={styles.cardFooter}>
      <Text style={[styles.source, isDark && { color: '#9aa0a6' }]}>{item.source?.name || 'News'}</Text>
      <TouchableOpacity onPress={() => quickSave(item)} style={{ padding: 4 }}>
        <Ionicons name="bookmark-outline" size={20} color={isDark ? '#9aa0a6' : '#5f6368'} />
      </TouchableOpacity>
      </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
    searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f3f4',
    borderRadius: 24, // Round Google search pill shape
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#202124',
  },

  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    borderRadius: 12, // Soft Google Material corners
    borderWidth: 1,
    borderColor: '#e8eaed', // Crisp Google border
  },
    cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },

  title: {
    fontSize: 17,
    fontWeight: '500',
    color: '#202124', // Google dark text color
    lineHeight: 24,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#5f6368',
    lineHeight: 20,
    marginTop: 8,
  },
  source: {
    fontSize: 13,
    color: '#5f6368', // Google secondary text color
    fontWeight: '600',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 190,
    borderRadius: 8,
  },
    categoryContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e8eaed',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20, // Gives rounded capsule shape
    backgroundColor: '#f1f3f4',
    marginHorizontal: 4,
  },
  activeChip: {
    backgroundColor: '#1a73e8', // Google Blue
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3c4043',
  },
  activeChipText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },

});