const TOSS_PAYMENTS_SCRIPT_URL = "https://js.tosspayments.com/v1/payment";

type TossPaymentMethod = "카드" | "가상계좌" | "계좌이체" | "휴대폰" | "문화상품권";

type TossPaymentRequest = {
  amount: number;
  orderId: string;
  orderName: string;
  customerName?: string;
  successUrl: string;
  failUrl: string;
};

type TossPayments = {
  requestPayment: (
    method: TossPaymentMethod,
    request: TossPaymentRequest,
  ) => Promise<void>;
};

declare global {
  interface Window {
    TossPayments?: (clientKey: string) => TossPayments;
  }
}

let tossScriptPromise: Promise<void> | null = null;

export async function requestTossCardPayment(
  clientKey: string,
  request: TossPaymentRequest,
) {
  if (!clientKey) {
    throw new Error("토스페이먼츠 클라이언트 키 설정을 확인해 주세요.");
  }

  await loadTossPaymentsScript();

  if (!window.TossPayments) {
    throw new Error("토스페이먼츠 결제창을 불러오지 못했습니다.");
  }

  await window.TossPayments(clientKey).requestPayment("카드", request);
}

function loadTossPaymentsScript() {
  if (window.TossPayments) {
    return Promise.resolve();
  }

  if (tossScriptPromise) {
    return tossScriptPromise;
  }

  tossScriptPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${TOSS_PAYMENTS_SCRIPT_URL}"]`,
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("토스페이먼츠 결제창을 불러오지 못했습니다.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = TOSS_PAYMENTS_SCRIPT_URL;
    script.async = true;
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error("토스페이먼츠 결제창을 불러오지 못했습니다.")), { once: true });
    document.head.appendChild(script);
  });

  return tossScriptPromise;
}
