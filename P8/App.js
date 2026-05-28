import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const colors = {
  pageBg: '#F9FAFB',
  headerGreen: '#3D7A4D',
  headerGreenDark: '#2F5F3D',
  white: '#FFFFFF',
  card: '#FFFFFF',
  ink: '#1F2937',
  inkMuted: '#6B7280',
  inkSoft: '#9CA3AF',
  primary: '#3D7A4D',
  primaryBorder: '#2F5F3D',
  primarySoft: '#E8F0E8',
  badgeBg: '#DCFCE7',
  badgeText: '#166534',
  danger: '#DC2626',
  borderLight: '#E5E7EB',
};

export default function App() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // useEffect dijalankan saat komponen pertama kali dirender
  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    try {
      setLoading(true);
      setError('');

      // fetch API menggunakan HTTP GET untuk mengambil data JSON
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');

      if (!response.ok) {
        throw new Error('Gagal mengambil data dari API');
      }

      const data = await response.json();

      setPosts(data);
      setFilteredPosts(data);
    } catch (err) {
      setError('API gagal diakses. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // handleSearch memfilter data berdasarkan title atau body secara real-time
  const handleSearch = (text) => {
    setSearchText(text);

    if (text.trim() === '') {
      setFilteredPosts(posts);
      return;
    }

    const keyword = text.toLowerCase();

    const filteredData = posts.filter((post) => {
      return (
        post.title.toLowerCase().includes(keyword) ||
        post.body.toLowerCase().includes(keyword)
      );
    });

    setFilteredPosts(filteredData);
  };

  const renderPostItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.postId}>ID Postingan: {item.id}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.body}>{item.body}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>JSON API Search App</Text>
      </View>

      <View style={styles.content}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari postingan..."
          placeholderTextColor={colors.inkSoft}
          value={searchText}
          onChangeText={handleSearch}
        />

        {!loading && !error ? (
          <Text style={styles.resultText}>
            Menampilkan {filteredPosts.length} data
          </Text>
        ) : null}

        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Mengambil data...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContent}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          // FlatList digunakan untuk menampilkan data JSON ke layar
          <FlatList
            data={filteredPosts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderPostItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.pageBg,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    backgroundColor: colors.headerGreen,
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchInput: {
    backgroundColor: colors.card,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.ink,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  resultText: {
    marginTop: 12,
    marginBottom: 8,
    color: colors.inkMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  postId: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  title: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  body: {
    color: colors.inkMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: colors.inkMuted,
    fontSize: 15,
  },
  errorText: {
    color: colors.danger,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});
