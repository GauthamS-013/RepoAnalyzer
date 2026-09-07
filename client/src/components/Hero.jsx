import React from 'react'

const Hero = () => {
  return (
    <section className='flex flex-col justify-center items-center text-center px-8 pt-20 text-emerald-950'>
      <h1 className='text-3xl md:text-5xl font-bold max-w-3xl'>
        Analyze any <span className='text-emerald-700'>GitHub repository</span>
      </h1>
      <p className='text-lg md:text-xl mt-7 md:mt-10 max-w-2xl text-emerald-900/70'>
        Get an AI-powered analysis of any GitHub repository — its strengths, its weaknesses, and what to fix next.
      </p>
    </section>
  )
}

export default Hero