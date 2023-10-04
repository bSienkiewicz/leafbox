import React from 'react'

const Error = ({err}) => {
  return (
    <div className='w-full h-full font-bold text-center'>An error occurred. <br/>Message: {err.message}</div>
  )
}

export default Error