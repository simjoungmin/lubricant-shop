const JUSO_MESSAGE_TYPE = "JUSO_ADDRESS_SELECTED";

export async function POST(request: Request) {
  const formData = await request.formData();
  const origin = new URL(request.url).origin;
  const payload = {
    zipNo: String(formData.get("zipNo") ?? ""),
    roadAddrPart1: String(formData.get("roadAddrPart1") ?? ""),
    roadAddrPart2: String(formData.get("roadAddrPart2") ?? ""),
    roadFullAddr: String(formData.get("roadFullAddr") ?? ""),
    addrDetail: String(formData.get("addrDetail") ?? ""),
  };

  return new Response(
    `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <title>주소 선택 완료</title>
  </head>
  <body>
    <script>
      window.opener?.postMessage(
        { type: ${JSON.stringify(JUSO_MESSAGE_TYPE)}, payload: ${JSON.stringify(payload)} },
        ${JSON.stringify(origin)}
      );
      window.close();
    </script>
  </body>
</html>`,
    {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    },
  );
}
