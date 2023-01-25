import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { interpolate, useAnimatedStyle } from "react-native-reanimated";
import { AnimatedScrollViewWithContext } from "./AnimatedScrollViewWithContext";

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
      style={{
        ...style.section,
        backgroundColor: color,
      }}
    >
      {data(props.count).map((item) => (
        <SlideUpOnScrollingIntoView key={item.id}>
          <Tile {...item} />
        </SlideUpOnScrollingIntoView>
      ))}
    </View>
  );
};

import React from "react";
import { LayoutChangeEvent } from "react-native";
import Animated, {
  useAnimatedRef,
  useSharedValue,
  runOnUI,
  measure,
  MeasuredDimensions,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { AnimatedScrollViewContext } from "./AnimatedScrollViewWithContext";

const SlideUpOnScrollingIntoView: React.FC<Animated.View["props"]> = (
  props
) => {
  const ref = useAnimatedRef<Animated.View>();

  const scrollViewState = React.useContext(AnimatedScrollViewContext);

  const dimensions = useSharedValue<MeasuredDimensions | undefined>(undefined);

  const onLayout = React.useRef((_: LayoutChangeEvent) => {
    runOnUI(() => {
      "worklet";
      dimensions.value = measure(ref);
    })();
  });

  const style = useAnimatedStyle(() => {
    const state = scrollViewState?.value;
    if (!state) return {};
    // console.log(
    //   "💛",
    //   _WORKLET,
    //   "SCROLL OFFSET",
    //   state.scrollEvent?.contentOffset.y ?? 0,
    //   "SCROLL DIMENSIONS",
    //   state.scrollViewDimensions,
    //   "TILE DIMENSIONS",
    //   dimensions.value
    // );

    const sd = state.scrollViewDimensions;
    const d = dimensions.value;
    if (!sd || !d) return {};
    // To do: consider scale factor and scroll orientation:
    const y = state.scrollEvent?.contentOffset.y ?? 0;
    const bottomY = sd.height + sd.pageY;
    const tileY = d.pageY - y;
    const didEnter = tileY < bottomY;
    const offsetY = sd.width / 2;
    return {
      transform: [
        {
          translateX: withSpring(didEnter ? 0 : offsetY),
        },
      ],
    };
  });

  return (
    <Animated.View
      {...props}
      ref={ref}
      onLayout={onLayout.current}
      style={style}
    />
  );
};

export const AnimatedScrollViewWithContextExample = () => {
  return (
    <SafeAreaView style={style.safeArea}>
      <AnimatedScrollViewWithContext scrollEventThrottle={16}>
        {Array(10)
          .fill(null)
          .map((_, i) => (
            <Section key={i} count={5} />
          ))}
      </AnimatedScrollViewWithContext>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  safeArea: {
    backgroundColor: "dodgerblue",
  },
  section: {
    paddingHorizontal: 20,
  },
  tile: {
    backgroundColor: "white",
    marginTop: 20,
    textAlign: "center",
    width: "100%",
  },
});
