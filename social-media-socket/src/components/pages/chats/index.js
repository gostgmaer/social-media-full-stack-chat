import React from 'react'
import { LeftContainer, RightContainer } from './elements'

const Index = () => {
    return (
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-start justify-start gap-5 mt-5 mb-5'>
            <div className='w-[30%] min-h-[calc(100vh-64px)] p-5 border-gray-300 border shadow-md bg-gray-600 text-white rounded-md'><LeftContainer/></div>
            <div className='w-[70%] min-h-[calc(100vh-64px)]  border-gray-300 border shadow-md bg-gray-600 text-white rounded-md'><RightContainer/></div>
        </div>
    )
}

export default Index