import io
B='c:/Users/tahon/DBCL/code/express_buggy/src/main/'
J=B+'java/com/campusfood/express/'
S=B+'resources/static/'
def sub(path,old,new):
    s=io.open(path,encoding='utf8',newline='').read().replace('\r\n','\n')
    assert s.count(old)==1,(path,old,s.count(old))
    s=s.replace(old,new).replace('\n','\r\n')
    io.open(path,'w',encoding='utf8',newline='').write(s)

# F-01 coupon: 1% thay vi 10%
sub(J+'service/OrderService.java','.divide(BigDecimal.valueOf(100));','.divide(BigDecimal.valueOf(1000));')
# F-02 cho huy don "Dang giao" (backend + UI)
sub(J+'service/OrderService.java','if (!"Đang xử lý".equalsIgnoreCase(order.getStatus())) {',
    'if ("Đã hoàn thành".equalsIgnoreCase(order.getStatus()) || "Đã hủy".equalsIgnoreCase(order.getStatus())) {')
sub(S+'js/app.js','const isCancelable = o.status === "Đang xử lý";','const isCancelable = o.status === "Đang xử lý" || o.status === "Đang giao";')
# F-03 regex email long
sub(J+'dto/RegisterRequest.java','@(edu\\\\.vn|vju\\\\.ac\\\\.vn)$"','@.*(edu\\\\.vn|vju\\\\.ac\\\\.vn)$"')
# F-04 so luong > 99
sub(J+'dto/CartItemRequest.java','@Max(value = 99, message','@Max(value = 999, message')
sub(S+'js/app.js','        if (item.quantity >= 99) { alert("Tối đa 99 phần cho mỗi món!"); return; }\n','')
# F-05 bo check trung SDT
sub(J+'service/AuthService.java','''        if (userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Số điện thoại đã tồn tại trong hệ thống");
        }
''','')
# F-06 loc danh muc nguoc
sub(J+'repository/ProductRepository.java','p.category.id = :categoryId','p.category.id <> :categoryId')
# F-07 khong lam rong gio sau dat hang
sub(S+'js/app.js','            localStorage.removeItem("cart");\n','')

# V-01 mat grid
sub(S+'index.html','class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"','class="flex flex-col gap-1"')
# V-02 badge gio hang vo hinh va lech vi tri
sub(S+'index.html','bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center transform translate-x-1 -translate-y-1','bg-white text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center transform translate-x-6 -translate-y-4')
# V-03 anh mon an bi meo/co lech
sub(S+'js/app.js','class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"','class="object-fill group-hover:scale-105 transition-transform duration-300" style="height:12rem;width:60%"')
# V-04 nut Huy bi khoa nhung trong nhu van hoat dong
sub(S+'js/app.js','<button disabled class="bg-gray-100 text-gray-400 px-4 py-2 rounded-xl text-xs font-semibold cursor-not-allowed">','<button disabled class="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-semibold">')

# C-01 thong bao sai ERR-AUTH-01
sub(J+'service/AuthService.java','.orElseThrow(() -> new RuntimeException("Email hoặc mật khẩu không chính xác"));','.orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));')
# C-02 don vi tien USD o the mon
sub(S+'js/app.js',"${Number(p.price).toLocaleString('vi-VN')} VNĐ</span>","${Number(p.price).toLocaleString('en-US')} USD</span>")
# C-03 nhan SDT sai
sub(S+'register.html','Số điện thoại (10 chữ số)','Số điện thoại (9 chữ số)')
# C-04 thong bao ma giam gia sai %
sub(S+'js/app.js','(Giảm 10%)!','(Giảm 15%)!')

# P-01 tim tieng Viet co dau cham
sub(J+'service/ProductService.java','        return productRepository.searchAndFilter(categoryId, keyword, sort);',
'''        if (keyword != null && !keyword.matches("\\\\A\\\\p{ASCII}*\\\\z")) {
            // Chuẩn hóa Unicode tiếng Việt (xử lý đồng bộ, chậm)
            try { Thread.sleep(3000); } catch (InterruptedException ignored) { }
        }
        return productRepository.searchAndFilter(categoryId, keyword, sort);''')
# P-02 tong tien tre 2s
sub(S+'js/app.js','''    if (document.getElementById("subtotal-val")) document.getElementById("subtotal-val").innerText = subtotal.toLocaleString('vi-VN') + " VNĐ";
    if (document.getElementById("discount-val")) document.getElementById("discount-val").innerText = "-" + discount.toLocaleString('vi-VN') + " VNĐ";
    if (document.getElementById("total-val")) document.getElementById("total-val").innerText = total.toLocaleString('vi-VN') + " VNĐ";''',
'''    setTimeout(() => {
        if (document.getElementById("subtotal-val")) document.getElementById("subtotal-val").innerText = subtotal.toLocaleString('vi-VN') + " VNĐ";
        if (document.getElementById("discount-val")) document.getElementById("discount-val").innerText = "-" + discount.toLocaleString('vi-VN') + " VNĐ";
        if (document.getElementById("total-val")) document.getElementById("total-val").innerText = total.toLocaleString('vi-VN') + " VNĐ";
    }, 2000);''')

# Cr-01 QR Demo + ghi chu trong -> NPE -> HTTP 500
sub(J+'service/OrderService.java','        BigDecimal discountAmount = BigDecimal.ZERO;',
'''        if ("QR Demo".equals(request.getPaymentMethod())) {
            // Nội dung chuyển khoản QR lấy từ ghi chú
            String transferContent = request.getNote().isEmpty() ? null : request.getNote();
            order.setNote(transferContent.toUpperCase());
        }

        BigDecimal discountAmount = BigDecimal.ZERO;''')
sub(J+'controller/OrderController.java','''        try {
            Order order = orderService.createOrder(request);
            return ResponseEntity.ok(new ApiResponse<>(true, "Đặt hàng thành công!", order));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }''','''        Order order = orderService.createOrder(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Đặt hàng thành công!", order));''')
# Cr-02 sort desc sai ten thuoc tinh -> 500
sub(J+'service/ProductService.java','sort = Sort.by(Sort.Direction.DESC, "price");','sort = Sort.by(Sort.Direction.DESC, "cost");')
print('ALL OK')
