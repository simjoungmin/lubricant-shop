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

const columnClassName = "min-h-[360px] border-r border-white/10 p-5 last:border-r-0";

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
    <section className="overflow-hidden rounded-lg border border-white/10 bg-[#171611]">
      <div className="border-b border-white/10 px-5 py-4">
        <p className="text-sm font-black text-[#d6a84f]">문의 분류 선택</p>
        <p className="mt-2 text-sm text-zinc-400">
          문의 유형을 순서대로 선택하면 입력 양식이 열립니다.
        </p>
      </div>

      <div className="grid lg:grid-cols-[0.8fr_1fr_1.1fr]">
        <div className={columnClassName}>
          <h2 className="mb-4 text-lg font-black text-white">1. 유형</h2>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={`w-full rounded-md border px-4 py-3 text-left transition ${
                  selectedCategory.id === category.id
                    ? "border-[#d6a84f] bg-[#d6a84f]/10 text-white"
                    : "border-white/10 text-zinc-300 hover:border-[#d6a84f]/60"
                }`}
                onClick={() => onSelectCategory(category)}
              >
                <span className="block text-sm font-black">{category.label}</span>
                <span className="mt-1 block text-xs leading-5 text-zinc-500">
                  {category.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className={columnClassName}>
          <h2 className="mb-4 text-lg font-black text-white">2. 세부 항목</h2>
          <div className="space-y-2">
            {selectedCategory.groups.map((group) => (
              <button
                key={group.id}
                type="button"
                className={`w-full rounded-md border px-4 py-3 text-left text-sm font-bold transition ${
                  selectedGroup.id === group.id
                    ? "border-[#d6a84f] bg-[#d6a84f]/10 text-white"
                    : "border-white/10 text-zinc-300 hover:border-[#d6a84f]/60"
                }`}
                onClick={() => onSelectGroup(group)}
              >
                {group.label}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-[360px] p-5">
          <h2 className="mb-4 text-lg font-black text-white">3. 문의 내용</h2>
          <div className="space-y-2">
            {selectedGroup.topics.map((topic) => (
              <button
                key={topic.id}
                type="button"
                className={`w-full rounded-md border px-4 py-3 text-left transition ${
                  selectedTopic?.id === topic.id
                    ? "border-[#d6a84f] bg-[#d6a84f]/10 text-white"
                    : "border-white/10 text-zinc-300 hover:border-[#d6a84f]/60"
                }`}
                onClick={() => onSelectTopic(topic)}
              >
                <span className="block text-sm font-black">{topic.label}</span>
                <span className="mt-1 block text-xs leading-5 text-zinc-500">
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
