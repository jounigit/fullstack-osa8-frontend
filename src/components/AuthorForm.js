import React, { useState } from 'react'

const AuthorForm = (props) => {
  const [setBornTo, setBorn] = useState('')
  const [selectedOption, setSelectedOption] = useState('')

  if (!props.show) {
    return null
  }

  const names = props.names.data.allAuthors

  const submit = async (e) => {
    e.preventDefault()

    let name = selectedOption
    await props.editAuthor({
      variables: { name, setBornTo }
    })

    setSelectedOption('')
    setBorn('')
  }

 console.log(`Option selected:`, selectedOption)

  if (names) {
    return (
      <div>

        <h2>edit author</h2>
      
        <form onSubmit={submit}>
          <div>          
              name
              <select 
                value={selectedOption}
                onChange={({ target }) => setSelectedOption(target.value)}
              >
                {names.map(a => 
                  <option key={a.name} value={a.name}>{a.name}</option>
                )}
              </select>
            
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
  return (
  <div>
    <p>loading... </p>
  </div>
)
}



export default AuthorForm
