import React from 'react'

export default function() {
  return (
    <>
      <header className="container-fluid">
        <div style={{display:'inline-block', height:'40px'}}/>
        <h1 className="text-center">Welcome</h1>
      </header>
      <main className="container-fluid">
        <p className="flex-1 text-center">
          You currently have no classes, start by creating one by clicking the + in the
          top left corner.
        </p>
      </main>
    </>
  )
}