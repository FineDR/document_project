import React, { useState } from "react";
import logo from "../assets/logo.jpeg"

const PDFReports = () => {
  return (
    <div className="min-h-screen flex justify-center my-14">
      <div className="cover-page bg-white w-full max-w-[800px] aspect-[210/297] shadow-lg rounded-lg flex flex-col items-center">
        <div className="justify-center mt-4">
          <h1 className="font-bold">
            THE UNIVERSITY OF DODOMA
          </h1>
        </div>

        <div className="justify-center items-center mt-6">
          <img src={logo} className="justify-center" alt="" />
        </div>
        <div className="mt-6">COLLEGE OF NATURAL AND MATHEMATICAL SCIENCE</div>
        <div>DEGREE PROGRAM: BACHELOR OF SCIENCE IN PHYSICS</div>
        <div>STUDENT NAME: WINFRIDA MATHAYO ANATORY</div>
        <div>REGISTRATION NO: T 2 3 - 0 3 - 1 2 2 5 7</div>
        <div>COURSE NAME: PRACTICAL TRAINING</div>
        <div>COURSE CODE:PH2209</div>
        <div>PRACTICAL TRAINING INSTITUTION: BENJAMIN MKAPA HOSPITAL(DODOMA)</div>
        <div>DATE OF PRACTICAL TRAINING:11 July-12 September 2025</div>
        {/* This is a blank single page */}
      </div>
    </div>
  )
}

export default PDFReports;
