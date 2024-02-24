import Layout from "@/components/global/layout";
import { ProfileDetails } from "@/components/pages/profile/elements";
import React from "react";

const Page = () => {
  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-start justify-start gap-5 mt-5 mb-5">
        <ProfileDetails />
      </div>
    </Layout>
  );
};

export default Page;
