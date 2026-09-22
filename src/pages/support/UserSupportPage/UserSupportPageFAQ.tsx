import { FAQItem } from "./FAQItem";

const questions = [
  {
    question: "How do I create a board?",
    answer: "You can create a board from the Boards section.",
  },
  {
    question: "How do I invite members to my organization?",
    answer:
      "Go to your organization settings and invite members using their email address.",
  },
  {
    question: "How can I reset my password?",
    answer: "You can reset your password from the login page.",
  },
  {
    question: "How do I change my organization settings?",
    answer:
      "Open your organization settings and update the required information.",
  },
];

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
