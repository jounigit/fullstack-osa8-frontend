import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from 'react-apollo-hooks'
import { gql } from 'apollo-boost'
import { useApolloClient } from 'react-apollo-hooks'

import { Subscription } from 'react-apollo'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBookForm from './components/NewBookForm'
import AuthorForm from './components/AuthorForm'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'

const BOOK_DETAILS = gql`
fragment BookDetails on Book {
  id
  title
  published
  genres
}
`

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
    ...BookDetails
  }
}
${BOOK_DETAILS}
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
    ...BookDetails
  }
}
${BOOK_DETAILS}
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
const BOOK_ADDED = gql`
subscription {
  bookAdded {
    ...BookDetails
  }
}
${BOOK_DETAILS}
`

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const client = useApolloClient()

  useEffect(() => {
    setToken(localStorage.getItem('library-user-token', token))
  }, [])

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 2000)
  }

  const includedIn = (set, object) => 
  set.map(p => p.id).includes(object.id) 

  const resultAuthors = useQuery(ALL_AUTHORS)
  const resultAuthorsName = useQuery(ALL_AUTHORS_NAME)
  const resultBooks = useQuery(ALL_BOOKS)
  const resultMe = useQuery(ME)

  const login = useMutation(LOGIN)
  const addBook = useMutation(CREATE_BOOK, {
    update: (store, response) => {
      const dataInStore = store.readQuery({ query: ALL_BOOKS })
      const addedBook = response.data.addBook

      if (!includedIn(dataInStore.allBooks, addedBook)) {
        dataInStore.allBooks.push(addedBook)
        client.writeQuery({
          query: ALL_BOOKS,
          data: dataInStore
        })
      }
    }
  })

  const editAuthor = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  const errorNotification = () => errorMessage &&
  <div style={{ color: 'red' }}>
    {errorMessage}
  </div>

  return (
    <div>

      {errorNotification()}

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
        resBooks = {resultBooks}
        resMe = {resultMe}
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

      <Subscription
        subscription={BOOK_ADDED}
        onSubscriptionData={({subscriptionData}) => {
          console.log(subscriptionData)
          const addedBook = subscriptionData.data.bookAdded
          notify(`${addedBook.title} added to server`)
          // window.alert('You are adding a new book to the list')
        }}
      > 
        {() => null}
      </Subscription>

    </div>
  )
}

export default App
