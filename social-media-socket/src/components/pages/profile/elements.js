"use client"
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';
import Input from '@/components/global/fields/input';
import ImageUpload from '@/components/global/fields/ImageUpload';
import Link from 'next/link';

export const ProfileDetails = () => {
    const [imageData, setImageData] = useState(undefined);
    const initialValues = {
        firstName: '',
        lastName: '',
        streetAddress: '',
        city: '',
        state: '',
        postalCode: '',
        email: '',
        phoneNumber: '',
        dateOfBirth: '',
        gender: '',
        country: '',
    };

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        streetAddress: Yup.string().required('Street Address is required'),
        city: Yup.string().required('City is required'),
        state: Yup.string().required('State is required'),
        postalCode: Yup.string().required('Postal Code is required'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
        phoneNumber: Yup.string().required('Phone Number is required'),
        dateOfBirth: Yup.date().required('Date of Birth is required'),
        gender: Yup.string().required('Gender is required'),
        country: Yup.string().required('Country is required'),
    });

    const onSubmit = (values) => {
        // Handle form submission here
        console.log(values);
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            console.log(values);
        },
    });

    return (
        <div className="container mx-auto mt-10">
            <div className=' flex w-full justify-between items-center pl-0 py-5 px-0 mb-5'>
                <h1 className=' text-4xl font-semibold'>My profile</h1>
            <Link href={'/profile/change-password'} className=' px-5 py-2 bg-gray-400 text-white rounded-md'>Change Password</Link>
            </div>
            <form onSubmit={formik.handleSubmit} className="grid  gap-5 sm:grid-cols-3 col-span-full mb-5">

                <div className='grid  gap-3 sm:grid-cols-2  mb-5 col-span-full sm:col-span-2 '>
                <div className="col-span-full">
                    <Input label={"Email Address"} type={"email"} additionalAttrs={{ ...formik.getFieldProps('email'), placeholder: "",disabled:true }} classes={"read-only "} icon={undefined} id={'email'} />
                </div>
                <div className="col-span-full sm:col-span-1 ">
                    <Input label={"First Name"} type={"text"} additionalAttrs={{ ...formik.getFieldProps('firstName'), placeholder: "John" }} classes={undefined} icon={undefined} id={'firstName'} />
                </div>
                <div className="col-span-full sm:col-span-1 ">
                    <Input label={"Last Name"} type={"text"} additionalAttrs={{ ...formik.getFieldProps('lastName'), placeholder: "Die" }} classes={undefined} icon={undefined} id={'lastName'} />
                </div>
                <div className="col-span-full sm:col-span-1 ">
                    <Input label={"Phone Number"} type={"text"} additionalAttrs={{ ...formik.getFieldProps('phoneNumber'), placeholder: "XXXXXXXXXX" }} classes={undefined} icon={undefined} id={'phoneNumber'} />
                </div>
                <div className="col-span-full sm:col-span-1 ">
                    <Input label={"Date of Birth"} type={"date"} additionalAttrs={{ ...formik.getFieldProps('dateOfBirth'), placeholder: "MM/DD/YYYY" }} classes={undefined} icon={undefined} id={'dateOfBirth'} />
                </div>
                <div className="col-span-full sm:col-span-1 ">
                    <Input label={"Last Name"} type={"text"} additionalAttrs={{ ...formik.getFieldProps('lastName'), placeholder: "Die" }} classes={undefined} icon={undefined} id={'lastName'} />
                </div>
                
                </div>
                <div className='grid  gap-3 sm:grid-cols-2  mb-5 col-span-full sm:col-span-1 '>

                    <ImageUpload imagePreview={imageData} setImagePreview={setImageData}/>
                </div>



                <div className=' col-span-full'>
                    <button type="submit" className="col-span-2 bg-blue-500 text-white p-2 rounded">
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
};

