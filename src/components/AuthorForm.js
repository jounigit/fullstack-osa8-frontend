import React, { useState } from 'react'

const AuthorForm = (props) => {
  const [name, setName] = useState('')
  const [setBornTo, setBorn] = useState('')

  const submit = async (e) => {
    e.preventDefault()

    console.log('edit...', name, setBornTo)

    await props.editAuthor({
      variables: { name, setBornTo }
    })

    setName('')
    setBorn('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          name
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          born
          <input
            type='number'
            value={setBornTo}
            onChange={({ target }) => setBorn(parseInt(target.value))}
          />
        </div>

        <button type='submit'>edit born</button>
      </form>
    </div>
  )
}

export default AuthorForm
