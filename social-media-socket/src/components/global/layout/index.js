"use client"
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Header from '../blocks/header'



export default function Layout({ children }) {
  return (
    <div>
      <Header />
      <main className=' min-h-screen'>
        {children}
      </main>

    </div>
  )
}
