import React from "react";
import Animated, {
  measure,
  runOnUI,
  useAnimatedRef,
  useSharedValue,
} from "react-native-reanimated";

type LayoutMeasurment = {
  height: number;
  pageX: number;
  pageY: number;
  width: number;
  x: number;
  y: number;
};

// See: https://reactnative.dev/docs/scrollview#onscroll
type ScrollEvent = {
  nativeEvent: {
    contentInset: { bottom: number; left: number; right: number; top: number };
    contentOffset: { x: number; y: number };
    contentSize: { height: number; width: number };
    layoutMeasurement: { height: number; width: number };
    zoomScale: number;
  };
};

type LayoutEvent = {
  nativeEvent: {
    target: number;
    layout: { width: number; height: number; x: number; y: number };
  };
};

type ScrollState = ScrollEvent["nativeEvent"];
type LayoutState = LayoutEvent["nativeEvent"]["layout"];

export const AnimatedScrollViewWithContext: React.FC<
  Animated.ScrollView["props"]
> = (props) => {
  const ref = useAnimatedRef<Animated.ScrollView>();
  const layoutMeasurement = useSharedValue<LayoutMeasurment | null>(null);

  const onLayout = React.useRef((e: any) => {
    runOnUI((ref) => {
      "worklet";
      const m = measure(ref);
      layoutMeasurement.value = m;
    })(ref);
  });

  return (
    <Animated.ScrollView
      {...props}
      ref={ref}
      onLayout={onLayout.current}
    ></Animated.ScrollView>
  );
};
