import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Link from "@editorjs/link";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import Code from "@editorjs/code";
import { uploadOnCloudinary } from "../common/cludinary";

//? to handle the uploading of the image via the editor
const uploadImageByURL = async (e) => {
  let link = new Promise((resolve, reject) => {
    try {
      resolve(e);
    } catch (err) {
      reject(err);
    }
  });

  const url = await link;
  try {
    return {
      success: 1,
      file: { url },
    };
  } catch (error) {
    console.error("Error uploading image by URL:", error);
    return {
      success: 0,
      message: "Failed to upload image by URL.",
    };
  }
};

//? to Handle uploading of the image via Files
const uploadImageByFile = async (file) => {
  try {
    const imageUrl = await uploadOnCloudinary(file);
    if (imageUrl) {
      return {
        success: 1,
        file: { url: imageUrl },
      };
    } else {
      return {
        success: 0,
        message: "Failed to upload image.",
      };
    }
  } catch (error) {
    console.error("Error uploading image by file:", error);
    return {
      success: 0,
      message: "An error occurred while uploading the image.",
    };
  }
};

//*export stuff..
export const tools = {
  embed: Embed,
  list: {
    class: List,
    inlineToolbar: true,
  },
  link: Link,
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByUrl: uploadImageByURL,
        uploadByFile: uploadImageByFile,
      },
    },
  },
  header: {
    class: Header,
    config: {
      placeholder: "Type Heading..",
      levels: [2, 3, 4],
      defaultLevel: 2,
    },
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
  },
  marker: Marker,
  inlineCode: InlineCode,
  code: Code,
};
