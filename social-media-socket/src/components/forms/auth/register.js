"use client";

import Input from "@/components/global/fields/input";
import { post } from "@/utils/lib/network/http";

import { registerValidationSchema } from "@/utils/validation/validationSchema";

// import { post } from "@/lib/network/http";

import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa";


const RegisterForm = () => {
  const [error, setError] = useState(null);
  const router = useRouter();



  const handleSubmit = async (values) => {

    //console.log(values);
    try {
      const res = await post("/authentication/user/register", values);
      if (res) {
        router.push("/auth/signin");
      }
    } catch (error) {
      setError(error);
      // console.log(error);
    }
  };



  const handleRegistration = async (body) => {


  };


  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      isAgreed: "false",
    },
    validationSchema: registerValidationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="bg-gray-100 p-5 sm:p-10 shadow-lg rounded-lg">

      <div className="  grid  gap-3 sm:grid-cols-2 col-span-full mb-5 ">

        <div className="col-span-full sm:col-span-1 ">
          <Input label={"First Name"} type={"text"} additionalAttrs={{ ...formik.getFieldProps('firstName'), placeholder: "John" }} classes={undefined} icon={undefined} id={'firstName'} />
        </div>
        <div className="col-span-full sm:col-span-1 ">
          <Input label={"Last Name"} type={"text"} additionalAttrs={{ ...formik.getFieldProps('lastName'), placeholder: "Die" }} classes={undefined} icon={undefined} id={'lastName'} />
        </div>
        <div className="col-span-full">
          <Input label={"Email Address"} type={"email"} additionalAttrs={{ ...formik.getFieldProps('email'), placeholder: "infos@mail.com" }} classes={undefined} icon={undefined} id={'email'} />
        </div>

        <div className="col-span-full ">
          <Input label={"Password"} type={"password"} additionalAttrs={{ ...formik.getFieldProps('password'), placeholder: "Password" }} classes={undefined} icon={undefined} id={'password'} />
        </div>
        {/* <div className="col-span-full sm:col-span-1 ">
          <Input label={"Confirm Password"} type={"password"} additionalAttrs={{ ...formik.getFieldProps('confirmPassword'), placeholder: "Confirm Pass" }} classes={undefined} icon={undefined} id={'confirmPassword'} />
        </div> */}
        <div className="col-span-full mt-2 ">
          <label className="rizzui-checkbox-container flex flex-row items-center">
            <span className="relative leading-none">
              <input
                className="rizzui-checkbox-input peer disabled:bg-gray-50 disabled:border-gray-200 h-5 w-5 rounded bg-transparent border border-gray-300 checked:!bg-gray-1000 focus:ring-gray-900/30 checked:!border-gray-1000 hover:enabled:border-gray-1000"
                type="checkbox"
                name="isAgreed"
                value={formik.values.isAgreed}
                onChange={formik.handleChange}
              />

            </span>
            <span className="rizzui-checkbox-label text-sm ml-1.5 rtl:mr-1.5">
              By signing up you have agreed to our{" "}
              <Link
                className="font-medium text-blue transition-colors hover:underline"
                href="/"
              >
                Terms
              </Link>
              &amp;{" "}
              <Link
                className="font-medium text-blue transition-colors hover:underline"
                href="/"
              >
                Privacy Policy
              </Link>
            </span>
          </label>
          {formik.errors.isAgreed && formik.touched.isAgreed && (
            <div className="text-red-500 text-sm">
              {formik.errors.isAgreed}
            </div>
          )}
        </div>
        <div>

        </div>


      </div>
      <div className="flex flex-col gap-x-4 gap-y-5 md:grid md:grid-cols-2 lg:gap-5 text-black">


        <button
          className="rizzui-button col-span-2 inline-flex font-medium items-center bg-gray-700 hover:enabled::bg-gray-800 active:enabled:bg-gray-1000 focus-visible:ring-gray-900/30 text-gray-0  text-white justify-center active:enabled:translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-50 transition-colors duration-200 px-5 py-2 text-base h-12 rounded-md border border-transparent focus-visible:ring-offset-2 bg-blue hover:enabled:bg-gray-900 focus-visible:ring-blue/30 text-white w-full"
          type="submit"
          disabled={!formik.isValid}
        >
          <span>Get Started</span>{" "}
          <FaArrowRight className="ms-2 mt-0.5 h-5 w-5" />
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
