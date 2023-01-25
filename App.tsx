import { SafeAreaView, ScrollView, StyleSheet, Text } from "react-native";
import { interpolate } from "react-native-reanimated";
import { AnimatedScrollViewWithContext } from "./src/AnimatedScrollViewWithContext";

const data = Array(100)
  .fill(null)
  .map((_, i) => {
    return {
      value: Math.round(interpolate(Math.random(), [0, 1], [24, 84])),
      id: i,
    };
  });

const Tile = (props: Text["props"] & typeof data[number]) => (
  <Text style={[style.tile, { fontSize: props.value }]}>{props.value}</Text>
);

export default function App() {
  return (
    <SafeAreaView>
      <AnimatedScrollViewWithContext style={style.scrollView}>
        {data.map((item) => (
          <Tile key={item.id} {...item} />
        ))}
      </AnimatedScrollViewWithContext>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  scrollView: {
    padding: 20,
  },
  tile: {
    backgroundColor: "dodgerblue",
    color: "white",
    marginTop: 20,
    textAlign: "center",
    width: "100%",
  },
});
