const API_BASE = window.location.origin ? `${window.location.origin}/api` : "http://localhost:8080/api";
let currentCoupon = null; // Quản lý trạng thái mã giảm giá

// --- 1. Quản lý Giỏ hàng LocalStorage ---
function getCart() {
    return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCartUI();
}

function addToCart(product) {
    let cart = getCart();
    let item = cart.find(i => i.productId === product.id);

    if (item) {
        item.quantity += 1;
    } else {
        cart.push({
            productId: product.id,
            name: product.name,
            price: Number(product.price),
            imageUrl: product.imageUrl,
            quantity: 1
        });
    }

    saveCart(cart);
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
}

function updateQuantity(productId, delta) {
    let cart = getCart();
    let item = cart.find(i => i.productId === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity < 1) {
            cart = cart.filter(i => i.productId !== productId);
        }
    }
    saveCart(cart);
}

function removeFromCart(productId) {
    let cart = getCart().filter(i => i.productId !== productId);
    saveCart(cart);
}

function renderCartUI() {
    const cart = getCart();
    const countBadge = document.getElementById("cart-count");
    if (countBadge) countBadge.innerText = cart.reduce((sum, i) => sum + i.quantity, 0);

    const container = document.getElementById("cart-items-container");
    const checkoutSection = document.getElementById("cart-checkout-section");

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="h-64 flex flex-col items-center justify-center text-gray-400 space-y-3">
                <i data-lucide="shopping-cart" class="w-16 h-16 opacity-20"></i>
                <p>Giỏ hàng của bạn đang trống</p>
            </div>
        `;
        if (checkoutSection) checkoutSection.classList.add("hidden");
    } else {
        if (checkoutSection) checkoutSection.classList.remove("hidden");
        container.innerHTML = cart.map(item => `
            <div class="flex gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 items-center">
                <img src="${item.imageUrl || 'https://via.placeholder.com/80'}" class="w-16 h-16 object-cover rounded-lg">
                <div class="flex-1">
                    <h4 class="font-semibold text-sm leading-tight">${item.name}</h4>
                    <span class="text-orange-600 font-medium text-sm">${item.price.toLocaleString('vi-VN')} VNĐ</span>
                    <div class="flex items-center gap-2 mt-2">
                        <div class="flex items-center gap-2 border bg-white rounded-md px-2 py-0.5">
                            <button onclick="updateQuantity(${item.productId}, -1)" class="text-gray-500 hover:text-orange-500">-</button>
                            <span class="text-xs font-semibold w-4 text-center">${item.quantity}</span>
                            <button onclick="updateQuantity(${item.productId}, 1)" class="text-gray-500 hover:text-orange-500">+</button>
                        </div>
                        <button onclick="removeFromCart(${item.productId})" class="text-gray-400 hover:text-red-500 text-xs ml-auto">Xóa</button>
                    </div>
                </div>
            </div>
        `).join("");
    }

    calculateTotal();
    if (window.lucide) lucide.createIcons();
}

function toggleCartModal(show) {
    const modal = document.getElementById("cart-modal");
    if (modal) modal.classList.toggle("hidden", !show);
}

// --- 2. Áp Mã Giảm Giá & Tính Tổng Tiền ---
function applyCoupon() {
    const code = document.getElementById("coupon-code").value.trim().toUpperCase();
    const msg = document.getElementById("coupon-msg");

    if (code === "SV2026") {
        currentCoupon = { code: "SV2026", percent: 10 };
        msg.innerText = "Áp dụng mã SV2026 thành công (Giảm 15%)!";
        msg.className = "text-xs text-green-600 font-medium block";
    } else {
        currentCoupon = null;
        msg.innerText = "Mã giảm giá không hợp lệ!";
        msg.className = "text-xs text-red-500 font-medium block";
    }
    calculateTotal();
}

function calculateTotal() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discount = 0;

    if (currentCoupon) {
        discount = subtotal * (currentCoupon.percent / 100);
    }

    const total = subtotal - discount;

    setTimeout(() => {
        if (document.getElementById("subtotal-val")) document.getElementById("subtotal-val").innerText = subtotal.toLocaleString('vi-VN') + " VNĐ";
        if (document.getElementById("discount-val")) document.getElementById("discount-val").innerText = "-" + discount.toLocaleString('vi-VN') + " VNĐ";
        if (document.getElementById("total-val")) document.getElementById("total-val").innerText = total.toLocaleString('vi-VN') + " VNĐ";
    }, 2000);
}

// --- 3. Đặt hàng (Checkout) ---
async function submitOrder() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        alert("Vui lòng đăng nhập trước khi đặt hàng!");
        window.location.href = "/login.html";
        return;
    }

    const cart = getCart();
    if (cart.length === 0) { alert("Giỏ hàng đang trống!"); return; }

    const location = document.getElementById("delivery-location").value;
    const payment = document.getElementById("payment-method").value;
    const note = document.getElementById("order-note").value;

    const payload = {
        userId: user.id,
        deliveryLocation: location,
        note: note,
        paymentMethod: payment,
        couponCode: currentCoupon ? currentCoupon.code : null,
        items: cart.map(i => ({ productId: i.productId, quantity: i.quantity }))
    };

    try {
        const res = await fetch(`${API_BASE}/orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (data.success) {
            alert("Đặt hàng thành công!");
            toggleCartModal(false);
            window.location.href = "/order-history.html";
        } else {
            alert("Đặt hàng thất bại: " + data.message);
        }
    } catch (err) { alert("Có lỗi xảy ra kết nối Server!"); }
}

// --- 4. Load Danh mục & Món ăn từ Backend ---
async function loadCategories() {
    try {
        const res = await fetch(`${API_BASE}/products/categories`);
        const data = await res.json();
        if (data.success) {
            const select = document.getElementById("category-select");
            data.data.forEach(c => select.innerHTML += `<option value="${c.id}">${c.name}</option>`);
        }
    } catch (err) { console.error(err); }
}

async function loadProducts() {
    const keyword = document.getElementById("search-input")?.value || "";
    const categoryId = document.getElementById("category-select")?.value || "";
    const sortBy = document.getElementById("sort-select")?.value || "";

    let url = `${API_BASE}/products?`;
    if (keyword) url += `keyword=${encodeURIComponent(keyword)}&`;
    if (categoryId) url += `categoryId=${categoryId}&`;
    if (sortBy) url += `sortBy=${sortBy}&`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        const container = document.getElementById("product-list");
        if (!container) return;
        container.innerHTML = "";

        if (data.success && data.data.length > 0) {
            data.data.forEach(p => {
                const itemJson = JSON.stringify(p).replace(/'/g, "&apos;");
                container.innerHTML += `
                    <div class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col">
                        <div class="relative h-48 overflow-hidden group">
                            <img src="${p.imageUrl || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836'}" class="object-fill group-hover:scale-105 transition-transform duration-300" style="height:12rem;width:60%">
                            <div class="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-gray-700">
                                ${p.category ? p.category.name : 'Món ăn'}
                            </div>
                        </div>
                        <div class="p-4 flex flex-col flex-1">
                            <h3 class="font-bold text-lg text-gray-800 mb-1">${p.name}</h3>
                            <p class="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">${p.description || ''}</p>
                            <div class="flex items-center justify-between mt-auto">
                                <span class="font-bold text-orange-600 text-lg">${Number(p.price).toLocaleString('en-US')} USD</span>
                                <button onclick='addToCart(${itemJson})' class="bg-orange-100 text-orange-600 hover:bg-orange-500 hover:text-white p-2.5 rounded-xl transition-colors">
                                    <i data-lucide="plus" class="w-5 h-5"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
            if (window.lucide) lucide.createIcons();
        } else {
            container.innerHTML = `<p class="col-span-full text-center py-10 text-gray-400">Không tìm thấy món ăn nào phù hợp!</p>`;
        }
    } catch (err) { console.error(err); }
}

// --- 5. Lịch sử đơn hàng & Hủy đơn ---
async function loadOrderHistory() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) { window.location.href = "/login.html"; return; }

    try {
        const res = await fetch(`${API_BASE}/orders/user/${user.id}`);
        const data = await res.json();
        const container = document.getElementById("order-history-list");
        if (!container) return;

        if (data.success && data.data.length > 0) {
            container.innerHTML = data.data.map(o => {
                const isCancelable = o.status === "Đang xử lý" || o.status === "Đang giao";
                const statusColor = o.status === "Đang xử lý" ? "bg-amber-100 text-amber-800" :
                    o.status === "Đang giao" ? "bg-blue-100 text-blue-800" :
                        o.status === "Đã hoàn thành" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600";

                return `
                    <div class="bg-white p-5 rounded-2xl shadow-sm border border-orange-100">
                        <div class="flex justify-between items-start mb-3 border-b pb-3">
                            <div>
                                <span class="font-bold text-lg text-gray-800">Đơn hàng #${o.id}</span>
                                <p class="text-xs text-gray-500">${new Date(o.createdAt).toLocaleString('vi-VN')}</p>
                            </div>
                            <span class="px-3 py-1 rounded-full text-xs font-semibold ${statusColor}">${o.status}</span>
                        </div>
                        <div class="text-sm space-y-1 mb-3">
                            <p><strong>Địa điểm nhận:</strong> ${o.deliveryLocation}</p>
                            <p><strong>Thanh toán:</strong> ${o.paymentMethod}</p>
                            ${o.note ? `<p class="text-gray-500 italic">"Ghi chú: ${o.note}"</p>` : ''}
                        </div>
                        <div class="flex justify-between items-center border-t pt-3">
                            <div>
                                <span class="text-xs text-gray-500">Tổng tiền:</span>
                                <span class="text-base font-bold text-orange-600 block">${Number(o.totalAmount).toLocaleString('vi-VN')} VNĐ</span>
                            </div>
                            ${isCancelable ?
                        `<button onclick="cancelOrder(${o.id})" class="bg-red-50 hover:bg-red-500 text-red-600 hover:text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors">Hủy đơn hàng</button>` :
                        `<button disabled class="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-semibold">Hủy đơn hàng</button>`
                    }
                        </div>
                    </div>
                `;
            }).join("");
        } else {
            container.innerHTML = `<p class="text-center py-10 text-gray-400">Bạn chưa có đơn hàng nào!</p>`;
        }
    } catch (err) { console.error(err); }
}

async function cancelOrder(orderId) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) return;

    try {
        const res = await fetch(`${API_BASE}/orders/${orderId}/cancel?userId=${user.id}`, { method: "PUT" });
        const data = await res.json();
        if (data.success) {
            alert("Hủy đơn hàng thành công!");
            loadOrderHistory();
        } else {
            alert("Lỗi: " + data.message);
        }
    } catch (err) { alert("Lỗi hệ thống!"); }
}

// --- 6. Auth Handler (Đăng nhập / Đăng ký) ---
async function handleLogin(e) {
    e.preventDefault();
    const payload = { email: document.getElementById("email").value, password: document.getElementById("password").value };

    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
            localStorage.setItem("user", JSON.stringify(data.data));
            alert("Đăng nhập thành công!");
            window.location.href = "/index.html";
        } else {
            alert(data.message);
        }
    } catch (err) { alert("Lỗi máy chủ!"); }
}

async function handleRegister(e) {
    e.preventDefault();
    const payload = {
        fullName: document.getElementById("fullName").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        password: document.getElementById("password").value
    };

    try {
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
            alert("Đăng ký thành công! Vui lòng đăng nhập.");
            window.location.href = "/login.html";
        } else {
            alert(data.message);
        }
    } catch (err) { alert("Lỗi máy chủ!"); }
}

function checkUserLogin() {
    const user = JSON.parse(localStorage.getItem("user"));
    const userInfo = document.getElementById("user-info");
    const authBtn = document.getElementById("auth-btn");

    if (user && userInfo && authBtn) {
        userInfo.innerText = `Chào, ${user.fullName}`;
        authBtn.innerText = "Đăng xuất";
        authBtn.href = "#";
        authBtn.onclick = (e) => { e.preventDefault(); localStorage.removeItem("user"); window.location.reload(); };
    } else if (authBtn) {
        if (userInfo) userInfo.classList.add("hidden");
        authBtn.innerText = "Đăng nhập";
        authBtn.href = "/login.html";
        authBtn.onclick = null;
    }
}

// AI Consult Assistant
function handleAiConsult(e) {
    e.preventDefault();
    const query = document.getElementById("ai-query").value.trim();
    if (!query) return;

    const box = document.getElementById("ai-response-box");
    const text = document.getElementById("ai-response-text");
    box.classList.remove("hidden");

    let response = "Nếu ngân sách sinh viên tiết kiệm và cần nhanh gọn, bạn nên chọn **Cơm gà xối mỡ** hoặc **Trà sữa trân châu** nhé! Đặt ngay để lấy nóng hổi tại KTX!";
    if (query.toLowerCase().includes("mát") || query.toLowerCase().includes("nóng")) {
        response = "Trời nóng thế này chọn ngay 1 ly **Trà sữa trân châu** giải nhiệt hoặc **Phở xào bò** ăn vừa miệng nhé!";
    } else if (query.includes("30k") || query.includes("20k")) {
        response = "Với tầm giá này, **Cơm sườn nướng** (30k) hoặc **Bánh mì que** (15k) là chân chân lý luôn!";
    }

    text.innerHTML = response;
}