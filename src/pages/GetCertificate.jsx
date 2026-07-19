import React from 'react';

const GetCertificate = () => {
  const containerStyle = {
    width: '100%',
    height: '950px',
    border: 'none',
    display: 'block'
  };

  return (
    <div style={containerStyle}>
      {/* Add your certificate content here */}
      <h1>Get Your Certificate</h1>
      
      {/* If you had an iframe or embedded content, add it back */}
      <iframe
        src="YOUR_CERTIFICATE_URL_HERE" // Put your actual URL here
        style={{
          width: '100%',
          height: '900px',
          border: 'none'
        }}
        title="Certificate Viewer"
      />
      
      {/* Or if you had other content, add it back */}
      <p>Complete your training to receive your certificate</p>
    </div>
  );
};

export default GetCertificate;
