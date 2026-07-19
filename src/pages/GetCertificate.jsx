import React from 'react';

const GetCertificate = () => {
  return (
    <iframe
      src="YOUR_CERTIFICATE_URL_HERE" // Replace with your actual URL
      style={{
        width: '100%',
        height: '950px',
        border: 'none',
        display: 'block'
      }}
      title="Certificate"
    />
  );
};

export default GetCertificate;
