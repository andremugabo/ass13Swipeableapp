import React, { useState } from "react";
import { View, Animated, PanResponder } from "react-native";
import data from "./data";

const CardStack = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [position] = useState(new Animated.ValueXY());

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > 120) {
        // Swipe right
        Animated.spring(position, {
          toValue: { x: 500, y: gesture.dy },
          useNativeDriver: true,
        }).start(() => {
          setCurrentIndex(currentIndex + 1);
          position.setValue({ x: 0, y: 0 });
        });
      } else if (gesture.dx < -120) {
        // Swipe left
        Animated.spring(position, {
          toValue: { x: -500, y: gesture.dy },
          useNativeDriver: true,
        }).start(() => {
          setCurrentIndex(currentIndex + 1);
          position.setValue({ x: 0, y: 0 });
        });
      } else {
        // Return to initial position
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const cardStyle = {
    transform: [
      { translateX: position.x },
      { translateY: position.y },
      {
        rotate: position.x.interpolate({
          inputRange: [-200, 0, 200],
          outputRange: ["-30deg", "0deg", "30deg"],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      {data.map((card, index) => {
        if (index < currentIndex) {
          return null;
        }
        if (index === currentIndex) {
          return (
            <Animated.View
              key={index}
              {...panResponder.panHandlers}
              style={[styles.card, cardStyle]}
            >
              {/* Render the card content */}
            </Animated.View>
          );
        }
        return (
          <Animated.View
            key={index}
            style={[styles.card, styles.backgroundCard]}
          >
            {/* Render the card content */}
          </Animated.View>
        );
      })}
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: 300,
    height: 400,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundCard: {
    zIndex: -1,
    opacity: 0.5,
  },
};

export default CardStack;
