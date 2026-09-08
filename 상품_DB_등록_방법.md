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
gear
brake-power
coolant
chemical
```

`sub_category`에는 선택한 대분류 안의 하위 카테고리 slug를 넣습니다.

예:

```text
engine + brand-engine-oil              → 엔진오일 > 브랜드별 엔진오일
engine + viscosity-engine-oil          → 엔진오일 > 점도별 엔진오일
engine + gasoline-lpg-engine-oil       → 엔진오일 > 가솔린 & LPG 엔진오일
engine + passenger-diesel-engine-oil   → 엔진오일 > 승용 디젤 엔진오일
engine + racing-bike-engine-oil        → 엔진오일 > 레이싱 및 바이크 전용
engine + drum-200l-engine-oil          → 엔진오일 > 200L 드럼 엔진오일
mission + atf                          → 자동 미션 오일 > ATF
mission + cvt                          → 자동 미션 오일 > CVT
mission + dct-dctf                     → 자동 미션 오일 > DCT DCTF
gear + gear-oil                        → 기어 오일 > 기어오일
gear + transfer-case                   → 기어 오일 > 트랜스퍼케이스
gear + haldex                          → 기어 오일 > 할덱스
brake-power + brake-fluid              → 브레이크액·파워오일 > 브레이크액
brake-power + power-oil                → 브레이크액·파워오일 > 파워오일
coolant + green                        → 부동액 > 녹색
coolant + blue                         → 부동액 > 청색
coolant + orange-pink                  → 부동액 > 주황색·분홍색
coolant + yellow                       → 부동액 > 황색
coolant + red                          → 부동액 > 적색
chemical + engine-system               → 케미컬·첨가제 > 엔진 계통
chemical + aircon-radiator             → 케미컬·첨가제 > 에어컨·라디에이터
chemical + mission-additive            → 케미컬·첨가제 > 미션첨가제
chemical + rustproof-cleaner           → 케미컬·첨가제 > 방청유·세정제
chemical + washer-fluid                → 케미컬·첨가제 > 워셔액
chemical + hydraulic-oil               → 케미컬·첨가제 > 유압유
chemical + grease                      → 케미컬·첨가제 > 그리스
```

화면 표시 이름은 아래처럼 연결됩니다.

```text
engine       → 엔진오일
mission      → 자동 미션 오일
gear         → 기어 오일
brake-power  → 브레이크액·파워오일
coolant      → 부동액
chemical     → 케미컬·첨가제
```

## 3. 서브카테고리 저장 기준

화면의 서브카테고리는 `product.sub_category` 값으로 직접 분류됩니다.

예를 들어 `엔진오일 > 브랜드별 엔진오일`에 넣을 상품은 아래처럼 저장합니다.

```text
category = engine
sub_category = brand-engine-oil
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
  sub_category,
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
  is_deleted,
  view_count,
  point_reward_rate_percent,
  created_at,
  updated_at
) VALUES (
  '지크 X7 LS 5W30 C2/C3 1박스(6L * 3개)',
  'engine',
  'brand-engine-oil',
  'ZIC',
  130000,
  100,
  '승용 디젤 차량에 사용할 수 있는 합성 엔진오일입니다.',
  '5W-30',
  'ACEA C2/C3',
  '6L * 3개',
  '/product-images/oil-bottle.svg',
  'ON_SALE',
  100000,
  false,
  0,
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

is_deleted: false 유지
view_count: 처음 등록할 때는 0
```

메인 HOT/BEST 진열은 상품 테이블이 아니라 `product_display_item` 테이블에 별도로 등록합니다.

## 7. 여러 상품 한 번에 등록하는 형태

상품 100개를 넣을 때는 `INSERT INTO product (...) VALUES`를 한 번만 쓰고, 상품 값만 쉼표로 이어서 넣으면 됩니다.

```sql
INSERT INTO product (
  product_name,
  category,
  sub_category,
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
  is_deleted,
  view_count,
  point_reward_rate_percent,
  created_at,
  updated_at
) VALUES
(
  '상품명 1',
  'engine',
  'brand-engine-oil',
  'ZIC',
  130000,
  100,
  '상품 설명',
  '5W-30',
  'ACEA C2/C3',
  '6L * 3개',
  '/product-images/oil-bottle.svg',
  'ON_SALE',
  100000,
  false,
  0,
  5.00,
  NOW(),
  NOW()
),
(
  '상품명 2',
  'mission',
  'atf',
  'Kixx',
  80000,
  100,
  '상품 설명',
  NULL,
  'ATF',
  '20L',
  '/product-images/oil-bottle.svg',
  'ON_SALE',
  72000,
  false,
  0,
  3.00,
  NOW(),
  NOW()
);
```

## 8. 메인 진열 등록 방법

서버를 실행하면 기본 진열 섹션은 자동 생성됩니다.

```text
HOT
BEST
```

상품을 메인 HOT 섹션에 1번째로 노출하려면 아래처럼 등록합니다.

```sql
INSERT INTO product_display_item (
  section_id,
  product_id,
  display_order,
  is_visible,
  starts_at,
  ends_at,
  created_at,
  updated_at
) VALUES (
  (SELECT section_id FROM product_display_section WHERE section_code = 'HOT'),
  1,
  1,
  true,
  NULL,
  NULL,
  NOW(),
  NOW()
);
```

BEST 섹션에 넣을 때는 `section_code = 'BEST'`로 바꿉니다.

## 9. 등록 후 확인 방법

상품을 넣은 뒤 아래 주소에서 확인합니다.

```text
http://localhost:3000/category
```

백엔드 API로 직접 확인하려면 아래 주소를 열면 됩니다.

```text
http://localhost:8080/api/products
```
