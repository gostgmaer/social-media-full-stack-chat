"use client";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { loginValidationSchema } from "@/utils/validation/validationSchema";
import Input from "@/components/global/fields/input";
import { notifyerror } from "@/utils/notify/notice";

const LoginForm = () => {

  const route = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      is_remember:false
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      const res = await signIn("credentials", {
        redirect: false,
        ...values,
      });

      if (res.ok) {
        if (res.url) {
          const parsedUrl = new URL(res.url);
          const callbackUrlParam = parsedUrl.searchParams.get("callbackUrl");

          if (callbackUrlParam) {
            const decodedCallbackUrl = callbackUrlParam
              ? decodeURIComponent(callbackUrlParam)
              : "/";

            route.push(decodedCallbackUrl);
          } else {
            route.push("/chats");
          }

        } else {
          route.push("/");
        }
      } else {
   
       notifyerror(res.error,5000)
      }
    },
  });

  const handleLogin = async () => { };

  // useEffect(() => {
  //   if (userId) {
  //     route.push("/my-account/" + userId["user_id"]);
  //   }
  // }, [userId]);

  return (
    <>
      <form onSubmit={formik.handleSubmit} className="bg-gray-100 shadow-2xl sm:p-10 p-5 rounded-lg">

        <div className="  grid  gap-3 sm:grid-cols-2 col-span-full mb-5 ">

          <div className="col-span-full ">
            <Input label={"Email Address"} type={"text"} additionalAttrs={{ ...formik.getFieldProps('email'), placeholder: "John" }} classes={undefined} icon={undefined} id={'email'} />
          </div>
          <div className="col-span-full ">
            <Input label={"Password"} type={"password"} additionalAttrs={{ ...formik.getFieldProps('password'), placeholder: "Password" }} classes={undefined} icon={undefined} id={'password'} />
          </div>



        </div>
        <div className="space-y-5 lg:space-y-6">
      
          <div className="sm:flex block items-center justify-between pb-1">
            <div className="rizzui-checkbox-root mb-2 flex flex-col [&amp;>label>span]:font-medium">
              <label className="rizzui-checkbox-container flex flex-row items-center">
                <span className="relative leading-none">
                  <input
                    type="checkbox"
                    className="rizzui-checkbox-input peer disabled:bg-gray-50 disabled:border-gray-200 h-5 w-5 rounded bg-transparent border border-gray-300 checked:!bg-gray-1000 focus:ring-gray-900/30 checked:!border-gray-1000 hover:enabled:border-gray-1000"
                    name="isRememberMe"
                  />
                </span>
                <span className="rizzui-checkbox-label text-sm ml-1.5 rtl:mr-1.5">
                  Remember Me
                </span>
              </label>
            </div>
           <div className=" text-end">
           <Link
              className="h-auto p-0 text-sm font-semibold text-gray-700 underline text-end w-full transition-colors hover:text-primary hover:no-underline"
              href="/auth/forget-password"
            >
              Forgot Password?
            </Link>
           </div>
          </div>
          <button
            className="rizzui-button inline-flex font-medium items-center justify-center active:enabled:translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-50 transition-colors duration-200 px-8 py-2.5 text-base  rounded-md border border-transparent focus-visible:ring-offset-2 bg-gray-900 hover:enabled::bg-gray-800 active:enabled:bg-gray-1000 focus-visible:ring-gray-900/30 text-gray-0 w-full text-white"
            type="submit"
          >
            Sign In
          </button>
        </div>
        {/* {authError && (
          <div className="error text-red-500 font-medium text-sm py-2">
            <p className="text-center">{authError.message}</p>
          </div>
        )} */}
      </form>
    </>
  );
};

export default LoginForm;



