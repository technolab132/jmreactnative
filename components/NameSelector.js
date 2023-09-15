import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";

const NameSelector = ({ names }) => {

  
  const router = useRouter();
  return (
    <View>
      <TouchableOpacity>
        <Text>{names}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NameSelector;

const styles = StyleSheet.create({});
