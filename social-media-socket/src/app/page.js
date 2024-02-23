import Index from "@/components/pages/landing";

const HomePage = () => {


  return (
    <div className="flex w-full flex-col min-h-screen justify-center px-5">
      <div className="mx-auto w-full max-w-md py-12 md:max-w-lg lg:max-w-xl 2xl:pb-8 2xl:pt-2">
        <Index />
      </div>
    </div>
  );
};

export default HomePage;
