import React, { useState, useEffect } from "react";
import { Container } from "reactstrap";

const LessonPlanLoader = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    "Analyzing learning objectives...",
    "Designing engaging activities...",
    "Structuring lesson flow...",
    "Adding assessment strategies...",
    "Crafting your lesson plan...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <Container style={{ maxWidth: "900px" }}>
      <div className="lesson-plan-loader" style={{ padding: "4rem 2rem", textAlign: "center" }}>
        {/* Animated Book Icon */}
        <div className="loader-animation" style={{ position: "relative", height: "200px", marginBottom: "2rem" }}>
          {/* Main Book */}
          <div
            className="book-container"
            style={{
              position: "relative",
              width: "120px",
              height: "140px",
              margin: "0 auto",
              animation: "float 3s ease-in-out infinite",
            }}
          >
            {/* Book Cover */}
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg, #00B894 0%, #00856F 100%)",
                borderRadius: "8px",
                boxShadow: "0 10px 30px rgba(0, 184, 148, 0.3)",
              }}
            >
              {/* Book Pages */}
              <div
                style={{
                  position: "absolute",
                  right: "0",
                  top: "8px",
                  width: "95%",
                  height: "calc(100% - 16px)",
                  background: "white",
                  borderRadius: "0 6px 6px 0",
                  boxShadow: "inset 2px 0 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                {/* Page lines */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: "15%",
                      right: "15%",
                      top: `${25 + i * 12}%`,
                      height: "2px",
                      background: "#e0e0e0",
                      borderRadius: "1px",
                      opacity: 0.6,
                    }}
                  />
                ))}
              </div>

              {/* Animated Sparkle Icon */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "2.5rem",
                  animation: "pulse 2s ease-in-out infinite",
                }}
              >
                ✨
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div
            className="floating-element"
            style={{
              position: "absolute",
              top: "20%",
              left: "20%",
              fontSize: "1.5rem",
              animation: "floatAround 4s ease-in-out infinite",
              animationDelay: "0s",
            }}
          >
            📚
          </div>
          <div
            className="floating-element"
            style={{
              position: "absolute",
              top: "30%",
              right: "20%",
              fontSize: "1.5rem",
              animation: "floatAround 4s ease-in-out infinite",
              animationDelay: "1s",
            }}
          >
            💡
          </div>
          <div
            className="floating-element"
            style={{
              position: "absolute",
              bottom: "20%",
              left: "25%",
              fontSize: "1.5rem",
              animation: "floatAround 4s ease-in-out infinite",
              animationDelay: "2s",
            }}
          >
            🎯
          </div>
          <div
            className="floating-element"
            style={{
              position: "absolute",
              bottom: "25%",
              right: "25%",
              fontSize: "1.5rem",
              animation: "floatAround 4s ease-in-out infinite",
              animationDelay: "3s",
            }}
          >
            ✏️
          </div>
        </div>

        {/* Loading Text */}
        <h4
          style={{
            color: "#00B894",
            fontWeight: "600",
            fontSize: "1.5rem",
            marginBottom: "1rem",
            animation: "fadeIn 0.5s ease-in",
          }}
        >
          Generating your lesson plan...
        </h4>

        {/* Cycling Messages */}
        <p
          key={messageIndex}
          style={{
            color: "#666",
            fontSize: "1.1rem",
            marginBottom: "2rem",
            minHeight: "30px",
            animation: "slideIn 0.5s ease-out",
          }}
        >
          {messages[messageIndex]}
        </p>

        {/* Progress Bar */}
        <div
          style={{
            maxWidth: "400px",
            margin: "0 auto",
            height: "6px",
            background: "#e0e0e0",
            borderRadius: "3px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #00B894, #55EFC4, #00B894)",
              backgroundSize: "200% 100%",
              borderRadius: "3px",
              animation: "shimmer 2s linear infinite",
            }}
          />
        </div>

        {/* Additional Info */}
        <p
          style={{
            color: "#999",
            fontSize: "0.9rem",
            marginTop: "2rem",
            fontStyle: "italic",
          }}
        >
          This may take a moment. We're crafting a personalized lesson just for you.
        </p>

        {/* CSS Animations */}
        <style>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }

          @keyframes floatAround {
            0%, 100% {
              transform: translate(0, 0);
              opacity: 0.7;
            }
            25% {
              transform: translate(10px, -10px);
              opacity: 1;
            }
            50% {
              transform: translate(-5px, -15px);
              opacity: 0.7;
            }
            75% {
              transform: translate(15px, -5px);
              opacity: 1;
            }
          }

          @keyframes pulse {
            0%, 100% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }
            50% {
              transform: translate(-50%, -50%) scale(1.2);
              opacity: 0.8;
            }
          }

          @keyframes shimmer {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </Container>
  );
};

export default LessonPlanLoader;
