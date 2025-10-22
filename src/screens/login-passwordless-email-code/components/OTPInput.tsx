import { useEffect, useRef, useState } from "react";

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
}

/**
 * Modern 6-digit OTP input component with individual boxes for each digit.
 * Automatically focuses next/previous box on input/backspace.
 */
function OTPInput({
  length = 6,
  value,
  onChange,
  error = false,
  disabled = false,
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(
    value ? value.split("").slice(0, length) : Array(length).fill("")
  );
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Update internal state when external value changes
  useEffect(() => {
    if (value) {
      const newOtp = value.split("").slice(0, length);
      while (newOtp.length < length) {
        newOtp.push("");
      }
      setOtp(newOtp);
    }
  }, [value, length]);

  const handleChange = (index: number, digit: string) => {
    // Only allow single digit numbers
    if (digit && !/^\d$/.test(digit)) return;

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Call onChange with the complete OTP string
    onChange(newOtp.join(""));

    // Auto-focus next input if digit was entered
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Handle backspace
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];

      if (otp[index]) {
        // Clear current digit
        newOtp[index] = "";
        setOtp(newOtp);
        onChange(newOtp.join(""));
      } else if (index > 0) {
        // Move to previous input and clear it
        newOtp[index - 1] = "";
        setOtp(newOtp);
        onChange(newOtp.join(""));
        inputRefs.current[index - 1]?.focus();
      }
    }
    // Handle left arrow
    else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Handle right arrow
    else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    const digits = pasteData.replace(/\D/g, "").slice(0, length).split("");

    const newOtp = [...otp];
    digits.forEach((digit, idx) => {
      if (idx < length) {
        newOtp[idx] = digit;
      }
    });
    setOtp(newOtp);
    onChange(newOtp.join(""));

    // Focus the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex((d) => !d);
    const focusIndex =
      nextEmptyIndex === -1 ? length - 1 : Math.min(nextEmptyIndex, length - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleFocus = (index: number) => {
    // Select the content when focused for easier editing
    inputRefs.current[index]?.select();
  };

  return (
    <div className="flex justify-center gap-2 my-6">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => handleFocus(index)}
          disabled={disabled}
          autoFocus={index === 0}
          className={`
            w-12 h-14 text-center text-2xl font-semibold
            border-2 rounded-md
            transition-all duration-200
            ${
              error
                ? "border-error focus:border-error"
                : "border-input-border focus:border-base-focus-color"
            }
            ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-input-background"}
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            ${error ? "focus:ring-error" : "focus:ring-base-focus-color"}
            text-input-filled-text
          `}
          style={{
            borderColor: error
              ? "var(--ul-theme-color-error)"
              : "var(--ul-theme-color-input-border)",
          }}
        />
      ))}
    </div>
  );
}

export default OTPInput;
