import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import Animated, { interpolate, withSpring } from "react-native-reanimated";
import {
  AnimatedScrollViewWithContext,
  AnimatableScrollViewDescendant,
  CreateAnimatedStyle,
  didEnterFromBottom,
} from "./AnimatedScrollViewWithContext";

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
        <Springy key={item.id}>
          <Tile {...item} />
        </Springy>
      ))}
    </View>
  );
};

export const AnimatedScrollViewWithContextExample = () => {
  return (
    <SafeAreaView style={style.safeArea}>
      <View style={{ padding: 0 }}>
        <AnimatedScrollViewWithContext>
          {Array(10)
            .fill(null)
            .map((_, i) => (
              <Section key={i} count={5} />
            ))}
        </AnimatedScrollViewWithContext>
      </View>
    </SafeAreaView>
  );
};

/*
    Styles
*/

const Springy: React.FC<Animated.View["props"]> = (props) => {
  const style: CreateAnimatedStyle = (context) => {
    "worklet";
    const didEnter = didEnterFromBottom(context);
    return {
      transform: [
        {
          translateX: withSpring(didEnter ? 0 : 300),
        },
      ],
    };
  };

  return (
    <AnimatableScrollViewDescendant {...props} createAnimatedStyle={style} />
  );
};

const style = StyleSheet.create({
  safeArea: {
    backgroundColor: "dodgerblue",
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  tile: {
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 20,
    overflow: "hidden",
    textAlign: "center",
    width: "100%",
  },
});
