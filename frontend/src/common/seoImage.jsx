import lightLogo from "../imgs/logo-light.png";

import { Helmet } from "react-helmet";



const FeaturedImage = ({ banner, title, description, url }) => {
  return (
    <Helmet>
      <meta
        property="og:image"
        content={banner || "http://localhost:5173" + lightLogo}
      />
      <meta property="og:title" content={title || "READ AND ENJOY!"} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url || "http://localhost:5173"} />
      <meta property="og:type" content="article" />
      {/* <meta
        property="og:image"
        content={customImage || "http://localhost:5173" + lightLogo}
      /> */}
    </Helmet>
  );
};

export default FeaturedImage;


