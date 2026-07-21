import { useEffect } from "react";

export default function GetCertificate() {
  useEffect(() => {
    window.location.replace("/certificate.html");
  }, []);

  return null;
}
