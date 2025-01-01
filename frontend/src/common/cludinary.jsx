import React, { useState } from "react";
import axios from "axios";

export const uploadOnCloudinary = async (img) => {
  try {
    let ImgURL = null;
    const formData = new FormData();
    formData.append("image", img);

    //*Jo bhi backend se return hua wo is response m aa jaayga
    const response = await axios.post(
      import.meta.env.VITE_SERVER_DOMAIN + "/get-upload-url",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.imageUrl;
  } catch (error) {
    console.error("Error uploading image to server:", error);
    throw error;
  }
};
