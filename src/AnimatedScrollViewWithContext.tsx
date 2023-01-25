import React from "react";
import { LayoutChangeEvent, NativeScrollEvent } from "react-native";
import Animated, {
  MeasuredDimensions,
  measure,
  runOnUI,
  useAnimatedScrollHandler,
  useAnimatedRef,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

export type AnimatedScrollViewState = {
  scrollViewDimensions: MeasuredDimensions | undefined;
  scrollEvent: NativeScrollEvent | undefined;
};

export type LayoutState = LayoutChangeEvent["nativeEvent"]["layout"];

export const AnimatedScrollViewContext = React.createContext<
  Animated.SharedValue<AnimatedScrollViewState> | undefined
>(undefined);

export const AnimatedScrollViewWithContext: React.FC<
  Animated.ScrollView["props"]
> = (props) => {
  const ref = useAnimatedRef<Animated.ScrollView>();
  const scrollViewDimensions = useSharedValue<MeasuredDimensions | undefined>(
    undefined
  );
  const scrollEvent = useSharedValue<NativeScrollEvent | undefined>(undefined);

  const state = useDerivedValue<AnimatedScrollViewState>(() => {
    return {
      scrollViewDimensions: scrollViewDimensions.value,
      scrollEvent: scrollEvent.value,
    };
  });

  const onLayout = React.useRef((_: LayoutChangeEvent) => {
    runOnUI(() => {
      "worklet";
      scrollViewDimensions.value = measure(ref);
    })();
  });

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event: NativeScrollEvent) => {
      scrollEvent.value = event;
    },
  });

  return (
    <AnimatedScrollViewContext.Provider value={state}>
      <Animated.ScrollView
        {...props}
        ref={ref}
        onLayout={onLayout.current}
        onScroll={onScroll}
      />
    </AnimatedScrollViewContext.Provider>
  );
};
