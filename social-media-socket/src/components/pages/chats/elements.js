"use client"
import SearchField from "@/components/global/fields/SearchFields";
import Input from "@/components/global/fields/input";
import { useSession } from "next-auth/react";
import Image from "next/image";

export const ChatItem = () => {
    return (
        <div className=" bg-gray-100 px-5 py-2 w-full grid  gap-3 sm:grid-cols-2 col-span-full cursor-pointer hover:bg-gray-50">
            <div className="col-span-full flex items-center justify-start gap-2 ">
                <Image
                    alt="Isomorphic"
                    loading="lazy"
                    height={50}
                    width={50}
                    decoding="async"
                    data-nimg="1"
                    className=" h-12 w-12 rounded-full"
                    src="https://isomorphic-furyroad.vercel.app/_next/static/media/logo-short.18ca02a8.svg"
                />
                <div>
                    <h4 className=" text-lg">User Name</h4>
                    <p className=" text-sm">Message</p>
                </div>
            </div>
        </div>
    );
};

export const LeftContainer = (second) => {
    return (
        <div className="grid  gap-3 sm:grid-cols-2 col-span-full mb-5  ">
            <div className="col-span-full text-black ">
                <SearchField />
            </div>
            <div className="col-span-full mt-4 flex flex-col gap-2 text-black ">
                <h3 className=" text-2xl font-semibold text-white mb-4"> My Chats</h3>
                <div className="max-h-[calc(100vh-160px)] overflow-auto rounded-lg ">
                    {Array.from(Array(10).keys()).map(item => (
                        <ChatItem key={item} />
                    ))}
                </div>
            </div>
            <div className="col-span-full  ">

            </div>
        </div>
    );
};



export const MessageList = (second) => {

    return <div>

    </div>

}

export const RightContainer = (props) => {

    const { data: session, status } = useSession()
    console.log(session, status);
    return (
        <div className="grid  gap-3 sm:grid-cols-2 col-span-full  rounded-lg flex-col justify-between min-h-[calc(100vh-64px)]">
            {props?.user ? <>
                <div className="col-span-full text-black bg-white py-2 px-5 rounded-md flex justify-between items-center h-16 ">
                    <h4 className=" text-2xl">Kishor Sarkar</h4>
                </div>
                <div className="col-span-full p-5 flex flex-col justify-between gap-5 items-start ">
                    <div className="col-span-full min-h-[calc(100vh-272px)]  ">
                        <p className=" text-lg font-semibold"> No Message Found</p>
                    </div>
                    <div className="col-span-full text-black w-full bg-white rounded-sm h-16">
                        <div className="flex flex-col h-80 border border-gray-300 p-4 rounded-lg overflow-y-auto">
                            {props?.messages.map((message, index) => (
                                <div key={index} className={`flex flex-col${index % 2 !== 0 ? '-reverse' : ''} mb-2`}>
                                    <span className="text-sm text-gray-600">{message.sender}</span>
                                    <p className={`bg-${index % 2 !== 0 ? 'blue-500 text-white' : 'gray-200 text-gray-800'} rounded-lg p-2`}>
                                        {message.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div></> : <div className=" col-span-full flex  justify-center items-center h-full w-full flex-col gap-20">
                {/* <button className="py-2 px-5 rounded-md bg-gray-300 text-gray-800">New Group</button> */}

                {/* <div className="flex flex-col h-80 border border-gray-300 p-4 rounded-lg overflow-y-auto">
                    {props?.messages.map((message, index) => (
                        <div key={index} className={`flex flex-col${index % 2 !== 0 ? '-reverse' : ''} mb-2`}>
                            <span className="text-sm text-gray-600">{message.sender}</span>
                            <p className={`bg-${index % 2 !== 0 ? 'blue-500 text-white' : 'gray-200 text-gray-800'} rounded-lg p-2`}>
                                {message.text}
                            </p>
                        </div>
                    ))}
                </div> */}


                No Chat is Selected




            </div>}

        </div>
    );
};