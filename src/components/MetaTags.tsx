import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

const MetaTags = () => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Wavelength Helper</title>
        <meta
          name="description"
          content="A helper app for playing Wavelength remotely while sheltering in place"
        />
        <meta name="author" content="Dave Fishel" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width" />
      </Helmet>
    </HelmetProvider>
  );
};

export default MetaTags;
