import {
  View,
  Text,
  Button,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
  TextInput,
} from "react-native";
import { supabase } from "../lib/supabase";
import { useState, useEffect } from "react";
import NameSelector from "../components/NameSelector";
import { Stack, useRouter, Link } from "expo-router";

const Home = () => {
  StatusBar.setBarStyle("light-content");

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [clientData, setClientData] = useState([]);

  const [searchInput, setSearchInput] = useState(""); // State to store user input
  const [filteredClientData, setFilteredClientData] = useState([]);

  useEffect(() => {
    async function fetchClients() {
      try {
        setLoading(true);
        const { data, error, status } = await supabase
          .from("Clients")
          .select("*");

        // console.log(data);

        if (error && status !== 406) {
          throw error;
        }
        if (data) {
          setClientData(data);
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchClients();
  }, []);

  const handleSearchInputChange = (text) => {
    setSearchInput(text);

    // Filter the client data based on the search input
    const filteredData = text
      ? clientData.filter((client) =>
          client.Name.toLowerCase().includes(text.toLowerCase())
        )
      : clientData; // Use the original data when search input is empty

    setFilteredClientData(filteredData);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "#000" },
          headerStatusBarHeight: StatusBar.currentHeight,
          headerShadowVisible: false,
          headerTitle: "",
          headerTitleStyle: { color: "#fff", fontSize: 16 },
          headerTitleAlign: "center",
          headerLeft: () => (
            <Image
              style={{
                width: 40,
                height: 30,
              }}
              source={require("../assets/jmlogosmall.png")}
            />
          ),
          headerRight: () => (
            <Text style={{ color: "#fff", fontSize: 15 }}>
              Select a Name to View Details
            </Text>
          ),
        }}
      />

      <View
        style={{
          paddingHorizontal: 15,
          backgroundColor: "#000",
          marginBottom: 10,
        }}
      >
        <TextInput
          style={{
            backgroundColor: "#141414",
            color: "#fff",
            borderRadius: 8,
            padding: 10,
          }}
          placeholder="Search by name"
          placeholderTextColor="#888"
          value={searchInput}
          onChangeText={handleSearchInputChange}
        />
      </View>

      {loading ? (
        <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text style={{ color: "#fff" }}>Loading data . . </Text>
      </View>
      ) : (
        <>
          {!searchInput && !loading ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                style={{ flex: 1, padding: 15, backgroundColor: "#0d0d0d" }}
              >
                {clientData.map((client, index) => (
                  <Link
                    style={{
                      color: "#d6d6d6",
                      fontSize: 16,
                      padding: 20,
                      backgroundColor: "#000",
                      marginBottom: 10,
                    }}
                    key={index}
                    href={{
                      pathname: "/clientdetail",
                      params: { name: client.Name, id: client.id },
                    }}
                  >
                    {client.Name}
                  </Link>
                ))}
              </View>
            </ScrollView>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                style={{ flex: 1, padding: 15, backgroundColor: "#0d0d0d" }}
              >
                {filteredClientData.map((client, index) => (
                  <Link
                    style={{
                      color: "#d6d6d6",
                      fontSize: 16,
                      padding: 20,
                      backgroundColor: "#000",
                      marginBottom: 10,
                    }}
                    key={index}
                    href={{
                      pathname: "/clientdetail",
                      params: { name: client.Name, id: client.id },
                    }}
                  >
                    {client.Name}
                  </Link>
                ))}
              </View>
            </ScrollView>
          )}
        </>
      )}

      {/* {clientData ? (
        
      ) : (
        <View>
        <Text style={{color:"#fff"}}>Loading data</Text>
        </View>
      )} */}
    </SafeAreaView>
  );
};

export default Home;
