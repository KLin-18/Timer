import React from "react";
import { View, StyleSheet } from "react-native";
import AnimatedProgressWheel from "react-native-progress-wheel";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ({ seconds }) => (

  <View style={[StyleSheet.absoluteFill, styles.container]}>
    <AnimatedProgressWheel
      style={styles.timerWidget}
      size={200}
      width={10}
      progress={100}
      backgroundColor="#07121B"
      color="#fee"
      animateFromValue={0}
      duration={seconds * 1000}
    />
  </View>
);