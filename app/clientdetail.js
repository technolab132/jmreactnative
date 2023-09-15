// ClientDetailsScreen.js

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../lib/supabase";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";

const ClientDetailsScreen = () => {
  const params = useLocalSearchParams();
  // console.log(params);
  const [activeTab, setActiveTab] = useState("sent");

  const selectedName = params.id;
  // console.log(selectedName);
  const [clientDetails, setClientDetails] = useState();
  const [sentEmails, setSentEmails] = useState();
  const [receivedEmails, setReceivedEmails] = useState();
  const [loading, setLoading] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    async function fetchClientDetails() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("Clients")
          .select("*")
          .eq("id", selectedName);

        if (data) {
          setClientDetails(data);

          // Check if clientDetails is defined before accessing it
          if (data[0] && data[0]["Email"]) {
            const { data: SentEmails, error: semailError } = await supabase
              .from("EmailData")
              .select("*")
              .eq("TO", data[0]["Email"]);

            if (SentEmails) {
              setSentEmails(SentEmails);
            }

            const { data: ReceivedEmails, error: remailError } = await supabase
              .from("EmailData")
              .select("*")
              .eq("FROM", data[0]["Email"]);

            if (ReceivedEmails) {
              setReceivedEmails(ReceivedEmails);
            }
          }
        } else {
          console.error("Error fetching client details:", error);
        }
      } catch (error) {
        console.error("Error fetching client details:", error);
      }
    }

    fetchClientDetails();
    setLoading(false);
  }, [selectedName]);

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
        {clientDetails ? (
          <Stack.Screen
            options={{
              headerStyle: { backgroundColor: "#000" },
              headerStatusBarHeight: StatusBar.currentHeight,
              headerTintColor: "#fff",
              headerShadowVisible: false,
              headerTitle: clientDetails[0].Name,
              headerTitleStyle: { color: "#fff", fontSize: 16 },
              headerTitleAlign: "center",
            }}
          />
        ) : (
          <Stack.Screen
            options={{
              headerStyle: { backgroundColor: "#000" },
              headerStatusBarHeight: StatusBar.currentHeight,
              headerTintColor: "#fff",
              headerShadowVisible: false,
              headerTitle: "Fetching . . ",
              headerTitleStyle: { color: "#fff", fontSize: 16 },
              headerTitleAlign: "center",
            }}
          />
        )}

        <ScrollView style={{ backgroundColor: "#0d0d0d" }}>
          {clientDetails ? (
            <View style={{ padding: 15 }}>
              <Text style={styles.text}>
                <Text style={{ color: "#fff", fontWeight: 800 }}>Name:</Text>{" "}
                {clientDetails[0]?.Name || "-----"}
              </Text>
              <Text style={styles.text}>
                <Text style={{ color: "#fff", fontWeight: 800 }}>
                  Company Name:
                </Text>{" "}
                {clientDetails[0]?.CompanyName || "-----"}
              </Text>
              <Text style={styles.text}>
                <Text style={{ color: "#fff", fontWeight: 800 }}>Email:</Text>{" "}
                {clientDetails[0]?.Email || "-----"}
              </Text>
              <Text style={styles.text}>
                <Text style={{ color: "#fff", fontWeight: 800 }}>Phone:</Text>{" "}
                {clientDetails[0]?.Phone || "-----"}
              </Text>

              {sentEmails ? (
                <>
                  <Text style={styles.text}>
                    <Text style={{ color: "#fff", fontWeight: 800 }}>
                      Email Sent:
                    </Text>{" "}
                    {loading ? (
                      <Text style={{color:"#fff"}}>Fetching . . . </Text>
                    ) : (
                      <>{sentEmails?.length}</>
                    )}
                  </Text>
                  <Text style={styles.text}>
                    <Text style={{ color: "#fff", fontWeight: 800 }}>
                    Email Received:
                    </Text>{" "}
                    {loading ? (
                      <Text>Fetching . . . </Text>
                    ) : (
                      <>{receivedEmails?.length}</>
                    )}
                  </Text>
                  <Text style={styles.text}>
                    <Text style={{ color: "#fff", fontWeight: 800 }}>
                    Total Email:
                    </Text>{" "}
                    {loading ? (
                      <Text>Fetching . . . </Text>
                    ) : (
                      <>{sentEmails?.length + receivedEmails?.length}</>
                    )}
                  </Text>
                  <Text style={styles.text}>
                    <Text style={{ color: "#fff", fontWeight: 800 }}>
                    Date of First Email Sent:
                    </Text>{" "}
                    {loading ? (
                      <Text>Fetching . . . </Text>
                    ) : (
                      <>{sentEmails[0]?.SENT}</>
                    )}
                  </Text>
                  <Text style={styles.text}>
                    <Text style={{ color: "#fff", fontWeight: 800 }}>
                    Date of Last Email Sent:
                    </Text>{" "}
                    {loading ? (
                      <Text style={{color:"#fff"}}>Fetching . . . </Text>
                    ) : (
                      <>{sentEmails[sentEmails.length - 1]?.SENT}</>
                    )}
                  </Text>
                </>
              ) : (
                <Text>Loading . . </Text>
              )}

              
              {/* Display other client details here */}
            </View>
          ) : (
            <View style={{ padding: 15 }}>
              <Text style={{ color: "#fff" }}>Loading client details...</Text>
            </View>
          )}

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              marginBottom: 10,
            }}
          >
            {sentEmails && (
              <TouchableOpacity
                style={
                  activeTab === "sent"
                    ? styles.activeTabStyle
                    : styles.inactiveTabStyle
                }
                onPress={() => handleTabChange("sent")}
              >
                <Text style={{ color: "#ffffff" }}>Sent Emails</Text>
              </TouchableOpacity>
            )}

            {receivedEmails && (
              <TouchableOpacity
                style={
                  activeTab === "received"
                    ? styles.activeTabStyle
                    : styles.inactiveTabStyle
                }
                onPress={() => handleTabChange("received")}
              >
                <Text style={{ color: "#ffffff" }}>Received Emails</Text>
              </TouchableOpacity>
            )}
          </View>

          {activeTab === "sent" && (
            <>
              {sentEmails?.map((email, index) => (
                <View
                  key={index}
                  style={{
                    borderBottomWidth: 2,
                    padding: 15,
                    backgroundColor: "#141414",
                    marginBottom: 10,
                  }}
                >
                  <Text style={styles.textmail}>From: {email["FROM"]}</Text>
                  <Text style={styles.textmail}>To: {email["TO"]}</Text>
                  <Text style={styles.textmail}>
                    Subject: {email["SUBJECT"]}
                  </Text>
                  <Text style={styles.textmail}>Sent: {email["SENT"]}</Text>
                  <Text style={styles.textmail}>
                    Received: {email["RECEIVED"]}
                  </Text>
                  <Text style={styles.textmail}>
                    Pdf Link:{" "}
                    <Link
                      style={{
                        textDecorationLine: "underline",
                        color: "#0080ff",
                      }}
                      href={email["PDFLINK"]}
                    >
                      View PDF
                    </Link>
                  </Text>
                  <Text style={styles.textmail}>
                    Complaints: {email["Complaints"]}
                  </Text>

                  {/* Display other client details here */}
                </View>
              ))}
            </>
          )}

          {activeTab === "received" && (
            <>
              {receivedEmails?.map((email, index) => (
                <View
                  key={index}
                  style={{
                    borderBottomWidth: 2,
                    padding: 15,
                    backgroundColor: "#141414",
                    marginBottom: 10,
                  }}
                >
                  <Text style={styles.textmail}>From: {email["FROM"]}</Text>
                  <Text style={styles.textmail}>To: {email["TO"]}</Text>
                  <Text style={styles.textmail}>
                    Subject: {email["SUBJECT"]}
                  </Text>
                  <Text style={styles.textmail}>Sent: {email["SENT"]}</Text>
                  <Text style={styles.textmail}>
                    Received: {email["RECEIVED"]}
                  </Text>
                  <Text style={styles.textmail}>
                    Pdf Link:{" "}
                    <Link
                      style={{
                        textDecorationLine: "underline",
                        color: "#0080ff",
                      }}
                      href={email["PDFLINK"]}
                    >
                      View PDF
                    </Link>
                  </Text>
                  <Text style={styles.textmail}>
                    Complaints: {email["Complaints"]}
                  </Text>

                  {/* Display other client details here */}
                </View>
              ))}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    color: "#d6d6d6",
    fontSize: 16,
    paddingVertical: 6,
  },
  textmail: {
    color: "#d6d6d6",
    fontSize: 15,
    paddingVertical: 3,
  },
  activeTabStyle: {
    padding: 15,
    backgroundColor: "#7d7d7d",
    marginRight: 10,
  },
  inactiveTabStyle: {
    padding: 15,
    backgroundColor: "#141414",
    marginRight: 10,
  },
});

export default ClientDetailsScreen;
