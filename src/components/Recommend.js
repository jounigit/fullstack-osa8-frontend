import React from 'react'

const Recommend = (props) => {

    if (!props.show) {
        return null
    }

    const books = props.resBooks.data.allBooks

    const genre = props.resMe.data.me.favoriteGenre

    const booksA = props.resBooks.data.allBooks.filter(b => b.genres.includes(genre))


    console.log('ME:: ', booksA )

    return (
        <div>
            <h2>recommendations</h2>

            <p>books in your favorite genre <b>{genre}</b></p>

            <table>
                <tbody>
                <tr>
                    <th></th>
                    <th>
                    published
                    </th>
                </tr>
                {booksA.map(a =>
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

export default Recommend