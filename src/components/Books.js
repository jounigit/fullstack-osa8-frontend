import React, {useState} from 'react'
import { gql } from 'apollo-boost'
import { useApolloClient } from 'react-apollo-hooks'

const BOOKS_IN_GENRE = gql`
query booksInGenre($genreToSearch: String!) {
  allBooks(genre: $genreToSearch) {
    title
    published
    genres
  }
}
`

const Books = (props) => {
  const client = useApolloClient()

  const [genre, setGenre] = useState('')
  const [booksInGenre, setBookInGenre] = useState(null)

  if (!props.show) {
    return null
  }

  if (props.result.loading) {
    return <div>loading...</div> //
  }

  const show = async (genre) => {
    const { data } = await client.query({
      query: BOOKS_IN_GENRE,
      variables: { genreToSearch: genre }
    })
    console.log('Books In Genre:: ', data.allBooks)
    setBookInGenre(data.allBooks)
  }

  const books = props.result.data.allBooks

  const genres = Array.from(new Set(books.map(b => b.genres ).flat()))

  const showBooks = booksInGenre ? booksInGenre : books
  
  console.log('GENRES:: ', genres)
  console.log('BooksIn:: ', booksInGenre)

  if (genre) {
    show(genre)
  }

  return (
    <div>
      <h2>books</h2>

      {genre ? <p>in genre <b>{genre}</b></p> : ''}

      {genres.map(g => <span key={g}><button onClick={() => setGenre(g)}>{g}</button></span>)}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              published
            </th>
          </tr>
          {showBooks.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Books
