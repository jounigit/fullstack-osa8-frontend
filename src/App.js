import React, { useState } from 'react'
import { useQuery, useMutation } from 'react-apollo-hooks'
// import { useApolloClient } from 'react-apollo-hooks'
import { gql } from 'apollo-boost'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBookForm from './components/NewBookForm'
import AuthorForm from './components/AuthorForm'

const ALL_AUTHORS = gql`
{
  allAuthors  {
    name
    born
    bookCount
  }
}
`
const ALL_AUTHORS_NAME = gql`
{
  allAuthors  {
    name
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
mutation createBook(
  $title: String!,
  $author: String!,
  $published: Int!,
  $genres: [String!]
) {
  addBook(
    title: $title,
    author: $author,
    published: $published,
    genres: $genres
  ) {
    title
    author
    published
    genres
  }
}
`

const EDIT_AUTHOR = gql`
mutation editAuthor($name: String!, $setBornTo: Int) {
  editAuthor(name: $name, setBornTo: $setBornTo) {
    name
    born
  }
}
`

const App = () => {
  const [page, setPage] = useState('authors')

  const resultAuthors = useQuery(ALL_AUTHORS)
  const resultAuthorsName = useQuery(ALL_AUTHORS_NAME)
  const resultBooks = useQuery(ALL_BOOKS)

  const addBook = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }]
  })
  const editAuthor = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  //console.log('Names: ', resultAuthorsName)

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

      <NewBookForm
        show={page === 'add'}
        addBook = {addBook}
      />

      <h2>edit author</h2>
      <AuthorForm 
        editAuthor = {editAuthor}
        names = {resultAuthorsName}
       />

    </div>
  )
}

export default App
