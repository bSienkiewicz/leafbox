"use client"
import React from 'react'
import Card from './Cards/Card'
import { faChevronLeft, faChevronRight, faRotateRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Error = ({err, action = "refresh"}) => {
  const reloadWindow = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }

  const back = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  }

  return (
    <Card cClass="text-center text-xl flex flex-col items-center">
      <p>{err}</p>
      <button className="px-2 py-1 bg-green-500 text-black text-sm rounded-full mt-3 flex gap-2 items-center " onClick={action == 'refresh' ? reloadWindow : back}>
        {action === "refresh" && (
          <>
            <FontAwesomeIcon icon={faRotateRight} className="animate-spin" />
            <span>Refresh</span>
          </>
        )}
        {action === "back" && (
          <>
            <FontAwesomeIcon icon={faChevronLeft} />
            <span>Go back</span>
          </>
        )}
      </button>
    </Card>
  )
}

export default Error