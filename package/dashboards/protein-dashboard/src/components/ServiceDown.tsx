// ServiceDown.tsx
import React from "react";

// Styles
const styles = {
  container: {
    maxWidth: "800px",
    margin: "auto",
    padding: "20px",
    textAlign: "center",
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    backgroundColor: "#f9f9f9",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    lineHeight: "1.6",
  },
  header: {
    color: "#333",
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  text: {
    color: "#666",
    fontSize: "16px",
    marginBottom: "15px",
  },
  link: {
    color: "#0066cc",
    textDecoration: "none",
  },
  videoContainer: {
    display: "flex",
    justifyContent: "center",
    margin: "20px 0",
  },
  video: {
    width: "100%",
    height: "315px",
    maxWidth: "560px",
    borderRadius: "8px",
  },
};

const ServiceDown: React.FC = () => {
  return (
    <div style={styles.container as React.CSSProperties}>
      <h1 style={styles.header as React.CSSProperties}>Project Evolution in Progress</h1>
      <p style={styles.text as React.CSSProperties}>
        I'm currently exploring cost-effective ways to host this application, which includes an AWS-hosted environment and an RDS database for our SQL chatbot data. As I navigate through these challenges, the service might be intermittently unavailable.
      </p>
      <p style={styles.text as React.CSSProperties}>
        Hi, I'm <strong>Dhruv Parthasarathy</strong>. As a student dedicated to building impactful software solutions, I'm keen on optimizing the way we host and manage our applications to make them both efficient and sustainable.
      </p>
      <div style={styles.videoContainer as React.CSSProperties}>
        <iframe
          style={styles.video as React.CSSProperties}
          src="https://www.youtube.com/embed/rLfArYYq_oM"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <p style={styles.text as React.CSSProperties}>
        For more of my projects and contributions to software development, please visit my <a style={styles.link as React.CSSProperties} href="https://github.com/parthasarathydNU" target="_blank" rel="noopener noreferrer">GitHub profile</a>.
      </p>
      <p style={styles.text as React.CSSProperties}>
        If you have ideas or are interested in contributing to the project—whether it's sharing resources, providing funding, or lending your expertise—please connect with me on <a style={styles.link as React.CSSProperties} href="https://www.linkedin.com/in/parthadhruv/" target="_blank" rel="noopener noreferrer">LinkedIn</a> or send an email to <a style={styles.link as React.CSSProperties} href="mailto:parthasarathy.d@northeastern.edu">parthasarathy.d@northeastern.edu</a>.
      </p>
    </div>
  );
};

export default ServiceDown;
