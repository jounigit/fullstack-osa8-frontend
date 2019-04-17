import React, {useState} from 'react'

const Books = (props) => {
  const [genre, setGenre] = useState('')

  if (!props.show) {
    return null
  }

  if (props.result.loading) {
    return <div>loading...</div>
  }

  const books = props.result.data.allBooks

  const genres = Array.from(new Set(books.map(b => b.genres ).flat()))

  const booksInGenre = books.filter(b => b.genres.includes(genre))

  const showBooks = genre ? booksInGenre : books
  
  console.log('GENRES:: ', genres)
  console.log('BooksIn:: ', booksInGenre)

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
