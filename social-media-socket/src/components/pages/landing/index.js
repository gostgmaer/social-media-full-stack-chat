"use client";
import LoginForm from '@/components/forms/auth/login'
import RegisterForm from '@/components/forms/auth/register';
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

const Index = () => {

    const [islogin, setIslogin] = useState(true);

    return (
        <div>
            <div className="flex flex-col items-center">
                <Link className="mb-7 inline-block max-w-[64px] lg:mb-9" href="/">
                    <Image
                        alt="Isomorphic"
                        loading="lazy"
                        height={50} width={50}
                        decoding="async"
                        data-nimg="1"
                        src="https://isomorphic-furyroad.vercel.app/_next/static/media/logo-short.18ca02a8.svg"
                    />
                </Link>
                <h2 className="rizzui-title-h2 mb-7 text-center text-[28px] font-bold leading-snug md:text-3xl md:!leading-normal lg:mb-10 lg:text-4xl">
                    Welcome! <br /> {islogin ? 'Sign in with your credentials.' : "Join us today!"}
                </h2>
            </div>

            <div className="before:content-[' '] relative  mt-0.5 flex items-center  before:absolute before:left-0 before:top-1/2 before:h-px before:w-full before:bg-gray-100 mb-5 2xl:mb-7 justify-center">

            </div>
            {islogin ? <LoginForm /> : <RegisterForm />}

            {islogin ? <p className="mt-6 text-center text-[15px] leading-loose text-gray-500 md:mt-7 lg:mt-9 lg:text-base">
                Don’t have an account?
                <button
                    className="font-semibold text-gray-700 transition-colors hover:text-primary ml-1"
                    onClick={() => setIslogin(false)}
                >
                    Sign Up
                </button>
            </p> : <p className="mt-6 text-center text-[15px] leading-loose text-gray-500 md:mt-7 lg:mt-9 lg:text-base">
                Already have an account?
                <button
                    className="font-semibold text-gray-700 transition-colors hover:text-primary ml-1"
                    onClick={() => setIslogin(true)}
                >
                    Sign in
                </button>
            </p>}
        </div>
    )
}

export default Index