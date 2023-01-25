import Animated, { interpolate } from "react-native-reanimated";

export const AnimatedScrollViewWithContext: React.FC<
  Animated.ScrollView["props"]
> = (props) => {
  return <Animated.ScrollView {...props}>{props.children}</Animated.ScrollView>;
};
