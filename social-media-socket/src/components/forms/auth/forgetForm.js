import Input from "@/components/global/fields/input";
import { post } from "@/utils/lib/network/http";
import { forgetPasswordValidation } from "@/utils/validation/validationSchema";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const ForgetForm = () => {

  const [error, setError] = useState(undefined);

  const handleSubmit = async (values) => {
    try {
      const res = await post("/user/auth/forget-password", values);
      setError(res);
      return res;
    } catch (error) {
      const myErr = error?.message;
      setError(JSON.parse(myErr));
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgetPasswordValidation,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  // useEffect(() => {
  //   if (userId) {
  //     router.push("/dashboard");
  //   }
  // }, [userId]);

  return (
    <form onSubmit={formik.handleSubmit}>

      <div className="  grid  gap-3 sm:grid-cols-2 col-span-full mb-5 ">
        <div className="col-span-full sm:col-span-1 ">
          <Input label={"Email Address"} type={"email"} additionalAttrs={{ ...formik.getFieldProps('email'), placeholder: "info@mail.com" }} classes={undefined} icon={undefined} id={'email'} />
        </div>
      </div>

      <div className="space-y-5 text-black">
    
        <button
          className="rizzui-button disabled:bg-gray-400 inline-flex font-medium items-center justify-center active:enabled:translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-50 transition-colors duration-200 px-8 py-2.5 text-base  rounded-md border border-transparent focus-visible:ring-offset-2 bg-gray-900 hover:enabled::bg-gray-800 active:enabled:bg-gray-1000 focus-visible:ring-gray-900/30 text-gray-0 w-full text-white"
          type="submit"
          disabled={!formik.isValid}
        >
          <span>Reset Password</span>
        </button>
      </div>
      {error && (
        <div
          className={`error text-red-500 font-medium text-sm py-2 ${error["statusCode"] == 200 && " text-green-700"
            } `}
        >
          <p className="text-center">{error.message}</p>
        </div>
      )}

    </form>
  );
};

export default ForgetForm;
