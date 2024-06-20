// screens/NewsScreen.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { fetchNews } from "../../api";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const categories = ["All", "Global", "Stocks", "Mutual Funds", "RBI"];

const NewsScreen = ({ navigation }) => {
  const [news, setNews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getNews = async (category) => {
      setLoading(true);
      const articles = await fetchNews(category === "All" ? "" : category);
      setNews(articles);
      setLoading(false);
    };
    getNews(selectedCategory);
  }, [selectedCategory]);

  return (
    <>
      <View style={styles.container}>
        <Header heading="News" />
        <View style={styles.filterContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterButton,
                selectedCategory === category && styles.selectedFilterButton,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedCategory === category && styles.selectedFilterText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {news.map((article, index) => (
              <TouchableOpacity
                key={index}
                style={styles.newsCard}
                onPress={() =>
                  navigation.navigate("WebView", {
                    url: article.url,
                    title: "News",
                  })
                }
              >
                {article.urlToImage && (
                  <Image
                    source={{ uri: article.urlToImage }}
                    style={styles.newsImage}
                  />
                )}
                <View style={styles.newsContent}>
                  <Text style={styles.newsTitle}>{article.title}</Text>
                  <Text style={styles.newsDescription}>
                    {article.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
      <Footer navigation={navigation} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  filterButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
  },
  selectedFilterButton: {
    backgroundColor: "#1a75ff",
  },
  filterText: {
    color: "#000",
  },
  selectedFilterText: {
    color: "#fff",
  },
  scrollContainer: {
    padding: 20,
  },
  newsCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  newsImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 20,
  },
  newsContent: {
    flex: 1,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  newsDescription: {
    fontSize: 14,
    color: "#333",
    marginVertical: 10,
  },
});

export default NewsScreen;
