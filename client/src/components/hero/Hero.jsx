import { useState, useEffect } from "react";
import CountUp from "./CountUp";

function Hero() {
  const line1 = "Companies";
  const line2 = "Begin.";

  const [displayLine1, setDisplayLine1] = useState("");
  const [displayLine2, setDisplayLine2] = useState("");
  const [currentLine, setCurrentLine] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typingSpeed = isDeleting ? 50 : 100;
    let timeout;

    if (!isDeleting) {
      if (currentLine === 1) {
        if (displayLine1.length < line1.length) {
          timeout = setTimeout(() => {
            setDisplayLine1(line1.slice(0, displayLine1.length + 1));
          }, typingSpeed);
        } else {
          timeout = setTimeout(() => {
            setCurrentLine(2);
          }, 300);
        }
      }

      else {
        if (displayLine2.length < line2.length) {
          timeout = setTimeout(() => {
            setDisplayLine2(line2.slice(0, displayLine2.length + 1));
          }, typingSpeed);
        } else {
          timeout = setTimeout(() => {
            setIsDeleting(true);
          }, 2000);
        }
      }
    } else {

      if (displayLine2.length > 0) {
        timeout = setTimeout(() => {
          setDisplayLine2(line2.slice(0, displayLine2.length - 1));
        }, typingSpeed);
      }

      else if (displayLine1.length > 0) {
        setCurrentLine(1);

        timeout = setTimeout(() => {
          setDisplayLine1(line1.slice(0, displayLine1.length - 1));
        }, typingSpeed);
      }

      else {
        timeout = setTimeout(() => {
          setIsDeleting(false);
          setCurrentLine(1);
        }, 300);
      }
    }

    return () => clearTimeout(timeout);
  }, [
    displayLine1,
    displayLine2,
    currentLine,
    isDeleting,
    line1,
    line2,
  ]);

  return (
    <div className="flex h-full items-center">
      <div className="max-w-xl">
        <h1 className="text-7xl font-bold leading-tight tracking-tight">
          Ideas Meet
          <br />
          Execution.
          <br />

          <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            <div className="h-[2.4em]">
              <div className="h-[1.2em] flex items-center">
                <span>
                  {displayLine1}
                  {currentLine === 1 && (
                    <span className="ml-1 text-white blink-cursor">|</span>
                  )}
                </span>
              </div>

              <div className="h-[1.2em] flex items-center">
                <span>
                  {displayLine2}
                  {currentLine === 2 && (
                    <span className="ml-1 text-white blink-cursor">|</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </h1>

        <p className="mt-8 max-w-lg text-2xl leading-8 text-white/60">
          Connect with founders, investors and professionals on one
          platform. Build meaningful collaborations, discover
          opportunities, and turn ideas into successful startups.
        </p>

        <div className="mt-12 flex items-center gap-12">
          <div>
            <h2 className="text-3xl font-bold">
              <CountUp end={10} suffix="K+" />
            </h2>
            <p className="mt-2 text-sm text-white/50">
              Active Members
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold">
              <CountUp end={500} />
            </h2>
            <p className="mt-2 text-sm text-white/50">
              Startups Built
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold">
              <CountUp end={40} />
            </h2>
            <p className="mt-2 text-sm text-white/50">
              Countries
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;