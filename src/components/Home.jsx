import React from 'react'
import List from './List'
const Home = () => {
    return (
        <>
            <div className='border-b-8 rounded-3xl border-2 border-amber-900 shadow-lg p-8 mx-4'>
                <h1 className='text-2xl md:text-4xl text-rose-950 font-bold text-center mb-4'>
                    Image Processing
                </h1>
                <h2 className='text-md md:text-xl text-amber-900 text-center'>
                    This is a simple React application for applying image processing algorithms
                </h2>
            </div>
            <h3 className='text-xl md:text-2xl font-semibold text-center text-amber-900 my-4 md:my-8'>Please choose the algorithm you want to apply</h3>
            <List />
        </>
    )
}

export default Home