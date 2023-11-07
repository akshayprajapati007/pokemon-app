import React, { useState } from "react"
import { View, Text, Pressable, StyleSheet } from "react-native"

interface PaginationProps {
  isDisabled?: boolean
  currenPage: number
  totalPages: number
  onPageChange: (pageNumber: number) => void
}

const CustomPagination: React.FC<PaginationProps> = ({
  isDisabled,
  currenPage,
  totalPages,
  onPageChange,
}) => {
  const [currentPage, setCurrentPage] = useState(currenPage)

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
      onPageChange(currentPage + 1)
    }
  }

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    onPageChange(pageNumber)
  }

  const getPageNumbers = () => {
    const pageNumbers: JSX.Element[] = []
    const itemPerPage: number = 5

    if (currentPage > itemPerPage / 2 && currentPage > 3) {
      pageNumbers.push(
        <Pressable
          key="first"
          disabled={isDisabled}
          onPress={() => handlePageClick(1)}
        >
          <Text style={styles.pageNumberText}>1</Text>
        </Pressable>
      )
      pageNumbers.push(<Text key="firstEllipsis">...</Text>)
    }

    for (let i = currentPage - 2; i <= currentPage + 2; i++) {
      if (i > 0 && i <= totalPages) {
        pageNumbers.push(
          <Pressable
            key={i}
            disabled={isDisabled}
            onPress={() => handlePageClick(i)}
          >
            <Text
              style={[
                styles.pageNumber,
                currentPage === i && styles.currentPage,
              ]}
            >
              {i}
            </Text>
          </Pressable>
        )
      }
    }

    if (currentPage <= totalPages - itemPerPage / 2) {
      pageNumbers.push(<Text key="lastEllipsis">...</Text>)
      pageNumbers.push(
        <Pressable
          key="last"
          disabled={isDisabled}
          onPress={() => handlePageClick(totalPages)}
        >
          <Text style={styles.pageNumberText}>{totalPages}</Text>
        </Pressable>
      )
    }

    return pageNumbers
  }

  return (
    <View style={styles.container}>
      <Pressable disabled={isDisabled} onPress={handlePrevious}>
        <Text style={styles.navigationButton}>{"<"}</Text>
      </Pressable>

      {getPageNumbers()}

      <Pressable disabled={isDisabled} onPress={handleNext}>
        <Text style={styles.navigationButton}>{">"}</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  pageNumber: {
    height: 35,
    width: 35,
    textAlign: "center",
    verticalAlign: "middle",
    fontSize: 14,
  },
  currentPage: {
    backgroundColor: "#20a258",
    borderRadius: 50,
    color: "#fff",
  },
  pageNumberText: {
    fontSize: 14,
  },
  navigationButton: {
    fontSize: 20,
    padding: 10,
  },
  pageNumbersContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
})

export default CustomPagination
