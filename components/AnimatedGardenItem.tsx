import { PropsWithChildren, useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet } from "react-native";
import { getHabitStatus, getLastCompletion } from "../features/habits/habit.logic";
import { Habit } from "../features/habits/habit.types";
import { GardenItem } from "./GardenItem";

type AnimatedGardenItemProps = {
  habit: Habit;
  onPress: () => void;
  index?: number;
};

export function AnimatedGardenItem({ habit, onPress, index = 0 }: AnimatedGardenItemProps) {
  const entrance = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const status = getHabitStatus(getLastCompletion(habit), habit.frequency);

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 260,
      delay: Math.min(index * 45, 220),
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    }).start();
  }, [entrance, index]);

  useEffect(() => {
    if (status !== "healthy") {
      pulse.stopAnimation();
      pulse.setValue(0);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true
        })
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [pulse, status]);

  const scale = Animated.add(
    entrance.interpolate({
      inputRange: [0, 1],
      outputRange: [0.94, 1]
    }),
    pulse.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.015]
    })
  );

  return (
    <AnimatedCard
      style={{
        opacity: entrance,
        transform: [
          {
            translateY: entrance.interpolate({
              inputRange: [0, 1],
              outputRange: [10, 0]
            })
          },
          { scale }
        ]
      }}
    >
      <GardenItem habit={habit} onPress={onPress} />
    </AnimatedCard>
  );
}

function AnimatedCard({ children, style }: PropsWithChildren<{ style: object }>) {
  return <Animated.View style={[styles.wrapper, style]}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  wrapper: {
    width: "48%"
  }
});
