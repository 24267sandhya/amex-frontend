import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import Footer from "../../components/Footer";

const { height } = Dimensions.get("window");

const videos = [
  {
    id: "1",
    title: "Video 1",
    user: "User1",
    likes: 100,
    comments: 50,
    shares: 30,
    uri: require("../../assets/videos/video1.mp4"),
  },
  {
    id: "2",
    title: "Video 2",
    user: "User2",
    likes: 200,
    comments: 70,
    shares: 50,
    uri: require("../../assets/videos/video2.mp4"),
  },
  {
    id: "3",
    title: "Video 3",
    user: "User3",
    likes: 300,
    comments: 90,
    shares: 70,
    uri: require("../../assets/videos/video3.mp4"),
  },
  {
    id: "4",
    title: "Video 4",
    user: "User4",
    likes: 400,
    comments: 110,
    shares: 90,
    uri: require("../../assets/videos/video4.mp4"),
  },
];

const VideoCard = ({ video, isPlaying }) => {
  const videoRef = useRef(null);

  return (
    <View style={styles.videoCard}>
      <Video
        ref={videoRef}
        source={video.uri}
        style={styles.video}
        resizeMode="cover"
        shouldPlay={isPlaying}
        isLooping
        useNativeControls={false}
      />
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Text style={styles.videoTitle}>{video.title}</Text>
          <Text style={styles.videoUser}>{video.user}</Text>
        </View>
        <View style={styles.videoActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="heart-outline" size={24} color="white" />
            <Text style={styles.actionText}>{video.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={24} color="white" />
            <Text style={styles.actionText}>{video.comments}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-outline" size={24} color="white" />
            <Text style={styles.actionText}>{video.shares}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const VideoScrollPage = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <>
      <View style={styles.container}>
        <FlatList
          data={videos}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <VideoCard video={item} isPlaying={index === currentIndex} />
          )}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToAlignment="start"
          decelerationRate="fast"
          getItemLayout={(data, index) => ({
            length: height,
            offset: height * index,
            index,
          })}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />
      </View>
      <Footer navigation={navigation} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  videoCard: {
    height: height,
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
    padding: 10,
  },
  header: {
    marginTop: 50,
  },
  videoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  videoUser: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
  videoActions: {
    flexDirection: "column",
    alignItems: "flex-end",
    marginBottom: 50,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  actionText: {
    marginLeft: 5,
    color: "white",
    fontSize: 16,
  },
});

export default VideoScrollPage;
