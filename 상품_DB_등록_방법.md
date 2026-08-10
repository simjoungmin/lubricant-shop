# 상품 DB 등록 방법

새 상품은 현재 관리자 등록 화면이 없기 때문에 DB에 직접 `INSERT` 해서 넣습니다.

## 1. 상품이 고객 화면에 보이는 조건

고객 상품 목록에는 아래 조건을 만족하는 상품만 보입니다.

```text
sale_status = 'ON_SALE'
is_deleted = false
```

즉, 상품을 넣을 때 `sale_status`는 `ON_SALE`, `is_deleted`는 `false`로 넣어야 합니다.

## 2. 카테고리 값

`category`에는 아래 값 중 하나를 넣습니다.

```text
engine
mission
brake
filter
gear
chemical
```

## 3. 서브카테고리 매칭 방법

화면의 서브카테고리는 DB의 `viscosity`, `specification`, `product_name` 값으로 자동 분류됩니다.

```text
엔진오일: viscosity 값으로 매칭
예: 5W-30, 5W-40, 0W-20, 10W-40

기어오일: viscosity 값으로 매칭
예: 75W-90, 80W-90, 85W-140

미션오일: specification 값으로 매칭
예: ATF, CVT, DCT, MTF

브레이크액: specification 값으로 매칭
예: DOT4, DOT5.1

필터: product_name에 포함된 단어로 매칭
예: 오일필터, 에어필터, 캐빈필터, 연료필터

케미컬: product_name에 포함된 단어로 매칭
예: 첨가제, 냉각수, 쿨런트, 세정제, 코팅제
```

## 4. 이미지 경로

이미지는 프론트엔드 `public` 폴더 기준 경로를 넣습니다.

예시:

```text
/product-images/oil-bottle.svg
/product-images/kixx-k3-set.svg
/product-images/filter-set.svg
```

## 5. INSERT 예시

MySQL Workbench나 DB 콘솔에서 아래 SQL을 실행하면 상품이 추가됩니다.

```sql
INSERT INTO product (
  product_name,
  category,
  brand,
  price,
  stock,
  product_description,
  viscosity,
  specification,
  volume,
  image_url,
  sale_status,
  discount_price,
  is_main_product,
  is_recommended,
  is_deleted,
  point_reward_rate_percent,
  created_at,
  updated_at
) VALUES (
  '모빌원 ESP 5W-30 1L',
  'engine',
  'Mobil',
  18000,
  100,
  '가솔린/디젤 겸용 합성 엔진오일입니다.',
  '5W-30',
  'ACEA C2/C3',
  '1L',
  '/product-images/oil-bottle.svg',
  'ON_SALE',
  NULL,
  false,
  true,
  false,
  5.00,
  NOW(),
  NOW()
);
```

## 6. 값 입력 시 주의사항

```text
price: 콤마 없이 숫자만 입력
예: 43000

stock: 재고 수량 입력
예: 50

discount_price: 할인 가격이 없으면 NULL

point_reward_rate_percent: 적립률
예: 5.00 이면 상품 금액의 5% 적립

is_main_product: 메인 대표 상품 여부
is_recommended: 추천 상품 여부
is_deleted: false 유지
```

## 7. 등록 후 확인 방법

상품을 넣은 뒤 아래 주소에서 확인합니다.

```text
http://localhost:3000/category
```

백엔드 API로 직접 확인하려면 아래 주소를 열면 됩니다.

```text
http://localhost:8080/api/products
```
