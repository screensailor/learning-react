import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import Animated, { Easing, WithTimingConfig, interpolate, withSpring, withTiming } from "react-native-reanimated";
import { AnimatedScrollView, AnimatedScrollViewDescendant, CreateAnimatedStyle, didEnter } from "./AnimatedScrollView";

const data = (count: number = 100) =>
  Array(count)
    .fill(null)
    .map((_, i) => {
      return {
        value: Math.round(interpolate(Math.random(), [0, 1], [24, 84])),
        id: i,
      };
    });

const Tile = (props: Text["props"] & ReturnType<typeof data>[number]) => (
  <Text style={[style.tile, { fontSize: props.value }]}>{props.value}</Text>
);

const Section = (props: { count: number }) => {
  const color = `hsl(${Math.random() * 360}, 75%, 50%)`;
  return (
    <View
      style={[
        {
          backgroundColor: color,
        },
        style.section,
      ]}
    >
      {data(props.count).map((item) => (
        <SpinUp key={item.id}>
          <Tile {...item} />
        </SpinUp>
      ))}
    </View>
  );
};

export const AnimatedScrollViewWithContextExample = () => {
  return (
    <SafeAreaView style={style.safeArea}>
      <View style={{ padding: 0 }}>
        <AnimatedScrollView>
          {Array(10)
            .fill(null)
            .map((_, i) => (
              <Section key={i} count={5} />
            ))}
        </AnimatedScrollView>
      </View>
    </SafeAreaView>
  );
};

/*
    Animations
*/

const timingConfig: WithTimingConfig = {
  duration: 1000,
  easing: Easing.out(Easing.exp),
};

export const SlideUp: React.FC<Animated.View["props"]> = (props) => {
  const style = React.useRef<CreateAnimatedStyle>((event) => {
    "worklet";

    const offset = event.scrollViewLayout.width * 2;
    const entered = didEnter(event);

    return {
      opacity: withTiming(entered ? 1 : 0, { duration: 600 }),
      transform: [
        {
          translateY: withTiming(entered ? 0 : offset, timingConfig),
        },
      ],
    };
  }).current;

  return <AnimatedScrollViewDescendant {...props} animatedStyle={style} />;
};

export const SpinUp: React.FC<Animated.View["props"]> = (props) => {
  const style = React.useRef<CreateAnimatedStyle>((event) => {
    "worklet";

    const entered = didEnter(event);
    const offset = event.scrollViewLayout.width * 2;

    return {
      transform: [
        { perspective: 500 },
        {
          translateY: withTiming(entered ? 0 : offset, timingConfig),
        },
        {
          rotateX: withTiming(entered ? 0 : Math.PI * 2 * 5, timingConfig) as unknown as Adaptable<string>,
        },
        {
          scale: withTiming(entered ? 1 : 0.5, { duration: timingConfig.duration }),
        },
      ],
    };
  }).current;

  return <AnimatedScrollViewDescendant {...props} animatedStyle={style} />;
};

export const Springy: React.FC<Animated.View["props"]> = (props) => {
  const style = React.useRef<CreateAnimatedStyle>((event) => {
    "worklet";

    const entered = didEnter(event);

    return {
      transform: [
        {
          translateX: withSpring(entered ? 0 : event.scrollViewLayout.width),
        },
      ],
    };
  }).current;

  return <AnimatedScrollViewDescendant {...props} animatedStyle={style} />;
};

/*
    Static styles
*/

const style = StyleSheet.create({
  safeArea: {
    // backgroundColor: "dodgerblue",
  },
  section: {
    backgroundColor: "transparent",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  tile: {
    color: "white",
    backgroundColor: "dodgerblue",
    borderRadius: 10,
    marginTop: 20,
    overflow: "hidden",
    textAlign: "center",
    width: "100%",
  },
});
