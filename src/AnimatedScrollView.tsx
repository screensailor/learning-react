/*
    To do:
    - Improve testability - probably by implementing a more powerful mock of UI thread methods.
    - Consider scale factor and scroll orientation when calculating didEnter.
    - Make it unnecessary for the user to declare 'worklet' in the animatedStyle callback function.
    - Add animatedProps for completeness.
    - Consider whether we shoudl call animatedStyle before dimensions are measured.
*/
import React from "react";
import { LayoutChangeEvent, LayoutRectangle, NativeScrollEvent, ViewStyle } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

export type AnimatedScrollViewState = Partial<{
  tag: number;
  scrollEvent: NativeScrollEvent;
  scrollViewLayout: LayoutRectangle;
}>;

export const AnimatedScrollViewContext = React.createContext<Animated.SharedValue<AnimatedScrollViewState>>({
  value: {},
});

interface CallableRef<T> extends React.RefObject<T> {
  (): number;
}

export const AnimatedScrollView: React.FC<Animated.ScrollView["props"]> = (props) => {
  const ref = useAnimatedRef() as CallableRef<Animated.ScrollView>;
  const scrollEvent = useSharedValue<NativeScrollEvent | undefined>(undefined);
  const scrollViewLayout = useSharedValue<LayoutRectangle | undefined>(undefined);

  const state = useDerivedValue<AnimatedScrollViewState>(() => {
    const o = ref();
    return {
      tag: o > -1 ? o : undefined,
      scrollEvent: scrollEvent.value,
      scrollViewLayout: scrollViewLayout.value,
    };
  });

  const onLayout = React.useRef((event: LayoutChangeEvent) => {
    scrollViewLayout.value = event.nativeEvent.layout;
  }).current;

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
        onLayout={onLayout}
        onScroll={onScroll}
        scrollEventThrottle={props.scrollEventThrottle ?? 16}
      />
    </AnimatedScrollViewContext.Provider>
  );
};

/*
    AnimatedableScrollViewDescendant
*/

export const didEnter = (e: AnimatedScrollViewDescendantEvent): boolean => {
  "worklet";
  const offset = e.scrollEvent?.contentOffset.y ?? 0;
  const bottomY = e.scrollViewLayout?.height;
  const tileY = e.ownLayout.y - offset;
  return tileY < bottomY;
};

export type AnimatedScrollViewDescendantEvent = {
  scrollEvent: NativeScrollEvent | undefined;
  scrollViewLayout: LayoutRectangle;
  ownLayout: LayoutRectangle;
};

export type CreateAnimatedStyle = (context: AnimatedScrollViewDescendantEvent) => Animated.AnimateStyle<ViewStyle>;

export type AnimatedScrollViewDescendantProps = Animated.View["props"] & {
  animatedStyle: CreateAnimatedStyle;
};

export const AnimatedScrollViewDescendant: React.FC<AnimatedScrollViewDescendantProps> = ({
  animatedStyle,
  style,
  ...props
}) => {
  const ref = useAnimatedRef() as CallableRef<Animated.View>;
  const scrollViewState = React.useContext(AnimatedScrollViewContext);
  const ownLayout = useSharedValue<LayoutRectangle | null>(null);
  const layout = useSharedValue<LayoutRectangle | undefined>(undefined);

  const tag = useDerivedValue<number | undefined>(() => {
    const o = ref();
    return o > -1 ? o : undefined;
  });

  const scrollViewTag = useDerivedValue<number | undefined>(() => {
    return scrollViewState?.value?.tag;
  });

  const measure = (scrollView: number, rectangle: LayoutRectangle) => {
    ref.current?.measureLayout(
      scrollView,
      (x: number, y: number) => {
        ownLayout.value = { ...rectangle, x: x, y: y };
      },
      () => {
        console.log("🚨 AnimatedScrollViewDescendant: measureLayout failed");
      }
    );
  };

  useDerivedValue(() => {
    if (!tag.value || !scrollViewTag.value || !layout.value) {
      return;
    }
    runOnJS(measure)(scrollViewTag.value, layout.value);
  });

  const onLayout = React.useRef((event: LayoutChangeEvent) => {
    layout.value = event.nativeEvent.layout;
  }).current;

  const reanimated = useAnimatedStyle(() => {
    const o = scrollViewState.value;
    if (!o.scrollViewLayout || !ownLayout.value) {
      return {}; // TODO: Consider if we should call animatedStyle with undefined sd and od
    }
    return animatedStyle({
      scrollEvent: o.scrollEvent,
      scrollViewLayout: o.scrollViewLayout,
      ownLayout: ownLayout.value,
    });
  });

  return <Animated.View {...props} ref={ref} onLayout={onLayout} style={[style, reanimated]} />;
};
