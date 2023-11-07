import { StyleSheet, SafeAreaView, StatusBar } from "react-native"
import PokemonList from "./components/PokemonList"

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <PokemonList />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: StatusBar.currentHeight,
  },
})
