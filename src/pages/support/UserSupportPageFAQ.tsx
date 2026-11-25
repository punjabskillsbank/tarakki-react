import { FAQItem } from "./FAQItem";
import { questions } from "../../constants/supportFAQ";

export function UserSupportPageFAQ() {
  return (
    <div className="relative z-10 px-4 py-8 bg-white rounded-2xl shadow-xl">
      <p className="text-xl font-semibold">Frequently Asked Questions</p>
      <p className="mt-2 text-gray-500">
        Find quick answers to common questions.
      </p>
      <div className="mt-6 space-y-3 max-h-[600px] overflow-y-auto">
        {questions.map((item) => (
          <FAQItem
            key={item.question}
            question={item.question}
            answer={item.answer}
          />
        ))}
      </div>
    </div>
  );
}
