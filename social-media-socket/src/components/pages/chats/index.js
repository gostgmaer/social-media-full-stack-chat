import React from 'react'
import { LeftContainer, RightContainer } from './elements'

const Index = () => {
    const messages = [
        { sender: 'Alice', text: 'Hi there!' },
        { sender: 'Alice', text: 'Hi there!' },
        { sender: 'Alice', text: 'Hi there!' },
        { sender: 'Bob', text: 'Hello!' },
        { sender: 'Alice', text: 'How are you?' },
        { sender: 'Bob', text: 'I\'m doing well, thanks!' },
        { sender: 'Alice', text: 'What are you up to today?' },
        { sender: 'Bob', text: 'Just working on some projects. How about you?' },
        { sender: 'Alice', text: 'Same here. Busy day ahead!' },
        { sender: 'Bob', text: 'Sounds like it! Anything exciting?' },
        { sender: 'Alice', text: 'Just the usual deadlines to meet.' },
        { sender: 'Bob', text: 'I know the feeling. Hang in there!' },
        { sender: 'Alice', text: 'Thanks, will do!' },
        { sender: 'Bob', text: 'By the way, did you see the new movie trailer?' },
        { sender: 'Alice', text: 'No, not yet. Is it good?' },
        { sender: 'Bob', text: 'Looks promising. We should watch it together sometime!' },
        { sender: 'Alice', text: 'Definitely! Let me know when you re free.' },
        // Add more messages here
      ];
    return (
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-start justify-start gap-5 mt-5 mb-5'>
            <div className='w-[30%] min-h-[calc(100vh-64px)]  p-5 border-gray-300 border shadow-md bg-gray-600 text-white rounded-md'><LeftContainer/></div>
            <div className='w-[70%] min-h-[calc(100vh-64px)]  border-gray-300 border shadow-md bg-gray-600 text-white rounded-md'><RightContainer messages={messages}/></div>
        </div>
    )
}

export default Index