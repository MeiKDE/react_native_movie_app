import React from "react";

// These are basic building blocks from React Native
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  FlatList,
} from "react-native";

// This helps you navigate to another screen
import { useRouter } from "expo-router";
// Custom hooks and services to get movie data
import useFetch from "@/services/usefetch";
import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
// App images and icons
import { icons } from "@/constants/icons";
import { images } from "../../constants/images";
// Reusable components
import SearchBar from "@/components/SearchBar";
import MovieCard from "@/components/MovieCard";
import TrendingCard from "@/components/TrendingCard";

const Index = () => {
  const router = useRouter();

  /*******************************************************************
    This code builds a beautiful home screen for a movie app, with:
    A background and logo
    A search bar
    A trending section that scrolls sideways
    A grid of latest movies
    Loading and error handling
   * ******************************************************************/

  //  Get trending movies (getTrendingMovies)
  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(getTrendingMovies);

  //  Get all/latest movies (fetchMovies based on query)
  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() => fetchMovies({ query: "" }));

  return (
    <View className="flex-1 bg-primary">
      {/* show a background image and app’s logo at the top. */}
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

        {/* Shows a spinner if the data is still loading
        Shows an error message if something went wrong
        Otherwise shows the actual movie content */}

        {moviesLoading || trendingLoading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="mt-10 self-center"
          />
        ) : moviesError || trendingError ? (
          <Text>Error: {moviesError?.message || trendingError?.message}</Text>
        ) : (
          <View className="flex-1 mt-5">
            {/* Shows a search bar
            When clicked, it goes to the /search screen */}
            <SearchBar
              onPress={() => {
                router.push("/search");
              }}
              placeholder="Search for a movie"
            />

            {trendingMovies && (
              <View className="mt-10">
                <Text className="text-lg text-white font-bold mb-3">
                  Trending Movies
                </Text>
                {/* 
                Scrollable sideways
                Shows trending movies using TrendingCard */}
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="mb-4 mt-3"
                  data={trendingMovies}
                  contentContainerStyle={{
                    gap: 26,
                  }}
                  renderItem={({ item, index }) => (
                    <TrendingCard movie={item} index={index} />
                  )}
                  keyExtractor={(item) => item.movie_id.toString()}
                  ItemSeparatorComponent={() => <View className="w-4" />}
                />
              </View>
            )}

            <>
              <Text className="text-lg text-white font-bold mt-5 mb-3">
                Latest Movies
              </Text>
              {/* 
              A grid of 3 columns
              Shows the latest movies using MovieCard */}

              <FlatList
                data={movies}
                renderItem={({ item }) => <MovieCard {...item} />}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                columnWrapperStyle={{
                  justifyContent: "flex-start",
                  gap: 20,
                  paddingRight: 5,
                  marginBottom: 10,
                }}
                className="mt-2 pb-32"
                scrollEnabled={false}
              />
            </>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Index;
