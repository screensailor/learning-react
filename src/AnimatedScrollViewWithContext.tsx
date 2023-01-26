/*
    To do:
    - Consider scale factor and scroll orientation when calculating didEnterFromBottom
    - Make it unnecessary for the user to declare 'worklet' in the createAnimatedStyle function
    - Namespace the types - e.g. Animated.ScrollViewWithContext
    - Add createAnimatedProps
*/
import React from "react";
import { LayoutChangeEvent, NativeScrollEvent, ViewStyle } from "react-native";
import Animated, {
  MeasuredDimensions,
  measure,
  runOnUI,
  useAnimatedScrollHandler,
  useAnimatedRef,
  useAnimatedStyle,
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
        scrollEventThrottle={props.scrollEventThrottle ?? 16}
        onLayout={onLayout.current}
        onScroll={onScroll}
      />
    </AnimatedScrollViewContext.Provider>
  );
};

/*
    AnimatedableScrollViewDescendant
*/

export const didEnterFromBottom: (
  context: AnimatedScrollViewDescendantContext
) => boolean = ({ scrollEvent, scrollViewDimensions, ownDimensions }) => {
  "worklet";
  const y = scrollEvent?.contentOffset.y ?? 0;
  const bottomY = scrollViewDimensions.height + scrollViewDimensions.pageY;
  const tileY = ownDimensions.pageY - y;
  return tileY < bottomY;
};

export type AnimatedScrollViewDescendantContext = {
  scrollEvent: NativeScrollEvent | undefined;
  scrollViewDimensions: MeasuredDimensions;
  ownDimensions: MeasuredDimensions;
};

export type CreateAnimatedStyle = (
  context: AnimatedScrollViewDescendantContext
) => Animated.AnimateStyle<ViewStyle>;

export type AnimatableScrollViewDescendantProps = Animated.View["props"] & {
  createAnimatedStyle: CreateAnimatedStyle;
};

export const AnimatableScrollViewDescendant: React.FC<
  AnimatableScrollViewDescendantProps
> = (props) => {
  const ref = useAnimatedRef<Animated.View>();
  const scrollViewState = React.useContext(AnimatedScrollViewContext);
  const ownDimensions = useSharedValue<MeasuredDimensions | undefined>(
    undefined
  );

  const onLayout = React.useRef((_: LayoutChangeEvent) => {
    runOnUI(() => {
      "worklet";
      ownDimensions.value = measure(ref);
    })();
  });

  const style = useAnimatedStyle(() => {
    const state = scrollViewState?.value;
    const sd = state?.scrollViewDimensions;
    const od = ownDimensions.value;
    if (!sd || !od) return {};
    return props.createAnimatedStyle({
      scrollEvent: state.scrollEvent,
      scrollViewDimensions: sd,
      ownDimensions: od,
    });
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
