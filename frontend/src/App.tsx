import React from "react";
import DashboardWrapper from "./sections/DashboardWrapper/DashboardWrapper";

const metadata = {
  title: "Ashfaque TaskNest",
  description: "Generated by create react app",
};
function App({
  children,
}: Readonly<{
  children?: React.ReactNode;
}>) {
  React.useEffect(() => {
    document.title = metadata.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", metadata.description);
    } else {
      const newMetaDescription = document.createElement("meta");
      newMetaDescription.name = "description";
      newMetaDescription.content = metadata.description;
      document.head.appendChild(newMetaDescription);
    }
  }, []);

  return (
    <div>
      <DashboardWrapper>{children}</DashboardWrapper>
    </div>
  );
}

export default App;
