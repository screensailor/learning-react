import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { interpolate } from "react-native-reanimated";
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
        <Tile key={item.id} {...item} />
      ))}
    </View>
  );
};

export const AnimatedScrollViewWithContextExample = () => {
  return (
    <SafeAreaView style={style.safeArea}>
      <AnimatedScrollViewWithContext>
        <Section count={5} />
        <Section count={5} />
        <Section count={5} />
        <Section count={5} />
        <Section count={5} />
        <Section count={5} />
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