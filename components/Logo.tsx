import { Colors } from "@/constants/Colors";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface LogoProps {
  size?: "small" | "medium" | "large";
  showText?: boolean;
  style?: any;
}

export const Logo: React.FC<LogoProps> = ({
  size = "medium",
  showText = true,
  style,
}) => {
  const logoSize = {
    small: 40,
    medium: 60,
    large: 80,
  }[size];

  const fontSize = {
    small: 16,
    medium: 24,
    large: 32,
  }[size];

  return (
    <View style={[styles.container, style]}>
      <Image
        source={require("@/assets/images/cosensus_logo.png")}
        style={[
          styles.logo,
          {
            width: logoSize,
            height: logoSize,
          },
        ]}
        resizeMode="contain"
      />
      {showText && <Text style={[styles.text, { fontSize }]}>CONSENSUS</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    marginBottom: 8,
  },
  text: {
    fontWeight: "600", // SemiBold equivalent
    color: Colors.brand.black,
    letterSpacing: 0.5,
  },
});
