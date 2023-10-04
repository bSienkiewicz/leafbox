import React from 'react'

const Modal = ({onClose, children}) => {
  const modalRef = React.useRef(null);
  const handleClose = (e) => {
    e.preventDefault()
    onClose()
  }

  return (
    <div className='absolute top-0 left-0 w-full h-full bg-black/60 flex justify-end items-center' ref={modalRef}>
      <div className="w-96 h-full bg-white p-5 pt-16 overflow-auto">
        <button onClick={handleClose} className="fixed flex justify-center items-center rounded top-5 right-5 bg-red-500 text-white z-50 w-8 h-8">X</button>
        {children}
      </div>
    </div>
  )
}

export default Modal