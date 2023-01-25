import { SafeAreaView, ScrollView, StyleSheet, Text } from "react-native";
import Animated, { interpolate } from "react-native-reanimated";

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
      <ScrollView style={style.scrollView}>
        {data.map((item) => (
          <Tile key={item.id} {...item} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  scrollView: {
    padding: 20,
  },
  tile: {
    backgroundColor: "dogerblue",
    color: "white",
    marginTop: 20,
    textAlign: "center",
    width: "100%",
  },
});
