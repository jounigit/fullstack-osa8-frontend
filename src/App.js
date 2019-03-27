import React, { useState } from 'react'
import { useQuery, useMutation } from 'react-apollo-hooks'
// import { useApolloClient } from 'react-apollo-hooks'
import { gql } from 'apollo-boost'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'

const ALL_AUTHORS = gql`
{
  allAuthors  {
    name
    born
    bookCount
  }
}
`

const ALL_BOOKS = gql`
{
  allBooks {
    title
    author
    published
  }
}
`

const CREATE_BOOK = gql`
mutation createBook($title: String!, $author: String!, $published: String!, $genre: String) {
  addPerson(
    title: $title,
    author: $author,
    published: $published,
    genre: $genre
  ) {
    title
    author
    published
    genre
  }
}
`

const App = () => {
  const [page, setPage] = useState('authors')

  const resultAuthors = useQuery(ALL_AUTHORS)
  const resultBooks = useQuery(ALL_BOOKS)

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <Authors
        show={page === 'authors'}
        result = {resultAuthors}
      />

      <Books
        show={page === 'books'}
        result = {resultBooks}
      />

      <NewBook
        show={page === 'add'}
      />

    </div>
  )
}

export default App
