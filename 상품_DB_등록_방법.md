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

하위 카테고리는 `product_sub_category` 테이블에 상품별로 등록합니다.
상품 1개가 여러 하위 카테고리에 들어갈 수 있으므로, 필요한 하위 카테고리 slug를 여러 줄로 넣습니다.
이 값이 실제 카테고리 화면의 하위 메뉴 필터 기준입니다.

예를 들어 `엔진오일 > 레이싱 및 바이크 전용`에 노출할 상품은 상품명이나 설명에
`레이싱`, `바이크` 같은 단어가 없어도 됩니다. 대신 상품 등록 후 아래처럼 연결해야 합니다.

```text
category = engine
product_sub_category.sub_category = racing-bike-engine-oil
```

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

화면의 서브카테고리는 `product_sub_category.sub_category` 값으로 직접 분류됩니다.
상품명, 설명, 점도, 규격에 들어간 단어로 하위 카테고리를 자동 추정하지 않습니다.

따라서 상품을 등록한 뒤, 화면에 노출할 하위 메뉴의 slug를 `product_sub_category`에 정확히 입력해야 합니다.

예를 들어 `엔진오일 > 레이싱 및 바이크 전용`에 넣을 상품은 아래처럼 저장합니다.

```text
product_id = 10
sub_category = racing-bike-engine-oil
```

상품 하나를 여러 하위 카테고리에 노출하려면 같은 `product_id`로 여러 줄을 넣습니다.

```text
product_id = 10, sub_category = brand-engine-oil
product_id = 10, sub_category = viscosity-engine-oil
product_id = 10, sub_category = racing-bike-engine-oil
```

`엔진오일 > 브랜드별 엔진오일`은 예외적으로 `brand` 값이 있는 엔진오일 상품을 모아 보여줍니다.
브랜드 버튼을 누르면 해당 `brand` 값으로 다시 필터링됩니다.
그래도 신규 상품은 관리와 검색 일관성을 위해 가능하면 아래처럼 연결합니다.

```text
category = engine
brand = SK 지크
product_sub_category.sub_category = brand-engine-oil
```

기존 상품처럼 하위 카테고리 연결이 없으면 브랜드별 엔진오일에는 보일 수 있지만,
점도별 엔진오일, 레이싱 및 바이크 전용, 200L 드럼 엔진오일 같은 다른 하위 카테고리에는 노출되지 않습니다.

`product_sub_category` 테이블이 아직 없으면 아래 SQL로 생성합니다.

```sql
CREATE TABLE IF NOT EXISTS product_sub_category (
  product_id BIGINT NOT NULL,
  sub_category VARCHAR(120) NOT NULL,
  CONSTRAINT uk_product_sub_category UNIQUE (product_id, sub_category),
  CONSTRAINT fk_product_sub_category_product
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);
```

## 4. 이미지 경로

이미지는 프론트엔드 `public` 폴더 기준 경로를 넣습니다.
상품 이미지는 카테고리별 폴더에 넣습니다.

예시:

```text
/product-images/engine/zic_x7_ls_5w30_1l_sum.jpeg
/product-images/mission/granville_atf_lg6_fluid_20l_sum.jpeg
/product-images/gear/sample-gear-oil.jpeg
/product-images/brake-power/sample-brake-fluid.jpeg
/product-images/coolant/sample-coolant.jpeg
/product-images/chemical/sample-additive.jpeg
```

카테고리별 이미지 폴더는 아래 기준으로 사용합니다.

```text
engine       → /product-images/engine/
mission      → /product-images/mission/
gear         → /product-images/gear/
brake-power  → /product-images/brake-power/
coolant      → /product-images/coolant/
chemical     → /product-images/chemical/
```

기존 상품 이미지 파일을 카테고리 폴더로 옮겼다면 DB의 `image_url`도 함께 바꿔야 합니다.

```sql
SET SQL_SAFE_UPDATES = 0;

UPDATE product
SET image_url = CONCAT(
  '/product-images/',
  category,
  '/',
  SUBSTRING_INDEX(image_url, '/', -1)
)
WHERE image_url LIKE '/product-images/%'
  AND image_url NOT LIKE '/product-images/%/%';

SET SQL_SAFE_UPDATES = 1;
```

## 5. INSERT 예시

MySQL Workbench나 DB 콘솔에서 아래 SQL을 실행하면 상품이 추가됩니다.
`product.sub_category`는 대표 하위 카테고리 1개를 저장하는 호환용 값입니다.
여러 하위 카테고리 노출은 상품 등록 후 `product_sub_category`에 추가로 연결합니다.

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
  'passenger-diesel-engine-oil',
  'ZIC',
  130000,
  100,
  '승용 디젤 차량에 사용할 수 있는 합성 엔진오일입니다.',
  '5W-30',
  'ACEA C2/C3',
  '6L * 3개',
  '/product-images/engine/zic_x7_ls_5w30_1l_sum.jpeg',
  'ON_SALE',
  100000,
  false,
  0,
  5.00,
  NOW(),
  NOW()
);
```

위 상품을 여러 하위 카테고리에 노출하려면 상품 등록 후 `product_sub_category`에 연결 값을 추가합니다.

```sql
INSERT INTO product_sub_category (
  product_id,
  sub_category
) VALUES
(
  LAST_INSERT_ID(),
  'passenger-diesel-engine-oil'
),
(
  LAST_INSERT_ID(),
  'brand-engine-oil'
)
);
```

이미 등록된 상품에 하위 카테고리를 추가할 때는 `LAST_INSERT_ID()` 대신 실제 `product_id`를 넣습니다.

```sql
INSERT INTO product_sub_category (
  product_id,
  sub_category
) VALUES
(
  10,
  'racing-bike-engine-oil'
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
  'racing-bike-engine-oil',
  'ZIC',
  130000,
  100,
  '상품 설명',
  '5W-30',
  'ACEA C2/C3',
  '6L * 3개',
  '/product-images/engine/zic_x7_ls_5w30_1l_sum.jpeg',
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
  '/product-images/mission/granville_atf_lg6_fluid_20l_sum.jpeg',
  'ON_SALE',
  72000,
  false,
  0,
  3.00,
  NOW(),
  NOW()
);
```

여러 상품을 한 번에 넣은 뒤에는 각 상품의 `product_id`를 확인하고,
하위 카테고리 연결을 별도로 넣습니다.

```sql
INSERT INTO product_sub_category (
  product_id,
  sub_category
) VALUES
(
  10,
  'racing-bike-engine-oil'
),
(
  10,
  'brand-engine-oil'
),
(
  11,
  'atf'
);
```

## 8. 메인 진열 등록 방법

서버를 실행하면 기본 진열 섹션은 자동 생성됩니다.

```text
HOT
BEST
```

### HOT 상품 가이드

HOT 상품은 메인에서 가장 먼저 눈에 띄는 추천 영역입니다.
아래 기준에 맞는 상품을 우선 등록합니다.

```text
- 현재 판매 중인 상품
- 재고가 충분한 상품
- 할인 중이거나 가격 경쟁력이 있는 상품
- 신상품, 시즌 상품, 이벤트 상품
- 고객에게 먼저 노출하고 싶은 주력 상품
```

HOT 상품에 넣을 때는 `product.sale_status = 'ON_SALE'`, `product.is_deleted = false` 상태인지 먼저 확인합니다.
품절, 판매중지, 숨김 상품은 HOT에 등록하지 않습니다.

### BEST 상품 가이드

BEST 상품은 안정적으로 판매하거나 대표 상품으로 보여줄 상품을 등록합니다.
아래 기준에 맞는 상품을 우선 등록합니다.

```text
- 판매량이 높거나 반복 구매가 많은 상품
- 브랜드 인지도가 높은 상품
- 재고가 안정적으로 유지되는 상품
- 고객 문의나 검색 빈도가 높은 상품
- 카테고리별 대표로 보여줄 만한 상품
```

BEST 상품도 `product.sale_status = 'ON_SALE'`, `product.is_deleted = false` 상태여야 합니다.
메인에 노출되는 상품이므로 이미지 경로, 가격, 할인 가격, 재고, 브랜드, 서브카테고리를 등록 전에 확인합니다.

### 진열 등록 SQL

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
