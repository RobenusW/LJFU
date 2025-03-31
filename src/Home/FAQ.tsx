import { useState } from "react";
import { useLocation } from "react-router-dom";

const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      style={{
        borderBottom: "1px solid #eee",
        padding: "20px 0",
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          textAlign: "left",
          padding: "10px",
          background: "none",
          border: "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "18px",
          fontWeight: "500",
          cursor: "pointer",
          color: "#000",
        }}
      >
        {question}
        <span>{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && (
        <div style={{ padding: "20px 10px", color: "#666" }}>{answer}</div>
      )}
    </div>
  );
};

// Update your Home component
export default function Home() {
  const location = useLocation();

  const faqs = [
    {
      question: "How does LetJobsFindYou work?",
      answer:
        "Prosepctive talent upload their resumes and we give you access to their resumes",
    },
    ...(location.pathname.includes("talent")
      ? [
          {
            question: "How much does LetJobsFindYou cost?",
            answer: "It's free for talent and businesses",
          },
        ]
      : [
          {
            question: "How much does LetJobsFindYou cost?",
            answer: "It's free for talent and businesses",
          },
      ]),

    {
      question: "How do I get started?",
      answer: location.pathname.includes("business")
        ? "Simply create a profile for your business, tell us what you are looking for, and we will start matching you with the best talent or you can manually filter for specific criteria."
        : "Upload your resume and businesses will reach out to you if interested.",
    },
    {
      question:
        "Should my company use this service, if I am not actively hiring?",
      answer:
        "It is always best to know whether there are more qualified candidates for you business.",
    },
  ];

  return (
    <div className="container">
      {/* FAQ Section - outside container */}
      <section
        style={{
          padding: "100px 20px",
          background: "#f8f9fa",
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
          marginRight: "calc(-50vw + 50%)",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "48px",
              textAlign: "center",
              marginBottom: "60px",
            }}
          >
            Frequently Asked Questions
          </h2>
          <div style={{ maxWidth: "100%", margin: "0 auto" }}>
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
