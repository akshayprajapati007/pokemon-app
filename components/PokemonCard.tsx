import { useState, useEffect } from "react"
import axios, { AxiosResponse, CancelToken } from "axios"
import { StyleSheet, Text, View, Image, ActivityIndicator } from "react-native"
import { IPokemonListDetails } from "../utility/interfaces/pokemon"
import { capitalizeFirstCharacter } from "../utility/helper"

interface IPokemonType {
  slot: number
  type: {
    name: string
    url: string
  }
}

interface IPokemonDetails {
  abilities: any[]
  base_experience: number
  forms: any[]
  game_indices: any[]
  height: number
  held_items: any[]
  id: number
  is_default: boolean
  location_area_encounters: string
  moves: any[]
  name: string
  order: number
  species: {
    name: string
    url: string
  }
  sprites: {
    back_default: string
    front_default: string
    front_shiny: string
  }
  stats: any[]
  types: IPokemonType[]
  weight: number
}

const PokemonCard = ({ name, url }: IPokemonListDetails) => {
  const [isLoading, setIsLoading] = useState(false)
  const [pokemonDetails, setPokemonDetails] = useState<IPokemonDetails | null>(
    null
  )

  const getPokemonDetails = async (cancelToken: CancelToken) => {
    setIsLoading(true)
    const options = {
      cancelToken,
    }

    try {
      const response: AxiosResponse<IPokemonDetails> = await axios.get(
        url,
        options
      )
      if (response.data) {
        setPokemonDetails(response.data)
      } else {
        setPokemonDetails(null)
        console.log("Something went wrong")
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const cancelToken = axios.CancelToken.source()
    getPokemonDetails(cancelToken.token)

    return () => {
      cancelToken.cancel()
    }
  }, [url])

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{capitalizeFirstCharacter(name)}</Text>
      {isLoading ? (
        <ActivityIndicator
          color="#20a258"
          size={30}
          animating={isLoading}
          style={styles.loader}
        />
      ) : (
        pokemonDetails && (
          <>
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: pokemonDetails.sprites.front_default,
                }}
                height={280}
                width={280}
              />
            </View>
            <Text style={styles.infoText}>
              Type:{" "}
              {pokemonDetails.types
                .map((type: IPokemonType) =>
                  capitalizeFirstCharacter(type.type.name)
                )
                .join(", ")}
            </Text>
            <View style={styles.characteristicWrapper}>
              <Text style={styles.infoText}>
                Height: {pokemonDetails.height},
              </Text>
              <Text style={styles.infoText}>
                Weight: {pokemonDetails.weight}
              </Text>
            </View>
          </>
        )
      )}
    </View>
  )
}

export default PokemonCard

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#d1d1d1",
    padding: 10,
    minHeight: 400,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
  },
  characteristicWrapper: {
    flexDirection: "row",
    gap: 5,
    justifyContent: "flex-start",
  },
})
