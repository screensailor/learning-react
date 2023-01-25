import React from "react";
import { LayoutChangeEvent } from "react-native";
import Animated, {
  MeasuredDimensions,
  measure,
  runOnUI,
  useAnimatedRef,
  useSharedValue,
} from "react-native-reanimated";

// See: https://reactnative.dev/docs/scrollview#onscroll
export type ScrollEvent = {
  nativeEvent: {
    contentInset: { bottom: number; left: number; right: number; top: number };
    contentOffset: { x: number; y: number };
    contentSize: { height: number; width: number };
    layoutMeasurement: { height: number; width: number };
    zoomScale: number;
  };
};

export type ScrollState = ScrollEvent["nativeEvent"];
export type LayoutState = LayoutChangeEvent["nativeEvent"]["layout"];

export const AnimatedScrollViewContext: React.Context<MeasuredDimensions | null> =
  React.createContext(null);

export const AnimatedScrollViewWithContext: React.FC<
  Animated.ScrollView["props"]
> = (props) => {
  const ref = useAnimatedRef<Animated.ScrollView>();
  const layoutMeasurement = useSharedValue<MeasuredDimensions | null>(null);

  const onLayout = React.useRef((_: LayoutChangeEvent) => {
    runOnUI((ref) => {
      "worklet";
      const m = measure(ref);
      layoutMeasurement.value = m;
      console.log("onLayout", m);
    })(ref);
  });

  return (
    <AnimatedScrollViewContext.Provider value={layoutMeasurement}>
      <Animated.ScrollView {...props} ref={ref} onLayout={onLayout.current} />
    </AnimatedScrollViewContext.Provider>
  );
};
