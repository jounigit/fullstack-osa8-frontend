import React from 'react'

const Recommend = (props) => {

    if (!props.show) {
        return null
    }

    console.log('ME:: ', props.me )

    return (
        <div>
            <h2>recommendations</h2>
        </div>
    )  
}

export default Recommend