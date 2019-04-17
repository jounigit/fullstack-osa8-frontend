import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from 'react-apollo-hooks'
import { useApolloClient } from 'react-apollo-hooks'
import { gql } from 'apollo-boost'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBookForm from './components/NewBookForm'
import AuthorForm from './components/AuthorForm'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'

const ALL_AUTHORS = gql`
{
  allAuthors  {
    name
    born
    bookCount
    id
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
const FIND_AUTHOR = gql`
query findAuthor( $name: String!){
findAuthor( name: $name) {
    name
    born
    id
    bookCount
  }
}
`

const ALL_BOOKS = gql`
{
  allBooks {
    title
    published
    genres
  }
}
`
const ME = gql`
{
  me {
    favoriteGenre
  }
}
`

const CREATE_BOOK = gql`
mutation addBook(
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
const LOGIN = gql`
mutation login($username: String!, $password: String!) {
  login(username: $username, password: $password)  {
    value
  }
}
`

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)

  const client = useApolloClient()

  useEffect(() => {
    setToken(localStorage.getItem('library-user-token', token))
  }, [])

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const resultAuthors = useQuery(ALL_AUTHORS)
  const resultAuthorsName = useQuery(ALL_AUTHORS_NAME)
  const resultBooks = useQuery(ALL_BOOKS)
  const resultMe = useQuery(ME)

  const login = useMutation(LOGIN)
  const addBook = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }]
  })
  const editAuthor = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ? 
          <span>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('edit')}>edit author</button>
            <button onClick={() => setPage('recommend')}>recommend</button>
            <button onClick={logout}>logout</button>
          </span>
           : 
          <button onClick={() => setPage('login')}>login</button>
        }
        
      </div>

      <Authors
        show={page === 'authors'}
        result = {resultAuthors}
      />

      <Books
        show={page === 'books'}
        result = {resultBooks}
      />

      <Recommend
        show={page === 'recommend'}
        books = {resultBooks}
        me = {resultMe}
      />

      <NewBookForm
        show={page === 'add'}
        addBook = {addBook}
      />

      <LoginForm 
        show={page === 'login'}
        login={login}
        setToken={(token) => setToken(token)}
      />
      
      <AuthorForm 
        show={page === 'edit'}
        editAuthor = {editAuthor}
        names = {resultAuthorsName}
        findAuthor = {FIND_AUTHOR}
       />

    </div>
  )
}

export default App
