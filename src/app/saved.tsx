import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useFocusEffect } from 'expo-router';

export default function SavedArticlesScreen() {
    const removeArticle = async (titleToRemove: string) => {
    try {
      const updatedList = savedArticles.filter((article: any) => article.title !== titleToRemove);
      setSavedArticles(updatedList);
      await AsyncStorage.setItem('SAVED_ARTICLES', JSON.stringify(updatedList));
    } catch (error) {
      console.error('Error removing article:', error);
    }
  };

  const [savedArticles, setSavedArticles] = useState([]);
  const router = useRouter();

  // useFocusEffect runs whenever the user navigates back to this screen
  useFocusEffect(
    useCallback(() => {
      loadSavedArticles();
    }, [])
  );

  const loadSavedArticles = async () => {
    try {
      const savedData = await
AsyncStorage.getItem('SAVED_ARTICLES');
     if (savedData){
      setSavedArticles(JSON.parse(savedData));
     }
    } catch (error){
      console.error('Error loading saved articles:', error);
    }
  };
  return (
    <View style={styles.container}>
      {savedArticles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No saved articles yet.
</Text>
          </View>
      ) : (
        <FlatList
         data={savedArticles}
         keyExtractor={(item, index) => index.toString()}
         renderItem={({ item }: { item: any}) => (
          <TouchableOpacity
          style={styles.card}
          onPress={() =>
            router.push({
              pathname: '/details',
              params: {
                title: item.title,
                description: item.description,
                urlToImage: item.urlToImage || '',
                source: item.source || '',
              },
            })
          }
          >
            {item.urlToImage ? (
              <Image source={{ uri: item.urlToImage }} style={styles.image} />
            ) : null}
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.description}
</Text>
              {/* Card Footer with Trash Icon */}
  <View style={styles.cardFooter}>
    <Text style={styles.source}>{item.source || 'Saved News'}</Text>
    <TouchableOpacity onPress={() => removeArticle(item.title)} style={{ padding: 4 }}>
      <Ionicons name="trash-outline" size={20} color="#ea4335" />
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
    emptyContainer: {
      flex:1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 16,
      color: '#888888',
    },
    card: {
      backgroundColor: '#ffffff',
      padding: 16,
      marginVertical: 8,
      marginHorizontal: 16,
      borderRadius: 8,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
      cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },

    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333333',
    },
    subtitle: {
      fontSize: 14,
      color: '#666666',
      marginTop: 6,
    },
    source: {
      fontSize: 12,
      color: '#007AFF',
      marginTop: 8,
      fontWeight: '600',
    },
    image: {
      width: '100%',
      height: 180,
      borderRadius: 6,
      marginBottom: 10,
    },
   });