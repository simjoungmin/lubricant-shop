# OIL MASTER Project Coding Standards

이 문서는 OIL MASTER 프로젝트 작업 전 반드시 읽고 따라야 하는 기준이다.

## 1. 프로젝트 환경

### 프론트엔드

- Next.js 16 App Router
- React
- TypeScript
- Tailwind CSS
- TanStack Query
- 서버 컴포넌트를 기본으로 사용한다.
- 상태나 이벤트가 필요한 경우에만 `"use client"`를 사용한다.

### 백엔드

- Spring Boot
- Java 17
- Spring Data JPA
- Spring Security
- MySQL
- Gradle
- JWT 및 HttpOnly Cookie 기반 인증

## 2. 공통 작성 원칙

- 예제용 코드가 아니라 실제 서비스에 적용할 수 있는 코드로 작성한다.
- 과도한 추상화와 불필요한 디자인 패턴은 사용하지 않는다.
- 코드의 역할이 명확하도록 파일과 책임을 분리한다.
- 한 파일에 너무 많은 기능을 넣지 않는다.
- 중복 코드는 함수, 훅, 서비스 또는 유틸리티로 분리한다.
- 사용하지 않는 import, 변수, 함수는 포함하지 않는다.
- 임시 코드, 더미 코드, 주석 처리된 코드를 남기지 않는다.
- 오류를 숨기지 말고 적절하게 처리한다.
- 기존 프로젝트 구조와 명명 규칙을 최대한 유지한다.
- 전체 구조를 불필요하게 변경하지 않는다.
- 요청하지 않은 기능은 임의로 추가하지 않는다.

## 3. 이름 작성 규칙

- TypeScript 및 Java 변수와 함수는 카멜 케이스를 사용한다.
- React 컴포넌트, Java 클래스, 타입은 파스칼 케이스를 사용한다.
- MySQL 테이블과 컬럼은 스네이크 케이스를 사용한다.
- 상수는 대문자 스네이크 케이스를 사용한다.
- URL은 소문자 케밥 케이스를 사용한다.
- Boolean 변수는 의미를 알 수 있도록 `is`, `has`, `can`, `should`로 시작한다.

예시:

```text
productName
totalPrice
getProductById
handleAddToCart
ProductCard
CartContainer
MemberService
ProductResponse
member_id
product_name
created_at
API_BASE_URL
ACCESS_TOKEN_COOKIE_NAME
MAX_CART_QUANTITY
/product-detail
/order-history
/customer-service
isLoggedIn
hasStock
canPurchase
shouldShowModal
```

## 4. 프론트엔드 코드 기준

- 페이지 파일은 화면 조합과 라우팅 역할에 집중한다.
- 실제 비즈니스 로직은 컨테이너, 훅, API 파일로 분리한다.
- 재사용 가능한 UI는 컴포넌트로 분리한다.
- API 요청 코드는 컴포넌트 내부에 직접 작성하지 않는다.
- API 응답 타입을 반드시 정의한다.
- `any` 사용을 금지한다.
- 불필요한 `useEffect` 사용을 피한다.
- 계산 가능한 값은 별도의 state로 저장하지 않는다.
- 서버 상태는 TanStack Query로 관리한다.
- 전역 상태가 필요하지 않은 값은 지역 상태로 관리한다.
- props가 지나치게 많아지면 컴포넌트 책임을 다시 분리한다.
- 이벤트 함수는 `handle`로 시작한다.
- 사용자 정의 훅은 `use`로 시작한다.
- 로딩, 오류, 빈 데이터 상태를 처리한다.
- 접근성을 위해 `button`, `label`, `input`의 의미를 올바르게 사용한다.
- 이미지에는 적절한 `alt`를 작성한다.

권장 구조:

```text
app/
components/
containers/
hooks/
api/
types/
utils/
constants/
```

컴포넌트 작성 순서:

1. import
2. type 또는 interface
3. 상수
4. 컴포넌트
5. state 및 hook
6. 계산 값
7. 이벤트 함수
8. return

## 5. 백엔드 코드 기준

- Controller는 요청과 응답 처리만 담당한다.
- 비즈니스 로직은 Service에 작성한다.
- 데이터 접근은 Repository에서 처리한다.
- Entity를 API 응답으로 직접 반환하지 않는다.
- Request DTO와 Response DTO를 구분한다.
- DTO는 가능하면 record를 사용한다.
- 입력값은 Bean Validation으로 검증한다.
- 트랜잭션이 필요한 Service 메서드에 `@Transactional`을 사용한다.
- 조회 전용 메서드는 `@Transactional(readOnly = true)`를 사용한다.
- 예외는 전역 예외 처리기로 관리한다.
- 비밀번호와 토큰 등 민감한 값은 로그에 남기지 않는다.
- 비밀번호는 반드시 암호화해서 저장한다.
- 인증이 필요한 API는 토큰에서 사용자 정보를 확인한다.
- 클라이언트가 전달한 회원 ID를 그대로 신뢰하지 않는다.
- 연관관계는 필요한 경우에만 설정한다.
- 무분별한 양방향 연관관계를 피한다.
- N+1 문제를 고려한다.
- 삭제 여부와 판매 상태는 명확한 Enum 또는 Boolean으로 관리한다.

권장 구조:

```text
domain/
  product/
    controller/
    service/
    repository/
    entity/
    dto/
    exception/
```

## 6. 데이터베이스 기준

- 테이블명과 컬럼명은 스네이크 케이스를 사용한다.
- 기본키는 `{테이블명}_id` 형식을 사용한다.
- 외래키 이름은 참조 대상 기본키 이름과 맞춘다.
- 날짜 컬럼은 역할이 드러나도록 작성한다.
- 금액은 `DECIMAL`을 사용한다.
- 수량은 음수가 들어가지 않도록 검증한다.
- 이메일처럼 중복되면 안 되는 값에는 `UNIQUE` 제약조건을 사용한다.
- 자주 조회하거나 정렬하는 컬럼은 인덱스를 검토한다.
- Java 예약어와 SQL 예약어를 테이블명으로 피한다.
- `order` 대신 `orders` 또는 `customer_order`처럼 작성한다.
- Enum 값은 데이터베이스에 문자열로 저장한다.

날짜 컬럼 예시:

```text
created_at
updated_at
deleted_at
ordered_at
paid_at
```

## 7. API 작성 기준

- REST 방식으로 작성한다.
- URL에는 동사보다 자원을 사용한다.
- 복수형 또는 단수형 중 하나를 선택해 일관되게 사용한다.
- HTTP 메서드의 의미를 지킨다.
- 응답 상태 코드를 올바르게 사용한다.
- API 응답 구조를 프로젝트 전체에서 통일한다.
- 오류 응답에는 오류 코드와 사용자에게 보여줄 메시지를 포함한다.
- 내부 예외 정보와 스택 트레이스를 클라이언트에 노출하지 않는다.

API 예시:

```text
GET    /api/products
GET    /api/products/{productId}
POST   /api/products
PATCH  /api/products/{productId}
DELETE /api/products/{productId}
```

응답 상태 코드:

```text
200 OK
201 Created
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error
```

## 8. 주석 기준

- 코드만 봐도 알 수 있는 내용을 설명하지 않는다.
- 왜 그렇게 작성했는지를 설명할 때만 주석을 사용한다.
- 클래스와 주요 메서드에는 역할이 명확하지 않을 때만 주석을 작성한다.
- 모든 줄에 주석을 붙이지 않는다.
- 깨진 한글이나 의미 없는 주석을 남기지 않는다.

좋은 주석:

```java
// 결제 완료된 주문은 사용자가 직접 취소할 수 없다.
```

불필요한 주석:

```java
// 상품을 조회한다.
Product product = productRepository.findById(productId);
```
