import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, Platform, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';

export default function ArticleDetailScreen() {
    const shareArticle = async () => {
    try {
      await Share.share({
        message: `${params.title}\n\nRead more on Google News!`,
      });
    } catch (error) {
      console.error('Error sharing article:', error);
    }
  };

  const params = useLocalSearchParams();

  const saveArticle = async () => {
    try {
      const existing = await AsyncStorage.getItem('SAVED_ARTICLES');
      const savedList = existing ? JSON.parse(existing) : [];

      const currentArticle = {
        title: params.title,
        description: params.description,
        urlToImage: params.urlToImage,
        source: params.source,
      };

      const exists = savedList.some((item: any) => item.title === currentArticle.title);

      if (!exists) {
        savedList.push(currentArticle);
        await AsyncStorage.setItem('SAVED_ARTICLES', JSON.stringify(savedList));
        
        // Works on both Web and Mobile phones
        if (Platform.OS === 'web') {
          alert('Article saved to your bookmarks!');
        } else {
          Alert.alert('Success', 'Article saved to your bookmarks!');
        }
      } else {
        if (Platform.OS === 'web') {
          alert('This article is already saved.');
        } else {
          Alert.alert('Notice', 'This article is already saved.');
        }
      }
    } catch (error) {
      console.error('Error saving article:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {params.urlToImage ? (
        <Image source={{ uri: params.urlToImage as string }} style={styles.image} />
      ) : null}
      <View style={styles.content}>
        <Text style={styles.title}>{params.title}</Text>
        <Text style={styles.source}>{params.source}</Text>
        <Text style={styles.description}>{params.description}</Text>

        <TouchableOpacity style={styles.saveButton} onPress={saveArticle}>
          <Text style={styles.saveButtonText}>Bookmark Article</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton} onPress={shareArticle}>
    <Text style={styles.shareButtonText}>Share Article</Text>
  </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  image: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  source: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#444444',
    lineHeight: 24,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
    shareButton: {
    backgroundColor: '#f1f3f4',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  shareButtonText: {
    color: '#202124',
    fontSize: 16,
    fontWeight: '600',
  },

});
