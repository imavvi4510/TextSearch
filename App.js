import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TextInput,
} from "react-native";

import filter from "lodash.filter";

const API_ENDPOINT = `https://raw.githubusercontent.com/samayo/country-json/master/src/country-by-name.json`;

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [fullData, setFullData] = useState([]);

  useEffect(() => {
    setIsLoading(true);

    fetch(API_ENDPOINT)
      .then((response) => response.json())
      .then((response) => {
        setData(response);

        // ADD THIS
        setFullData(response);

        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err);
      });
  }, []);

  const handleSearch = (text) => {
    const formattedQuery = text.toUpperCase();
    const filteredData = filter(fullData, ({ country }) => {
      return country.toUpperCase().includes(formattedQuery);
    });
    setData(filteredData);
    setQuery(text);
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "grey",
        }}
      >
        <ActivityIndicator size="large" color="#5500dc" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 18 }}>
          Error fetching data... Check your network connection!
        </Text>
      </View>
    );
  }

  console.log("the data >>>", data);
  console.log("Full datttaaa", fullData);

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <Text style={styles.text}>Favorite Country</Text>
      </View>
      <View style={{ height: 296, borderBottomWidth: 0, borderRadius: 0 }}>
        <View style={{ marginRight: 10, marginLeft: 10 }}>
          <>
            <RenderHeader
              query={query}
              handleSearch={(queryText) => handleSearch(queryText)}
            />
          </>
        </View>
        {query ? (
          <FlatList
            data={data}
            keyExtractor={(item) => item.last}
            renderItem={({ item }) => (
              <View style={styles.metaInfo}>
                <Text style={styles.title}>{item.country}</Text>
              </View>
            )}
          />
        ) : (
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 20 }}>No Data</Text>
          </View>
        )}
      </View>
    </View>
  );
}

function RenderHeader(props) {
  return (
    <View
      style={{
        backgroundColor: "#38523f",
        padding: 7,
        marginVertical: 0,
        borderRadius: 10,
        marginTop: 20,
      }}
    >
      <TextInput
        autoCapitalize="none"
        autoCorrect={true}
        clearButtonMode="always"
        value={props.query}
        onChangeText={(queryText) => props.handleSearch(queryText)}
        placeholder="Search"
        style={{
          backgroundColor: "#a8a271",
          paddingHorizontal: 20,
          borderRadius: 10,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#38523f",
    // alignItems: "center",
  },
  text: {
    fontSize: 20,
    color: "#101010",
    marginTop: 70,
    fontWeight: "700",
  },
  listItem: {
    marginTop: 90,
    paddingVertical: 0,
    paddingHorizontal: 0,
    backgroundColor: "#fff",
    // flexDirection: "row",
  },
  coverImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 0.5,
  },
  metaInfo: {
    marginLeft: 0,

    borderRadius: 5,
    borderWidth: 0.5,
  },
  title: {
    fontSize: 18,
    width: 200,
    padding: 10,
  },
});
