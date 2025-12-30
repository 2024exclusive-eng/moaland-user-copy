"use client";

import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Mock data
const mockFaqs = Array.from({ length: 6 }, (_, i) => ({
  id: `item-${i + 1}`,
  title: "제목입니다.",
  date: "2024.08.12",
  content: "내용입니다.",
}));

export default function Page() {
  const [activeCategory, setActiveCategory] = useState<
    "faq" | "usage" | "term_of_use" | "privacy"
  >("faq");

  const categoryTitles = {
    faq: "자주하는 질문",
    usage: "서비스 이용 가이드",
    term_of_use: "이용약관",
    privacy: "개인정보처리방침",
  };

  return (
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-8">
        {/* Sidebar */}
        <div className="col-span-2 pt-10 md:border-r border-[#e5e7eb]">
          <h1 className="text-[#111827] text-2xl font-bold">고객센터</h1>

          <div className="pl-3 mt-5">
            <button
              onClick={() => setActiveCategory("faq")}
              className={`text-lg transition-colors ${
                activeCategory === "faq"
                  ? "text-[#111827] font-semibold"
                  : "text-[#9CA3AF]"
              }`}
            >
              자주하는 질문
            </button>
            <button
              onClick={() => setActiveCategory("usage")}
              className={`text-lg mt-3 block transition-colors ${
                activeCategory === "usage"
                  ? "font-semibold text-[#111827]"
                  : "text-[#9CA3AF]"
              }`}
            >
              서비스 이용 가이드
            </button>
            <button
              onClick={() => setActiveCategory("term_of_use")}
              className={`text-lg mt-3 block transition-colors ${
                activeCategory === "term_of_use"
                  ? "font-semibold text-[#111827]"
                  : "text-[#9CA3AF]"
              }`}
            >
              이용약관
            </button>
            <button
              onClick={() => setActiveCategory("privacy")}
              className={`text-lg mt-3 block transition-colors ${
                activeCategory === "privacy"
                  ? "font-semibold text-[#111827]"
                  : "text-[#9CA3AF]"
              }`}
            >
              개인정보처리방침
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-6 md:pl-10 py-10 flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-[#111827] leading-normal">
            {categoryTitles[activeCategory]}
          </h2>

          {/* FAQ Accordion */}
          {activeCategory === "faq" && (
            <Accordion type="single" collapsible className="w-full">
              {mockFaqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="border-0">
                  <AccordionTrigger className="px-3 py-4 hover:no-underline items-center">
                    <div className="flex flex-col items-start text-sm text-left">
                      <span className="font-semibold text-[#111827] leading-[1.7]">
                        {faq.title}
                      </span>
                      <span className="text-[#4b5563] leading-[1.7]">
                        {faq.date}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="bg-[#f3f4f6] border-b border-[#e5e7eb] px-3 py-4">
                    <p className="text-sm text-[#4b5563] leading-[1.7]">
                      {faq.content}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}

          {activeCategory !== "faq" && <div>content goes here</div>}
        </div>
      </div>
    </div>
  );
}
