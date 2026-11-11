# BUG MANIFEST – Campus Food Express (bản express_buggy)

Căn cứ: `02_SRS.docx` v1.1 (và `01_URD.docx` v1.1). Bản có lỗi nằm ở `code/express_buggy`.

## 1. Thống kê

Tổng số lỗi: **19** (yêu cầu ≥ 15)

| Loại | Số lỗi | Yêu cầu |
|---|---|---|
| Functional | 7 | ≥ 5 |
| Visual | 4 | ≥ 3 |
| Content | 4 | ≥ 3 |
| Performance | 2 | ≥ 2 |
| Crash | 2 | ≥ 2 |

Mức độ: Critical = 2, Major = 10, Minor = 7 → Critical + Major = **12** (yêu cầu ≥ 3).

## 2. Danh sách tóm tắt

| ID | Loại | Mức độ | Tiêu đề | Yêu cầu SRS bị vi phạm | Vị trí |
|---|---|---|---|---|---|
| F-01 | Functional | Critical | Mã SV2026 chỉ giảm 1% ở backend thay vì 10% | BUS-COUPON / FR-CART-02 (UC-ORDER-01): mã SV2026 giảm 10% | `src/main/java/com/campusfood/express/service/OrderService.java:66 (chia 1000 thay vì 100)` |
| F-02 | Functional | Major | Cho phép hủy đơn ở trạng thái "Đang giao" | DIS-BTN-CANCEL / UC-ORDER-02 (luồng thay thế) / FR-ORDER-03: chỉ hủy được khi "Đang xử lý" | `src/main/java/com/campusfood/express/service/OrderService.java:92 ; src/main/resources/static/js/app.js:250` |
| F-03 | Functional | Major | Validate email trường bị lỏng: nhận email có đuôi edu.vn ở bất kỳ vị trí | VAL-EMAIL-01 / FR-AUTH-01: email phải có đuôi @edu.vn hoặc @vju.ac.vn | `src/main/java/com/campusfood/express/dto/RegisterRequest.java:14 (regex thêm ".*")` |
| F-04 | Functional | Major | Cho phép số lượng món vượt 99 | BUS-CART-01 / Ràng buộc 3.4: số lượng 1-99 mỗi món | `src/main/java/com/campusfood/express/dto/CartItemRequest.java:12 (@Max 999) ; src/main/resources/static/js/app.js:19 (bỏ chặn 99) và :38 (updateQuantity không chặn)` |
| F-05 | Functional | Major | Không kiểm tra trùng SĐT khi đăng ký | BUS-AUTH-01 / ERR-AUTH-02: Email & SĐT không được trùng, báo "Email hoặc Số điện thoại đã tồn tại trong hệ thống" | `src/main/java/com/campusfood/express/service/AuthService.java:17-19 (đã xóa existsByPhone)` |
| F-06 | Functional | Major | Bộ lọc danh mục trả về món của các danh mục khác | FR-CATALOG-01 / URD 3.3: lọc sản phẩm theo danh mục | `src/main/java/com/campusfood/express/repository/ProductRepository.java:15 (= đổi thành <>)` |
| F-07 | Functional | Major | Đặt hàng thành công nhưng giỏ hàng không được làm rỗng | UC-ORDER-01 bước 5 + Hậu điều kiện: giỏ hàng bị làm trống sau khi đặt hàng thành công | `src/main/resources/static/js/app.js:166-169 (đã xóa localStorage.removeItem("cart"))` |
| V-01 | Visual | Major | Danh sách món không còn dạng lưới (Grid), xếp thành một cột | NFR 3.1 / URD mục 4: trang chủ dùng Grid layout cho danh sách món | `src/main/resources/static/index.html:134 (grid... đổi thành flex flex-col)` |
| V-02 | Visual | Major | Badge số lượng giỏ hàng vô hình và lệch khỏi biểu tượng giỏ | NFR 3.1 / URD mục 4: giỏ hàng có badge số lượng hiển thị real-time | `src/main/resources/static/index.html:35 (nền trắng + chữ trắng, translate-x-6 -translate-y-4)` |
| V-03 | Visual | Minor | Ảnh thumbnail món ăn bị méo và chỉ rộng 60% thẻ | URD mục 4: mỗi món có ảnh thumbnail trong lưới | `src/main/resources/static/js/app.js:212 (object-fill, width:60%, height:12rem)` |
| V-04 | Visual | Minor | Nút Hủy đơn ở trạng thái bị khóa vẫn hiển thị đỏ như đang hoạt động | DIS-BTN-CANCEL / REQ-08: nút Hủy phải mờ/ẩn khi đơn không ở "Đang xử lý" | `src/main/resources/static/js/app.js:276 (class bg-red-50 text-red-600, bỏ cursor-not-allowed)` |
| C-01 | Content | Minor | Thông báo đăng nhập sai (email không tồn tại) lệch với bảng mã lỗi | ERR-AUTH-01: "Email hoặc mật khẩu không chính xác" | `src/main/java/com/campusfood/express/service/AuthService.java:33` |
| C-02 | Content | Minor | Giá món hiển thị bằng USD thay vì VNĐ | Ràng buộc 3.4 / URD mục 4: đơn vị tiền tệ hiển thị là VNĐ | `src/main/resources/static/js/app.js:221 (en-US + "USD")` |
| C-03 | Content | Minor | Nhãn ô SĐT ghi "9 chữ số" trong khi yêu cầu đúng 10 chữ số | Bảng 2-3 SRS: SĐT đúng 10 chữ số | `src/main/resources/static/register.html:25` |
| C-04 | Content | Minor | Thông báo áp mã giảm giá ghi sai mức giảm 15% | BUS-COUPON: mã SV2026 giảm 10% | `src/main/resources/static/js/app.js:106` |
| P-01 | Performance | Major | Tìm kiếm từ khóa tiếng Việt có dấu mất hơn 3 giây | NFR-PERF-01: tìm kiếm Unicode tiếng Việt trả kết quả < 2s | `src/main/java/com/campusfood/express/service/ProductService.java:35 (Thread.sleep(3000))` |
| P-02 | Performance | Minor | Tổng tiền trong giỏ cập nhật trễ 2 giây | NFR-PERF-02: tự động tính tổng tiền realtime, không có độ trễ | `src/main/resources/static/js/app.js:127 (setTimeout 2000 quanh phần cập nhật Tạm tính/Giảm giá/Tổng tiền)` |
| Cr-01 | Crash | Critical | Đặt hàng bằng QR Demo với ghi chú để trống gây lỗi 500 | UC-ORDER-01 / BUS-ORDER: chọn PT thanh toán "QR Demo" hợp lệ và đặt hàng thành công; luồng thay thế phải trả cảnh báo, không lỗi server | `src/main/java/com/campusfood/express/service/OrderService.java:56-57 (NPE do transferContent null) ; src/main/java/com/campusfood/express/controller/OrderController.java:25 (bỏ try/catch)` |
| Cr-02 | Crash | Major | Sắp xếp "Giá: Cao đến Thấp" làm API lỗi 500, danh sách món biến mất | URD 3.3 / FR-CATALOG-01: sắp xếp danh sách món theo giá giảm dần | `src/main/java/com/campusfood/express/service/ProductService.java:30 (sai tên thuộc tính "cost")` |

## 3. Chi tiết từng lỗi

### F-01 – Mã SV2026 chỉ giảm 1% ở backend thay vì 10%

- **Loại / Mức độ:** Functional / Critical
- **Yêu cầu SRS vi phạm:** BUS-COUPON / FR-CART-02 (UC-ORDER-01): mã SV2026 giảm 10%
- **Vị trí mã nguồn:** `src/main/java/com/campusfood/express/service/OrderService.java:66 (chia 1000 thay vì 100)`
- **Các bước tái hiện:** 1) Gọi POST /api/orders với couponCode=SV2026, 2 x Cơm gà xối mỡ (70.000đ). 2) Xem discountAmount/totalAmount.
- **Kết quả mong đợi (theo SRS):** discountAmount = 7.000; totalAmount = 63.000
- **Kết quả thực tế:** discountAmount = 700; totalAmount = 69.300. UI giỏ hàng vẫn hiện giảm 10% nên số tiền hiển thị khác số tiền lưu đơn.
- **Bằng chứng:** `evidence/api_repro_log.txt [F-01]`; `evidence/bugs_source.diff`; `evidence/shot_order_history.png (đơn #1 Tổng 69.300 VNĐ)`
- **Mức xác minh:** Chạy thật

### F-02 – Cho phép hủy đơn ở trạng thái "Đang giao"

- **Loại / Mức độ:** Functional / Major
- **Yêu cầu SRS vi phạm:** DIS-BTN-CANCEL / UC-ORDER-02 (luồng thay thế) / FR-ORDER-03: chỉ hủy được khi "Đang xử lý"
- **Vị trí mã nguồn:** `src/main/java/com/campusfood/express/service/OrderService.java:92 ; src/main/resources/static/js/app.js:250`
- **Các bước tái hiện:** 1) Có đơn trạng thái "Đang giao". 2) Mở Lịch sử đơn hàng: nút Hủy sáng. 3) Bấm Hủy (hoặc PUT /api/orders/{id}/cancel?userId=1).
- **Kết quả mong đợi (theo SRS):** Nút Hủy bị mờ/ẩn; API từ chối, báo trạng thái không hợp lệ
- **Kết quả thực tế:** Nút Hủy hoạt động; API trả HTTP 200 "Hủy đơn hàng thành công", trạng thái thành "Đã hủy".
- **Bằng chứng:** `evidence/api_repro_log.txt [F-02]`; `evidence/shot_order_history.png (đơn #5 Đang giao vẫn có nút Hủy)`; `evidence/bugs_source.diff`
- **Mức xác minh:** Chạy thật

### F-03 – Validate email trường bị lỏng: nhận email có đuôi edu.vn ở bất kỳ vị trí

- **Loại / Mức độ:** Functional / Major
- **Yêu cầu SRS vi phạm:** VAL-EMAIL-01 / FR-AUTH-01: email phải có đuôi @edu.vn hoặc @vju.ac.vn
- **Vị trí mã nguồn:** `src/main/java/com/campusfood/express/dto/RegisterRequest.java:14 (regex thêm ".*")`
- **Các bước tái hiện:** 1) POST /api/auth/register với email hacker@gmail.com.edu.vn (hoặc x@notedu.vn). 2) Quan sát phản hồi.
- **Kết quả mong đợi (theo SRS):** HTTP 400, thông báo "Email phải đúng định dạng sinh viên (*@edu.vn hoặc *@vju.ac.vn)"
- **Kết quả thực tế:** Validate tầng ứng dụng bị vượt qua; request chỉ bị chặn bởi CHECK constraint của DB và trả nguyên văn lỗi SQL "Check constraint chk_email_domain is violated" cho người dùng.
- **Bằng chứng:** `evidence/api_repro_log.txt [F-03], [F-03b]`; `evidence/bugs_source.diff`
- **Mức xác minh:** Chạy thật (biểu hiện bị DB che một phần)

### F-04 – Cho phép số lượng món vượt 99

- **Loại / Mức độ:** Functional / Major
- **Yêu cầu SRS vi phạm:** BUS-CART-01 / Ràng buộc 3.4: số lượng 1-99 mỗi món
- **Vị trí mã nguồn:** `src/main/java/com/campusfood/express/dto/CartItemRequest.java:12 (@Max 999) ; src/main/resources/static/js/app.js:19 (bỏ chặn 99) và :38 (updateQuantity không chặn)`
- **Các bước tái hiện:** 1) Thêm món vào giỏ, bấm nút + liên tục quá 99 (hoặc gọi API quantity=100). 2) Xác nhận đặt hàng.
- **Kết quả mong đợi (theo SRS):** Giỏ chặn ở 99; API trả 400 "Số lượng tối đa là 99"
- **Kết quả thực tế:** Giỏ cho phép 100+; API trả HTTP 500 Internal Server Error (CHECK chk_quantity_range của DB chặn), UI báo "Đặt hàng thất bại: undefined".
- **Bằng chứng:** `evidence/api_repro_log.txt [F-04]`; `evidence/bugs_source.diff`
- **Mức xác minh:** Chạy thật (API); UI đối chiếu mã nguồn

### F-05 – Không kiểm tra trùng SĐT khi đăng ký

- **Loại / Mức độ:** Functional / Major
- **Yêu cầu SRS vi phạm:** BUS-AUTH-01 / ERR-AUTH-02: Email & SĐT không được trùng, báo "Email hoặc Số điện thoại đã tồn tại trong hệ thống"
- **Vị trí mã nguồn:** `src/main/java/com/campusfood/express/service/AuthService.java:17-19 (đã xóa existsByPhone)`
- **Các bước tái hiện:** 1) Đăng ký với SĐT 0123456789 (đã thuộc user 1) và email mới. 2) Quan sát thông báo.
- **Kết quả mong đợi (theo SRS):** Bị chặn bằng thông báo ERR-AUTH-02
- **Kết quả thực tế:** Qua bước kiểm tra nghiệp vụ, chỉ bị UNIQUE của DB chặn; người dùng thấy nguyên văn lỗi SQL "Duplicate entry '0123456789' for key users.phone".
- **Bằng chứng:** `evidence/api_repro_log.txt [F-05]`; `evidence/bugs_source.diff`
- **Mức xác minh:** Chạy thật

### F-06 – Bộ lọc danh mục trả về món của các danh mục khác

- **Loại / Mức độ:** Functional / Major
- **Yêu cầu SRS vi phạm:** FR-CATALOG-01 / URD 3.3: lọc sản phẩm theo danh mục
- **Vị trí mã nguồn:** `src/main/java/com/campusfood/express/repository/ProductRepository.java:15 (= đổi thành <>)`
- **Các bước tái hiện:** 1) Trang chủ, chọn danh mục "Cơm" ở ô lọc (hoặc GET /api/products?categoryId=1).
- **Kết quả mong đợi (theo SRS):** Chỉ hiện Cơm gà xối mỡ, Cơm sườn nướng
- **Kết quả thực tế:** Hiện 6 món thuộc Bún/Phở, Đồ uống, Ăn vặt; không có món Cơm nào.
- **Bằng chứng:** `evidence/api_repro_log.txt [F-06]`; `evidence/bugs_source.diff`
- **Mức xác minh:** Chạy thật

### F-07 – Đặt hàng thành công nhưng giỏ hàng không được làm rỗng

- **Loại / Mức độ:** Functional / Major
- **Yêu cầu SRS vi phạm:** UC-ORDER-01 bước 5 + Hậu điều kiện: giỏ hàng bị làm trống sau khi đặt hàng thành công
- **Vị trí mã nguồn:** `src/main/resources/static/js/app.js:166-169 (đã xóa localStorage.removeItem("cart"))`
- **Các bước tái hiện:** 1) Thêm món, đăng nhập, bấm Xác nhận đặt hàng thành công. 2) Quay lại trang chủ, mở giỏ hàng.
- **Kết quả mong đợi (theo SRS):** Giỏ trống, badge = 0
- **Kết quả thực tế:** Giỏ vẫn còn nguyên món và badge giữ số cũ; bấm đặt tiếp sẽ tạo đơn trùng.
- **Bằng chứng:** `evidence/bugs_source.diff (khối app.js @@ -165)`
- **Mức xác minh:** Đối chiếu mã nguồn

### V-01 – Danh sách món không còn dạng lưới (Grid), xếp thành một cột

- **Loại / Mức độ:** Visual / Major
- **Yêu cầu SRS vi phạm:** NFR 3.1 / URD mục 4: trang chủ dùng Grid layout cho danh sách món
- **Vị trí mã nguồn:** `src/main/resources/static/index.html:134 (grid... đổi thành flex flex-col)`
- **Các bước tái hiện:** 1) Mở trang chủ ở màn hình rộng 1280px.
- **Kết quả mong đợi (theo SRS):** Các thẻ món xếp 3 cột
- **Kết quả thực tế:** Mỗi thẻ chiếm trọn một hàng, trang dài bất thường, nhiều khoảng trắng.
- **Bằng chứng:** `evidence/shot_index_home.png`
- **Mức xác minh:** Chạy thật

### V-02 – Badge số lượng giỏ hàng vô hình và lệch khỏi biểu tượng giỏ

- **Loại / Mức độ:** Visual / Major
- **Yêu cầu SRS vi phạm:** NFR 3.1 / URD mục 4: giỏ hàng có badge số lượng hiển thị real-time
- **Vị trí mã nguồn:** `src/main/resources/static/index.html:35 (nền trắng + chữ trắng, translate-x-6 -translate-y-4)`
- **Các bước tái hiện:** 1) Thêm 3 sản phẩm vào giỏ. 2) Nhìn biểu tượng giỏ trên thanh điều hướng.
- **Kết quả mong đợi (theo SRS):** Badge đỏ, chữ trắng hiển thị số 3 sát biểu tượng giỏ
- **Kết quả thực tế:** Không thấy badge (chữ trắng trên nền trắng), vị trí lệch ra ngoài biểu tượng.
- **Bằng chứng:** `evidence/shot_index_home.png (giỏ có 3 sản phẩm nhưng không có badge)`
- **Mức xác minh:** Chạy thật

### V-03 – Ảnh thumbnail món ăn bị méo và chỉ rộng 60% thẻ

- **Loại / Mức độ:** Visual / Minor
- **Yêu cầu SRS vi phạm:** URD mục 4: mỗi món có ảnh thumbnail trong lưới
- **Vị trí mã nguồn:** `src/main/resources/static/js/app.js:212 (object-fill, width:60%, height:12rem)`
- **Các bước tái hiện:** 1) Mở trang chủ và xem ảnh món ăn.
- **Kết quả mong đợi (theo SRS):** Ảnh phủ kín khung, đúng tỉ lệ (object-cover)
- **Kết quả thực tế:** Ảnh bị kéo giãn méo, chỉ chiếm 60% bề ngang thẻ, lệch trái.
- **Bằng chứng:** `evidence/shot_index_home.png`
- **Mức xác minh:** Chạy thật

### V-04 – Nút Hủy đơn ở trạng thái bị khóa vẫn hiển thị đỏ như đang hoạt động

- **Loại / Mức độ:** Visual / Minor
- **Yêu cầu SRS vi phạm:** DIS-BTN-CANCEL / REQ-08: nút Hủy phải mờ/ẩn khi đơn không ở "Đang xử lý"
- **Vị trí mã nguồn:** `src/main/resources/static/js/app.js:276 (class bg-red-50 text-red-600, bỏ cursor-not-allowed)`
- **Các bước tái hiện:** 1) Mở Lịch sử đơn hàng có đơn "Đã hoàn thành"/"Đã hủy".
- **Kết quả mong đợi (theo SRS):** Nút Hủy màu xám mờ, con trỏ cấm
- **Kết quả thực tế:** Nút Hủy màu đỏ y hệt đơn đang xử lý (chỉ khác là bấm không phản hồi), gây hiểu nhầm.
- **Bằng chứng:** `evidence/shot_order_history.png (đơn #4 Đã hoàn thành, #2 Đã hủy)`
- **Mức xác minh:** Chạy thật

### C-01 – Thông báo đăng nhập sai (email không tồn tại) lệch với bảng mã lỗi

- **Loại / Mức độ:** Content / Minor
- **Yêu cầu SRS vi phạm:** ERR-AUTH-01: "Email hoặc mật khẩu không chính xác"
- **Vị trí mã nguồn:** `src/main/java/com/campusfood/express/service/AuthService.java:33`
- **Các bước tái hiện:** 1) Đăng nhập với email chưa đăng ký.
- **Kết quả mong đợi (theo SRS):** "Email hoặc mật khẩu không chính xác"
- **Kết quả thực tế:** "Tài khoản không tồn tại" (đồng thời lộ thông tin email nào đã đăng ký).
- **Bằng chứng:** `evidence/api_repro_log.txt [C-01]`; `evidence/bugs_source.diff`
- **Mức xác minh:** Chạy thật

### C-02 – Giá món hiển thị bằng USD thay vì VNĐ

- **Loại / Mức độ:** Content / Minor
- **Yêu cầu SRS vi phạm:** Ràng buộc 3.4 / URD mục 4: đơn vị tiền tệ hiển thị là VNĐ
- **Vị trí mã nguồn:** `src/main/resources/static/js/app.js:221 (en-US + "USD")`
- **Các bước tái hiện:** 1) Mở trang chủ, xem giá trên thẻ món.
- **Kết quả mong đợi (theo SRS):** 35.000 VNĐ
- **Kết quả thực tế:** 35,000 USD (trong giỏ hàng vẫn là VNĐ nên không nhất quán).
- **Bằng chứng:** `evidence/shot_index_home.png`
- **Mức xác minh:** Chạy thật

### C-03 – Nhãn ô SĐT ghi "9 chữ số" trong khi yêu cầu đúng 10 chữ số

- **Loại / Mức độ:** Content / Minor
- **Yêu cầu SRS vi phạm:** Bảng 2-3 SRS: SĐT đúng 10 chữ số
- **Vị trí mã nguồn:** `src/main/resources/static/register.html:25`
- **Các bước tái hiện:** 1) Mở trang Đăng ký, đọc nhãn ô SĐT.
- **Kết quả mong đợi (theo SRS):** "Số điện thoại (10 chữ số)"
- **Kết quả thực tế:** "Số điện thoại (9 chữ số)", mâu thuẫn với placeholder 0987654321 và pattern 10 số.
- **Bằng chứng:** `evidence/shot_register.png`
- **Mức xác minh:** Chạy thật

### C-04 – Thông báo áp mã giảm giá ghi sai mức giảm 15%

- **Loại / Mức độ:** Content / Minor
- **Yêu cầu SRS vi phạm:** BUS-COUPON: mã SV2026 giảm 10%
- **Vị trí mã nguồn:** `src/main/resources/static/js/app.js:106`
- **Các bước tái hiện:** 1) Mở giỏ hàng, nhập SV2026, bấm Áp dụng.
- **Kết quả mong đợi (theo SRS):** "Áp dụng mã SV2026 thành công (Giảm 10%)!"
- **Kết quả thực tế:** "... (Giảm 15%)!" trong khi số tiền giảm tính theo 10%.
- **Bằng chứng:** `evidence/bugs_source.diff (khối app.js @@ -104)`
- **Mức xác minh:** Đối chiếu mã nguồn

### P-01 – Tìm kiếm từ khóa tiếng Việt có dấu mất hơn 3 giây

- **Loại / Mức độ:** Performance / Major
- **Yêu cầu SRS vi phạm:** NFR-PERF-01: tìm kiếm Unicode tiếng Việt trả kết quả < 2s
- **Vị trí mã nguồn:** `src/main/java/com/campusfood/express/service/ProductService.java:35 (Thread.sleep(3000))`
- **Các bước tái hiện:** 1) Gõ "phở" vào ô tìm kiếm (hoặc GET /api/products?keyword=phở). 2) Đo thời gian.
- **Kết quả mong đợi (theo SRS):** < 2 giây
- **Kết quả thực tế:** ~3,03 giây (từ khóa "pho" không dấu chỉ 0,03 giây). Gõ mỗi ký tự có dấu đều bị treo ~3 giây.
- **Bằng chứng:** `evidence/api_repro_log.txt [P-01]`; `evidence/bugs_source.diff`
- **Mức xác minh:** Chạy thật (đo thời gian)

### P-02 – Tổng tiền trong giỏ cập nhật trễ 2 giây

- **Loại / Mức độ:** Performance / Minor
- **Yêu cầu SRS vi phạm:** NFR-PERF-02: tự động tính tổng tiền realtime, không có độ trễ
- **Vị trí mã nguồn:** `src/main/resources/static/js/app.js:127 (setTimeout 2000 quanh phần cập nhật Tạm tính/Giảm giá/Tổng tiền)`
- **Các bước tái hiện:** 1) Mở giỏ hàng, bấm + tăng số lượng hoặc áp mã SV2026. 2) Quan sát dòng Tổng tiền.
- **Kết quả mong đợi (theo SRS):** Tổng tiền đổi ngay lập tức
- **Kết quả thực tế:** Số lượng đổi ngay nhưng Tạm tính/Giảm giá/Tổng tiền đổi sau ~2 giây, thời gian đó người dùng có thể thấy số cũ và đặt hàng.
- **Bằng chứng:** `evidence/bugs_source.diff (khối app.js @@ -125)`
- **Mức xác minh:** Đối chiếu mã nguồn

### Cr-01 – Đặt hàng bằng QR Demo với ghi chú để trống gây lỗi 500

- **Loại / Mức độ:** Crash / Critical
- **Yêu cầu SRS vi phạm:** UC-ORDER-01 / BUS-ORDER: chọn PT thanh toán "QR Demo" hợp lệ và đặt hàng thành công; luồng thay thế phải trả cảnh báo, không lỗi server
- **Vị trí mã nguồn:** `src/main/java/com/campusfood/express/service/OrderService.java:56-57 (NPE do transferContent null) ; src/main/java/com/campusfood/express/controller/OrderController.java:25 (bỏ try/catch)`
- **Các bước tái hiện:** 1) Thêm món, chọn "Chuyển khoản QR Demo", để trống ghi chú. 2) Bấm Xác nhận đặt hàng.
- **Kết quả mong đợi (theo SRS):** Đặt hàng thành công
- **Kết quả thực tế:** API trả HTTP 500 (NullPointerException), UI báo "Đặt hàng thất bại: undefined"; không tạo đơn.
- **Bằng chứng:** `evidence/api_repro_log.txt [Cr-01]`; `evidence/bugs_source.diff`
- **Mức xác minh:** Chạy thật

### Cr-02 – Sắp xếp "Giá: Cao đến Thấp" làm API lỗi 500, danh sách món biến mất

- **Loại / Mức độ:** Crash / Major
- **Yêu cầu SRS vi phạm:** URD 3.3 / FR-CATALOG-01: sắp xếp danh sách món theo giá giảm dần
- **Vị trí mã nguồn:** `src/main/java/com/campusfood/express/service/ProductService.java:30 (sai tên thuộc tính "cost")`
- **Các bước tái hiện:** 1) Trang chủ, chọn "Giá: Cao đến Thấp" (hoặc GET /api/products?sortBy=desc).
- **Kết quả mong đợi (theo SRS):** Danh sách sắp xếp giá giảm dần
- **Kết quả thực tế:** API trả HTTP 500 (PropertyReferenceException); UI hiện "Không tìm thấy món ăn nào phù hợp!" dù có đủ món.
- **Bằng chứng:** `evidence/api_repro_log.txt [Cr-02]`; `evidence/bugs_source.diff`
- **Mức xác minh:** Chạy thật

## 4. Bằng chứng và cách tái hiện

- `evidence/api_repro_log.txt`: log request/response thật khi chạy bản lỗi (cổng 8081, DB riêng `campus_food_express_buggy`, không đụng DB gốc).
- `evidence/shot_index_home.png`, `shot_order_history.png`, `shot_register.png`: ảnh chụp giao diện (Chrome headless).
- `evidence/bugs_source.diff`: diff giữa bản gốc và bản lỗi (đối chiếu từng lỗi). `evidence/inject_bugs.py`: script chèn lỗi.
- Chạy lại: nạp `campus_food_express.sql` (đổi tên DB), rồi `./mvnw spring-boot:run "-Dspring-boot.run.arguments=--server.port=8081 --spring.datasource.url=jdbc:mysql://localhost:3306/campus_food_express_buggy?useSSL=false&serverTimezone=UTC&characterEncoding=UTF-8"`.

## 5. Lưu ý trung thực

- 4 lỗi (F-04 phần UI, F-07, C-04, P-02) xác minh bằng đối chiếu mã nguồn/diff, chưa chụp ảnh hay log chạy thật.
- F-03, F-04, F-05 bị các ràng buộc CHECK/UNIQUE của DB che một phần ở tầng API: lỗi vẫn tồn tại ở tầng ứng dụng nhưng biểu hiện là lộ lỗi SQL hoặc HTTP 500.
- Bản gốc có sẵn một lỗi môi trường không tính vào danh sách: DB trỏ ảnh `/images/*.jpg` nhưng file nằm ở gốc `static`, nên ảnh món bị 404. Ở bản lỗi đã copy ảnh vào `static/images` để ảnh hiển thị và các lỗi Visual quan sát được.
- Bản gốc cũng có sẵn một số điểm lệch SRS không tính vào danh sách (ví dụ mật khẩu lưu rõ trong DB, lệch câu chữ ERR-AUTH-02, vài thông báo validate khác ERR-VAL-01).
