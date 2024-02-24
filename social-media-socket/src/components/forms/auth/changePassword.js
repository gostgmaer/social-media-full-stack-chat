"use client";
import Input from "@/components/global/fields/input";
import { post } from "@/utils/lib/network/http";
import { notifySuccess } from "@/utils/notify/notice";
import { resetPasswordValidation } from "@/utils/validation/validationSchema";
import { useFormik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ChangePassword = () => {
  const router = useRouter();
  const [error, setError] = useState(undefined);
  const param = useSearchParams();

  const handleSubmit = async (values) => {
    try {
      const reset = await post(`/user/authentication/change-password`, {
        password: values.password,
      });
      if (reset.status == "OK") {
        notifySuccess(reset.message, 2000);
      }
    } catch (error) {
      const myErr = error?.["message"];
      setError(JSON.parse(myErr));
    }
  };

  const formik = useFormik({
    initialValues: {
      current_password: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: resetPasswordValidation,
    onSubmit: (values, actions) => {
      actions.setSubmitting(true);
      handleSubmit(values);
      actions.setSubmitting(false);
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className=" w-full m-auto rounded-md shadow-lg p-5 bg-gray-50 "
    >
      <div className="grid  gap-5 sm:grid-cols-2 col-span-full mb-5 w-full">
        <div className="col-span-full">
          <Input
            label={"Current Password"}
            type={"password"}
            additionalAttrs={{
              ...formik.getFieldProps("current_password"),
              placeholder: "Password",
            }}
            classes={undefined}
            icon={undefined}
            id={"current_password"}
          />
        </div>
        <div className="col-span-full">
          <Input
            label={"Password"}
            type={"password"}
            additionalAttrs={{
              ...formik.getFieldProps("password"),
              placeholder: "Password",
            }}
            classes={undefined}
            icon={undefined}
            id={"password"}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="text-red-600 capitalize">
              {formik.errors.password}
            </div>
          ) : null}
        </div>
        <div className="col-span-full">
          <Input
            label={"Confirm Password"}
            type={"password"}
            additionalAttrs={{
              ...formik.getFieldProps("confirmPassword"),
              placeholder: "Password",
            }}
            classes={undefined}
            icon={undefined}
            id={"confirmPassword"}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <div className="text-red-600 capitalize">
              {formik.errors.confirmPassword}
            </div>
          ) : null}
        </div>

        <div className="col-span-full mt-5">
          <button
            className="rizzui-button  m-auto  disabled:bg-gray-400 inline-flex font-medium items-center justify-center active:enabled:translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-50 transition-colors duration-200 px-8 py-2.5 text-base  rounded-md border border-transparent focus-visible:ring-offset-2 bg-gray-900 hover:enabled::bg-gray-800 active:enabled:bg-gray-1000 focus-visible:ring-gray-900/30 text-gray-0 w-full text-white"
            type="submit"
            disabled={!formik.isValid}
          >
            {formik.isSubmitting ? "Submitting..." : "Change"}
          </button>
        </div>
      </div>
      {error && (
        <div
          className={`error text-red-500 font-medium text-sm py-2 ${
            error["statusCode"] == 200 && " text-green-700"
          } `}
        >
          <p className="text-center">{error.message}</p>
        </div>
      )}
    </form>
  );
};

export default ChangePassword;
