import React from 'react'

const Navbar = () => {
  return (
    <nav className='flex px-6 py-4 justify-between items-center bg-emerald-950 border-b border-emerald-800'>
      <h1 className='text-emerald-50 text-2xl font-bold tracking-tight'>
        Repo Analyzer
      </h1>
      
      <a href="https://github.com/"
        target='_blank'
        rel='noreferrer'
        className='text-emerald-200 text-2xl hover:text-white transition'
        aria-label='View on GitHub'
      >
        <i className="fa-brands fa-github"></i>
      </a>
    </nav>
  )
}

export default Navbar