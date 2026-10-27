import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface FAQItemProps {
  question: React.ReactNode;
  answer: React.ReactNode;
}

export const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-xl border border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-left">
        <span>{question}</span>

        <ChevronDown
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && <div className="px-4 pb-4 text-gray-500">{answer}</div>}
    </div>
  );
};
