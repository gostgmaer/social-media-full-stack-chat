import ChangePassword from '@/components/forms/auth/changePassword'
import Layout from '@/components/global/layout'
import React from 'react'

const Page = () => {
  return (
    <Layout>
      <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 flex items-start justify-start gap-5 mt-5 mb-5 min-h-[calc(100vh-64px)]">
        <ChangePassword/>
      </div>
    </Layout>
  )
}

export default Page