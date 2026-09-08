"use client";

import type { InquiryCategory, InquiryGroup, InquiryTopic } from "@/assets/inquiry-categories";
import React from "react";

type InquiryCategoryPickerProps = {
  categories: InquiryCategory[];
  selectedCategory: InquiryCategory;
  selectedGroup: InquiryGroup;
  selectedTopic: InquiryTopic | null;
  onSelectCategory: (category: InquiryCategory) => void;
  onSelectGroup: (group: InquiryGroup) => void;
  onSelectTopic: (topic: InquiryTopic) => void;
};

const columnClassName =
  "min-h-[360px] border-b border-[#e2e6eb] p-5 last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0";

export default function InquiryCategoryPicker({
  categories,
  selectedCategory,
  selectedGroup,
  selectedTopic,
  onSelectCategory,
  onSelectGroup,
  onSelectTopic,
}: InquiryCategoryPickerProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-[#dde2e8] bg-white">
      <div className="border-b border-[#e2e6eb] px-5 py-4">
        <p className="text-sm font-black text-[#ff4b1f]">문의 분류 선택</p>
        <p className="mt-2 text-sm font-semibold text-[#65717f]">
          문의 유형을 순서대로 선택하면 입력 양식이 열립니다.
        </p>
      </div>

      <div className="grid lg:grid-cols-[0.8fr_1fr_1.1fr]">
        <div className={columnClassName}>
          <h2 className="mb-4 text-lg font-black text-[#071d3b]">1. 유형</h2>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={`w-full rounded-md border px-4 py-3 text-left transition ${
                  selectedCategory.id === category.id
                    ? "border-[#ff4b1f] bg-[#fff3ef] text-[#071d3b]"
                    : "border-[#dce2e8] bg-white text-[#34465c] hover:border-[#ff8a65] hover:bg-[#fffaf7]"
                }`}
                onClick={() => onSelectCategory(category)}
              >
                <span className="block text-sm font-black">{category.label}</span>
                <span className="mt-1 block text-xs font-semibold leading-5 text-[#7a8490]">
                  {category.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className={columnClassName}>
          <h2 className="mb-4 text-lg font-black text-[#071d3b]">2. 세부 항목</h2>
          <div className="space-y-2">
            {selectedCategory.groups.map((group) => (
              <button
                key={group.id}
                type="button"
                className={`w-full rounded-md border px-4 py-3 text-left text-sm font-bold transition ${
                  selectedGroup.id === group.id
                    ? "border-[#ff4b1f] bg-[#fff3ef] text-[#071d3b]"
                    : "border-[#dce2e8] bg-white text-[#34465c] hover:border-[#ff8a65] hover:bg-[#fffaf7]"
                }`}
                onClick={() => onSelectGroup(group)}
              >
                {group.label}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-[360px] p-5">
          <h2 className="mb-4 text-lg font-black text-[#071d3b]">3. 문의 내용</h2>
          <div className="space-y-2">
            {selectedGroup.topics.map((topic) => (
              <button
                key={topic.id}
                type="button"
                className={`w-full rounded-md border px-4 py-3 text-left transition ${
                  selectedTopic?.id === topic.id
                    ? "border-[#ff4b1f] bg-[#fff3ef] text-[#071d3b]"
                    : "border-[#dce2e8] bg-white text-[#34465c] hover:border-[#ff8a65] hover:bg-[#fffaf7]"
                }`}
                onClick={() => onSelectTopic(topic)}
              >
                <span className="block text-sm font-black">{topic.label}</span>
                <span className="mt-1 block text-xs font-semibold leading-5 text-[#7a8490]">
                  {topic.helper}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
