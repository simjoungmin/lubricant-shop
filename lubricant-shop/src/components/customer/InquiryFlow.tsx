"use client";

import { inquiryCategories, type InquiryCategory, type InquiryGroup, type InquiryTopic } from "@/assets/inquiry-categories";
import InquiryCategoryPicker from "@/components/customer/InquiryCategoryPicker";
import InquiryForm from "@/components/customer/InquiryForm";
import React, { useState } from "react";

export default function InquiryFlow() {
  const [selectedCategory, setSelectedCategory] = useState<InquiryCategory>(
    inquiryCategories[0],
  );
  const [selectedGroup, setSelectedGroup] = useState<InquiryGroup>(
    inquiryCategories[0].groups[0],
  );
  const [selectedTopic, setSelectedTopic] = useState<InquiryTopic | null>(null);

  const handleSelectCategory = (category: InquiryCategory) => {
    setSelectedCategory(category);
    setSelectedGroup(category.groups[0]);
    setSelectedTopic(null);
  };

  const handleSelectGroup = (group: InquiryGroup) => {
    setSelectedGroup(group);
    setSelectedTopic(null);
  };

  return (
    <div className="space-y-8">
      <InquiryCategoryPicker
        categories={inquiryCategories}
        selectedCategory={selectedCategory}
        selectedGroup={selectedGroup}
        selectedTopic={selectedTopic}
        onSelectCategory={handleSelectCategory}
        onSelectGroup={handleSelectGroup}
        onSelectTopic={setSelectedTopic}
      />

      {selectedTopic ? (
        <InquiryForm
          selectedCategory={selectedCategory}
          selectedGroup={selectedGroup}
          selectedTopic={selectedTopic}
        />
      ) : (
        <div className="rounded-lg border border-dashed border-white/15 bg-[#171611] p-6 text-center">
          <p className="text-sm font-bold text-zinc-400">
            세 번째 문의 내용을 선택하면 입력칸이 아래에 표시됩니다.
          </p>
        </div>
      )}
    </div>
  );
}
