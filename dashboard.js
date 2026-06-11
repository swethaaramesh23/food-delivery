/* ==========================================================================
   Stackly - Dashboard Operations Script
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================================================
    // 1. Preloader (Strict 2.5s Delay)
    // ==========================================================================
    const preloader = document.getElementById("preloader");
    
    setTimeout(() => {
        if (preloader) {
            preloader.style.opacity = "0";
            preloader.style.visibility = "hidden";
        }
    }, 2500);

    // ==========================================================================
    // 2. Session Initialization & Profile Synchronizer
    // ==========================================================================
    let currentUser = JSON.parse(localStorage.getItem("stackly_user"));
    
    if (!currentUser) {
        currentUser = {
            email: "admin@bitecraft.com",
            name: "Jonathan Bite",
            role: "Admin"
        };
        localStorage.setItem("stackly_user", JSON.stringify(currentUser));
    }

    const sidebarName = document.getElementById("sidebar-name");
    const sidebarRole = document.getElementById("sidebar-role");
    const sidebarAvatar = document.getElementById("sidebar-avatar");
    const topbarUserName = document.getElementById("topbar-user-name");
    const profileNameText = document.getElementById("profile-name-text");
    
    if (sidebarName) sidebarName.innerText = currentUser.name;
    if (sidebarRole) sidebarRole.innerText = currentUser.role;
    if (topbarUserName) topbarUserName.innerText = currentUser.name.split(" ")[0];
    if (profileNameText) profileNameText.innerText = currentUser.name;
    
    if (sidebarAvatar) {
        if (currentUser.role === "Admin") {
            sidebarAvatar.setAttribute("src", "image/chef3.webp");
        } else if (currentUser.role === "Staff") {
            sidebarAvatar.setAttribute("src", "image/chef2.webp");
        } else if (currentUser.role === "Delivery Partner") {
            sidebarAvatar.setAttribute("src", "image/chef2.webp");
        } else {
            sidebarAvatar.setAttribute("src", "image/chef1.webp");
        }
        
        const bigAvatar = document.getElementById("profile-avatar-big");
        if (bigAvatar) {
            bigAvatar.setAttribute("src", sidebarAvatar.getAttribute("src"));
        }
    }

    // ==========================================================================
    // 3. Sidebar Collapsibility & Mobile Hamburgers
    // ==========================================================================
    const sidebar = document.getElementById("sidebar");
    const sidebarToggle = document.getElementById("sidebar-toggle");
    const dashHamburger = document.getElementById("dashboard-hamburger");
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener("click", () => {
            sidebar.classList.toggle("collapsed");
            document.body.classList.toggle("sidebar-collapsed");
            
            const icon = sidebarToggle.querySelector("i");
            if (sidebar.classList.contains("collapsed")) {
                icon.className = "fa-solid fa-angles-right";
            } else {
                icon.className = "fa-solid fa-angles-left";
            }
        });
    }

    if (dashHamburger && sidebar) {
        dashHamburger.addEventListener("click", () => {
            sidebar.classList.toggle("open");
        });
        
        document.addEventListener("click", (e) => {
            if (window.innerWidth <= 991) {
                if (!sidebar.contains(e.target) && e.target !== dashHamburger && !dashHamburger.contains(e.target)) {
                    sidebar.classList.remove("open");
                }
            }
        });
    }

    // ==========================================================================
    // 4. Simulated Shared Database (stackly_orders)
    // ==========================================================================
    let orders = JSON.parse(localStorage.getItem("stackly_orders"));
    
    const defaultOrders = [
        { id: "#BC-9844", customer: "Jane Doe", items: "Spicy Pepperoni Pizza x1, Soda Drink x1", address: "742 Evergreen Terrace, Springfield, NY", price: 16.99, status: "delivered", time: "10 Jun 2026, 03:30 PM" },
        { id: "#BC-9845", customer: "Marcus Vance", items: "Cheesy Beef Burger x2, Fries x1", address: "Empire State, New York, NY", price: 24.50, status: "preparing", time: "10 Jun 2026, 04:10 PM" },
        { id: "#BC-9846", customer: "Helena Rose", items: "Vegan Margherita Pizza x1, Veggie Salad Bowl x1", address: "100 Broadway, New York, NY", price: 21.98, status: "pending", time: "10 Jun 2026, 04:18 PM" },
        { id: "#BC-9847", customer: "Tony Stark", items: "Gourmet Grilled Salmon x1, Atlantic Salmon x1", address: "Stark Tower, New York, NY", price: 38.98, status: "delivery", time: "10 Jun 2026, 04:22 PM" }
    ];

    if (!orders) {
        orders = defaultOrders;
        localStorage.setItem("stackly_orders", JSON.stringify(orders));
    }

    function saveOrders() {
        localStorage.setItem("stackly_orders", JSON.stringify(orders));
    }

    // ==========================================================================
    // 5. Admin Chart Renderings (Chart.js)
    // ==========================================================================
    const salesCtx = document.getElementById("salesTrendChart");
    const categoryCtx = document.getElementById("categoryChart");
    
    if (salesCtx) {
        new Chart(salesCtx, {
            type: "line",
            data: {
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                datasets: [
                    {
                        label: "Revenue ($)",
                        data: [4200, 5800, 5100, 7200, 8900, 9600],
                        borderColor: "#FF6B35",
                        backgroundColor: "rgba(255, 107, 53, 0.05)",
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        yAxisID: "y"
                    },
                    {
                        label: "Orders Count",
                        data: [210, 290, 260, 360, 440, 480],
                        borderColor: "#1A1A1A",
                        backgroundColor: "transparent",
                        borderWidth: 2,
                        tension: 0.1,
                        yAxisID: "y1"
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: "top" }
                },
                scales: {
                    y: {
                        type: "linear",
                        display: true,
                        position: "left",
                        grid: { drawOnChartArea: true }
                    },
                    y1: {
                        type: "linear",
                        display: true,
                        position: "right",
                        grid: { drawOnChartArea: false }
                    }
                }
            }
        });
    }

    if (categoryCtx) {
        new Chart(categoryCtx, {
            type: "doughnut",
            data: {
                labels: ["Pizza", "Burgers", "Seafood", "Salads"],
                datasets: [{
                    data: [40, 35, 15, 10],
                    backgroundColor: ["#FF6B35", "#FFB800", "#007AFF", "#4CD964"],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: "bottom" }
                }
            }
        });
    }

    const adminRecentRows = document.getElementById("admin-recent-orders-rows");
    if (adminRecentRows) {
        adminRecentRows.innerHTML = "";
        orders.slice(0, 3).forEach(o => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${o.id}</strong></td>
                <td>${o.customer}</td>
                <td style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${o.items}</td>
                <td>$${o.price.toFixed(2)}</td>
                <td><span class="status-pill ${o.status}">${o.status}</span></td>
                <td>${o.time}</td>
                <td>
                    <div class="table-actions">
                        <button class="table-action-btn btn-view" title="View Details" onclick="window.location.href='orders-dashboard.html'"><i class="fa-solid fa-eye"></i></button>
                    </div>
                </td>
            `;
            adminRecentRows.appendChild(tr);
        });
    }

    // ==========================================================================
    // 6. Orders Dashboard Management Actions
    // ==========================================================================
    const ordersListRows = document.getElementById("orders-dashboard-rows");
    const tabButtons = document.querySelectorAll(".order-tab");
    
    function updateTabsCount() {
        if (!document.getElementById("count-all")) return;
        
        const countAll = orders.length;
        const countPending = orders.filter(x => x.status === "pending").length;
        const countPreparing = orders.filter(x => x.status === "preparing").length;
        const countDelivery = orders.filter(x => x.status === "delivery").length;
        const countDelivered = orders.filter(x => x.status === "delivered").length;
        
        document.getElementById("count-all").innerText = countAll;
        document.getElementById("count-pending").innerText = countPending;
        document.getElementById("count-preparing").innerText = countPreparing;
        document.getElementById("count-delivery").innerText = countDelivery;
        document.getElementById("count-delivered").innerText = countDelivered;
    }

    function renderOrdersDashboard(filter = "all") {
        if (!ordersListRows) return;
        
        ordersListRows.innerHTML = "";
        
        const filtered = orders.filter(o => {
            if (filter === "all") return true;
            return o.status === filter;
        });
        
        if (filtered.length === 0) {
            ordersListRows.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; color: var(--text-muted); padding: 40px;">
                        <i class="fa-regular fa-folder-open" style="font-size: 2rem; opacity: 0.5; margin-bottom: 8px;"></i>
                        <p>No orders found under this category.</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        filtered.forEach(o => {
            let actionBtnHTML = "";
            if (o.status === "pending") {
                actionBtnHTML = `<button class="btn btn-primary btn-action-state" data-id="${o.id}" data-target-state="preparing" style="padding: 6px 12px; font-size: 0.8rem;"><i class="fa-solid fa-fire"></i> Cook</button>`;
            } else if (o.status === "preparing") {
                actionBtnHTML = `<button class="btn btn-secondary btn-action-state" data-id="${o.id}" data-target-state="delivery" style="padding: 6px 12px; font-size: 0.8rem; background-color:#AF52DE;"><i class="fa-solid fa-truck-fast"></i> Dispatch</button>`;
            } else if (o.status === "delivery") {
                actionBtnHTML = `<button class="btn btn-primary btn-action-state" data-id="${o.id}" data-target-state="delivered" style="padding: 6px 12px; font-size: 0.8rem; background-color:#4CD964; border-color:#4CD964;"><i class="fa-solid fa-circle-check"></i> Complete</button>`;
            } else {
                actionBtnHTML = `<span style="color:var(--text-muted); font-size:0.8rem; font-weight:600;"><i class="fa-solid fa-circle-check" style="color:#4CD964;"></i> Archived</span>`;
            }
            
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${o.id}</strong></td>
                <td>${o.customer}</td>
                <td>${o.items}</td>
                <td>${o.address}</td>
                <td style="font-weight:700; color:var(--primary);">$${o.price.toFixed(2)}</td>
                <td><span class="status-pill ${o.status}">${o.status}</span></td>
                <td>${o.time}</td>
                <td>${actionBtnHTML}</td>
            `;
            ordersListRows.appendChild(tr);
        });
        
        document.querySelectorAll(".btn-action-state").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                const targetState = btn.getAttribute("data-target-state");
                
                const targetOrder = orders.find(x => x.id === id);
                if (targetOrder) {
                    targetOrder.status = targetState;
                    saveOrders();
                    showNotificationToast(`Order ${id} shifted to ${targetState}!`, "success");
                    
                    const activeFilter = document.querySelector(".order-tab.active").getAttribute("data-filter");
                    renderOrdersDashboard(activeFilter);
                    updateTabsCount();
                }
            });
        });
    }

    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            tabButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const filter = btn.getAttribute("data-filter");
            renderOrdersDashboard(filter);
        });
    });

    renderOrdersDashboard("all");
    updateTabsCount();

    // ==========================================================================
    // 7. Delivery Dashboard Tracking Slider & Marker Positions
    // ==========================================================================
    const riderMarker = document.getElementById("map-rider-marker");
    const sliderHandle = document.getElementById("delivery-slider-handle");
    const sliderTrack = document.getElementById("delivery-slider-track");
    const sliderText = document.getElementById("delivery-slider-text");
    
    const activeOrderId = document.getElementById("active-order-id");
    const activeOrderItems = document.getElementById("active-order-items");
    const activeOrderAddress = document.getElementById("active-order-customer-address");
    const activeOrderPill = document.getElementById("active-order-status-pill");
    
    let activeDeliveryOrder = orders.find(x => x.status === "delivery");
    if (!activeDeliveryOrder) {
        activeDeliveryOrder = orders.find(x => x.status === "preparing") || orders[1];
    }
    
    if (activeOrderId && activeDeliveryOrder) {
        activeOrderId.innerText = activeDeliveryOrder.id;
        activeOrderItems.innerText = activeDeliveryOrder.items;
        activeOrderAddress.innerHTML = `${activeDeliveryOrder.customer}<br>${activeDeliveryOrder.address}`;
        activeOrderPill.className = `status-pill ${activeDeliveryOrder.status}`;
        activeOrderPill.innerText = activeDeliveryOrder.status;
    }
    
    let currentRiderStep = 0; 
    const riderStepLabels = [
        "Slide to Accept Order",
        "Slide to Pick Up Food",
        "Slide to Complete Delivery",
        "Delivery Completed!"
    ];

    if (sliderHandle && sliderTrack) {
        let isDragging = false;
        let startX = 0;
        let maxSlide = sliderTrack.offsetWidth - sliderHandle.offsetWidth - 10;
        
        sliderHandle.addEventListener("mousedown", (e) => {
            isDragging = true;
            startX = e.clientX - sliderHandle.offsetLeft;
            sliderHandle.style.transition = "none";
        });
        
        document.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            let x = e.clientX - startX;
            x = Math.max(5, Math.min(x, maxSlide));
            sliderHandle.style.left = x + "px";
            
            if (x >= maxSlide * 0.95) {
                isDragging = false;
                sliderHandle.style.left = "5px";
                sliderHandle.style.transition = "left 0.3s ease";
                progressRiderState();
            }
        });
        
        document.addEventListener("mouseup", () => {
            if (isDragging) {
                isDragging = false;
                sliderHandle.style.left = "5px";
                sliderHandle.style.transition = "left 0.3s ease";
            }
        });
        
        sliderHandle.addEventListener("touchstart", (e) => {
            isDragging = true;
            startX = e.touches[0].clientX - sliderHandle.offsetLeft;
            sliderHandle.style.transition = "none";
        });
        
        document.addEventListener("touchmove", (e) => {
            if (!isDragging) return;
            let x = e.touches[0].clientX - startX;
            x = Math.max(5, Math.min(x, maxSlide));
            sliderHandle.style.left = x + "px";
            
            if (x >= maxSlide * 0.95) {
                isDragging = false;
                sliderHandle.style.left = "5px";
                sliderHandle.style.transition = "left 0.3s ease";
                progressRiderState();
            }
        });
        
        document.addEventListener("touchend", () => {
            if (isDragging) {
                isDragging = false;
                sliderHandle.style.left = "5px";
                sliderHandle.style.transition = "left 0.3s ease";
            }
        });
        
        sliderTrack.addEventListener("click", (e) => {
            if (e.target !== sliderHandle && currentRiderStep < 3) {
                progressRiderState();
            }
        });
    }
    
    function progressRiderState() {
        if (currentRiderStep >= 3) return;
        
        currentRiderStep++;
        sliderText.innerText = riderStepLabels[currentRiderStep];
        
        if (riderMarker) {
            if (currentRiderStep === 1) {
                riderMarker.style.top = "35%";
                riderMarker.style.left = "20%";
                if (activeOrderPill) {
                    activeOrderPill.innerText = "Accepted";
                    activeOrderPill.className = "status-pill preparing";
                }
                showNotificationToast("Order Accepted! Heading to kitchen.", "success");
            } else if (currentRiderStep === 2) {
                riderMarker.style.top = "42%";
                riderMarker.style.left = "48%";
                if (activeOrderPill) {
                    activeOrderPill.innerText = "Picked Up";
                    activeOrderPill.className = "status-pill delivery";
                }
                if (activeDeliveryOrder) {
                    activeDeliveryOrder.status = "delivery";
                    saveOrders();
                }
                showNotificationToast("Food Picked Up! Out for Delivery.", "success");
            } else if (currentRiderStep === 3) {
                riderMarker.style.top = "50%";
                riderMarker.style.left = "75%";
                sliderHandle.style.display = "none";
                if (activeOrderPill) {
                    activeOrderPill.innerText = "Delivered";
                    activeOrderPill.className = "status-pill delivered";
                }
                if (activeDeliveryOrder) {
                    activeDeliveryOrder.status = "delivered";
                    saveOrders();
                }
                showNotificationToast("Order Delivered Successfully!", "success");
            }
        }
    }

    // ==========================================================================
    // 8. Customer Dashboard Timeline Renderings
    // ==========================================================================
    const customerTimeline = document.getElementById("customer-timeline");
    if (customerTimeline) {
        customerTimeline.innerHTML = "";
        
        const janeOrders = orders.filter(o => o.customer === "Jane Doe" || o.customer === currentUser.name);
        
        if (janeOrders.length === 0) {
            customerTimeline.innerHTML = `
                <p style="color:var(--text-muted); text-align:center; padding: 20px;">No purchase records found.</p>
            `;
        } else {
            janeOrders.forEach(o => {
                const timelineItem = document.createElement("div");
                timelineItem.className = "timeline-item";
                timelineItem.innerHTML = `
                    <div class="timeline-dot"></div>
                    <div class="timeline-date">${o.time}</div>
                    <div class="timeline-content">
                        <div class="timeline-title">
                            <span>Order ${o.id}</span>
                            <span class="timeline-price">$${o.price.toFixed(2)}</span>
                        </div>
                        <div class="timeline-desc">${o.items}</div>
                        <span class="status-pill ${o.status}" style="margin-top: 8px;">${o.status}</span>
                    </div>
                `;
                customerTimeline.appendChild(timelineItem);
            });
        }
    }

    document.querySelectorAll(".fav-order-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const name = btn.getAttribute("data-name");
            const price = parseFloat(btn.getAttribute("data-price"));
            
            const randId = "#BC-" + Math.floor(1000 + Math.random() * 9000);
            const now = new Date();
            const timeStr = now.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) + ", " + now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
            
            const newOrderObj = {
                id: randId,
                customer: currentUser.name,
                items: `${name} x1`,
                address: "742 Evergreen Terrace, Springfield, NY",
                price: price,
                status: "pending",
                time: timeStr
            };
            
            orders.unshift(newOrderObj);
            saveOrders();
            showNotificationToast(`Order ${randId} placed! Check Kitchen Staff.`, "success");
            
            if (customerTimeline) {
                location.reload();
            }
        });
    });

    const avatarInput = document.getElementById("avatar-file-input");
    const bigAvatar = document.getElementById("profile-avatar-big");
    
    if (avatarInput && bigAvatar) {
        avatarInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    bigAvatar.setAttribute("src", event.target.result);
                    if (sidebarAvatar) {
                        sidebarAvatar.setAttribute("src", event.target.result);
                    }
                    showNotificationToast("Avatar picture updated!", "success");
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // ==========================================================================
    // 9. Notifications slide panel & Alerts
    // ==========================================================================
    const notiTrigger = document.getElementById("noti-trigger");
    const notiBadge = document.getElementById("noti-badge-count");
    
    const notificationsList = [
        "Special midnight dinner discount coupon code generated!",
        "New pending order #BC-9846 is waiting in the kitchen queue.",
        "Rider Alex has picked up order #BC-9847 from the kitchen."
    ];

    if (notiTrigger) {
        notiTrigger.addEventListener("click", () => {
            alert(`Stackly Notifications:\n\n1. ${notificationsList[0]}\n2. ${notificationsList[1]}\n3. ${notificationsList[2]}`);
            if (notiBadge) {
                notiBadge.style.display = "none";
            }
        });
    }

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("stackly_user");
            localStorage.removeItem("stackly_cart");
        });
    }

    function showNotificationToast(message, type = "success") {
        const toast = document.createElement("div");
        toast.className = `toast-msg toast-${type}`;
        
        const icon = type === "success" 
            ? '<i class="fa-solid fa-circle-check"></i>' 
            : '<i class="fa-solid fa-triangle-exclamation"></i>';
            
        toast.innerHTML = `${icon} <span>${message}</span>`;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add("show");
        }, 50);
        
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => {
                toast.remove();
            }, 400);
        }, 3000);
    }
});
