import "./index.css";
import amazon from "../assets/logos/amazon.webp";
import ucla from "../assets/logos/ucla.png";
import northeastern from "../assets/logos/Northeastern.png";
import usc from "../assets/logos/usc.png";
import nasa from "../assets/logos/nasa.png";

const LogoCarousel = () => {
  const logos = [
    { src: amazon, alt: "Amazon" },
    { src: ucla, alt: "Cal" },
    { src: northeastern, alt: "Northeastern" },
    { src: usc, alt: "USC" },
    { src: nasa, alt: "Nasa" },
  ];

  return (
    <section style={{ padding: "80px 0" }}>
      <h2
        style={{
          fontSize: "36px",
          textAlign: "center",
          marginBottom: "60px",
        }}
      >
        Used By Top Performers At
      </h2>

      <div
        style={{
          width: "100%",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          className="logo-track"
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            width: "fit-content",
            gap: "100px",
            padding: "0 50px",
          }}
        >
          {[...logos, ...logos].map((logo, index) => (
            <div
              key={index}
              style={{
                flex: "0 0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                style={{
                  height: "60px",
                  width: "auto",
                  objectFit: "contain",
                  transition: "all 0.3s ease",
                  opacity: 0.7, // Reduced opacity for subtle appearance
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.opacity = "0.7";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoCarousel;
