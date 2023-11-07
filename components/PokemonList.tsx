import { useState, useEffect } from "react"
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
} from "react-native"
import axios, { AxiosResponse, CancelToken } from "axios"
import PokemonCard from "./PokemonCard"
import { POKEMON_LIST_API_ENDPOINT } from "../configs"
import { IPokemonListDetails } from "../utility/interfaces/pokemon"
import CustomPagination from "./CustomPagination"

interface IPokemonListResponse {
  count: number
  results: IPokemonListDetails[]
}

const SeparatorComponent = () => <View style={{ height: 16 }} />

const PokemonList = () => {
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(0)
  const [pokemonList, setPokemonList] = useState<IPokemonListDetails[]>([])

  const cancelToken = axios.CancelToken.source()

  const getPokemonList = async () => {
    setIsLoading(true)
    const options = {
      cancelToken: cancelToken.token,
      params: {
        offset: (page - 1) * 5,
        limit: 5,
      },
    }

    try {
      const response: AxiosResponse<IPokemonListResponse> = await axios.get(
        POKEMON_LIST_API_ENDPOINT,
        options
      )
      if (response.data && response.data.results.length > 0) {
        setTotalPages(Math.ceil(response.data.count / 5))
        setPokemonList(response.data.results)
      } else {
        console.log("Something went wrong")
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getPokemonList()

    return () => {
      cancelToken.cancel()
    }
  }, [page])

  const handlePagination = (page: number) => {
    setPage(page)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Pokemon list</Text>
      {isLoading ? (
        <ActivityIndicator
          color="#20a258"
          size={30}
          animating={isLoading}
          style={styles.loader}
        />
      ) : (
        <View style={styles.listContainer}>
          <FlatList
            style={styles.flatListContainer}
            data={pokemonList}
            renderItem={({ item }: any) => {
              const { name, url } = item
              return <PokemonCard key={name} name={name} url={url} />
            }}
            keyExtractor={(item: IPokemonListDetails) => item.name}
            ItemSeparatorComponent={SeparatorComponent}
            refreshing={isLoading}
            onRefresh={getPokemonList}
          />
        </View>
      )}
      {totalPages > 0 && (
        <View style={styles.paginationContainer}>
          <CustomPagination
            isDisabled={isLoading}
            totalPages={totalPages}
            currenPage={page}
            onPageChange={handlePagination}
          />
        </View>
      )}
    </View>
  )
}

export default PokemonList

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderBottomColor: "#eee",
    color: "#20a258",
  },
  listContainer: {
    flex: 1,
    marginVertical: 10,
  },
  flatListContainer: {
    paddingHorizontal: 10,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 2,
    borderTopColor: "#eee",
  },
})
