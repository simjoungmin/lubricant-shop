"use client";

import { useCallback } from "react";

const JUSO_ADDRESS_POPUP_URL = "https://business.juso.go.kr/addrlink/addrLinkUrl.do";
const JUSO_MESSAGE_TYPE = "JUSO_ADDRESS_SELECTED";

type JusoAddressPayload = {
  zipNo: string;
  roadAddrPart1: string;
  roadAddrPart2: string;
  roadFullAddr: string;
  addrDetail: string;
};

type JusoAddressMessage = {
  type: typeof JUSO_MESSAGE_TYPE;
  payload: Partial<JusoAddressPayload>;
};

export type JusoSelectedAddress = {
  postalCode: string;
  address: string;
  detailAddress?: string;
};

type UseJusoAddressSearchOptions = {
  onAddressSelected: (address: JusoSelectedAddress) => void;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isJusoAddressMessage = (data: unknown): data is JusoAddressMessage =>
  isRecord(data) &&
  data.type === JUSO_MESSAGE_TYPE &&
  isRecord(data.payload);

const toStringValue = (value: unknown) => (typeof value === "string" ? value : "");

const toSelectedAddress = (payload: Record<string, unknown>): JusoSelectedAddress => {
  const roadAddress = toStringValue(payload.roadAddrPart1) || toStringValue(payload.roadFullAddr);
  const detailAddress = toStringValue(payload.addrDetail);

  return {
    postalCode: toStringValue(payload.zipNo),
    address: [roadAddress, toStringValue(payload.roadAddrPart2)].filter(Boolean).join(" "),
    detailAddress: detailAddress || undefined,
  };
};

const submitAddressSearchForm = (confirmKey: string, popupName: string) => {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = JUSO_ADDRESS_POPUP_URL;
  form.target = popupName;
  form.style.display = "none";

  const fields = {
    confmKey: confirmKey,
    returnUrl: `${window.location.origin}/api/juso/callback`,
    resultType: "4",
    useDetailAddr: "Y",
  };

  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
  form.remove();
};

export const useJusoAddressSearch = ({ onAddressSelected }: UseJusoAddressSearchOptions) =>
  useCallback(() => {
    const confirmKey = process.env.NEXT_PUBLIC_JUSO_CONFIRM_KEY;

    if (!confirmKey) {
      window.alert("도로명주소 API 승인키가 설정되어 있지 않습니다.");
      return;
    }

    const popupName = "jusoAddressPopup";
    const popup = window.open(
      "",
      popupName,
      "width=570,height=520,scrollbars=yes,resizable=yes",
    );

    if (!popup) {
      window.alert("팝업 차단을 해제한 뒤 다시 시도해 주세요.");
      return;
    }

    const handleAddressMessage = (event: MessageEvent<unknown>) => {
      if (event.origin !== window.location.origin || !isJusoAddressMessage(event.data)) {
        return;
      }

      onAddressSelected(toSelectedAddress(event.data.payload));
      window.removeEventListener("message", handleAddressMessage);
    };

    window.addEventListener("message", handleAddressMessage);
    submitAddressSearchForm(confirmKey, popupName);
    popup.focus();
  }, [onAddressSelected]);
