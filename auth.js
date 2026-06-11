/* ==========================================================================
   Stackly - Authentication Scripts
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
    // 2. Password Visibility Toggle
    // ==========================================================================
    const togglePassBtn = document.getElementById("toggle-password");
    const loginPassInput = document.getElementById("login-password");
    
    if (togglePassBtn && loginPassInput) {
        togglePassBtn.addEventListener("click", () => {
            const type = loginPassInput.getAttribute("type") === "password" ? "text" : "password";
            loginPassInput.setAttribute("type", type);
            
            const icon = togglePassBtn.querySelector("i");
            if (type === "text") {
                icon.className = "fa-regular fa-eye-slash";
            } else {
                icon.className = "fa-regular fa-eye";
            }
        });
    }

    const togglePassSignupBtns = document.querySelectorAll(".toggle-password-signup");
    togglePassSignupBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetId = btn.getAttribute("data-target");
            const targetInput = document.getElementById(targetId);
            
            if (targetInput) {
                const type = targetInput.getAttribute("type") === "password" ? "text" : "password";
                targetInput.setAttribute("type", type);
                
                const icon = btn.querySelector("i");
                if (type === "text") {
                    icon.className = "fa-regular fa-eye-slash";
                } else {
                    icon.className = "fa-regular fa-eye";
                }
            }
        });
    });

    // ==========================================================================
    // 3. Real-time Password Strength Check
    // ==========================================================================
    const signupPass = document.getElementById("signup-password");
    const strengthContainer = document.getElementById("strength-container");
    const strengthBar = document.getElementById("strength-bar");
    
    if (signupPass && strengthBar && strengthContainer) {
        signupPass.addEventListener("input", () => {
            const val = signupPass.value;
            if (val.length === 0) {
                strengthContainer.style.display = "none";
                return;
            }
            
            strengthContainer.style.display = "block";
            let score = 0;
            
            if (val.length >= 6) score++;
            if (val.length >= 8) score++;
            if (/[A-Z]/.test(val)) score++;
            if (/[0-9]/.test(val)) score++;
            if (/[^A-Za-z0-9]/.test(val)) score++;
            
            if (score <= 2) {
                strengthBar.style.width = "33%";
                strengthBar.style.backgroundColor = "#FF3B30"; 
            } else if (score <= 4) {
                strengthBar.style.width = "66%";
                strengthBar.style.backgroundColor = "#FFB800"; 
            } else {
                strengthBar.style.width = "100%";
                strengthBar.style.backgroundColor = "#4CD964"; 
            }
        });
    }

    // ==========================================================================
    // 4. Role-based Login & Redirection
    // ==========================================================================
    const loginForm = document.getElementById("login-form");
    const loginBtn = document.getElementById("login-btn");
    
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const email = document.getElementById("login-email").value.trim().toLowerCase();
            const role = document.getElementById("login-role").value;
            
            if (loginBtn) {
                loginBtn.disabled = true;
                loginBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...';
            }
            
            setTimeout(() => {
                let userObj = {
                    email: email,
                    name: email.split("@")[0].toUpperCase(),
                    role: role
                };
                
                let targetURL = "customer-dashboard.html";
                
                // Map login names and route URLs based on the selected dropdown Role
                if (role === "Admin") {
                    userObj.name = "Jonathan Bite";
                    targetURL = "admin-dashboard.html";
                } else if (role === "Staff") {
                    userObj.name = "Chief Kitchen Officer";
                    targetURL = "orders-dashboard.html";
                } else if (role === "Delivery Partner") {
                    userObj.name = "Rider Alex";
                    targetURL = "delivery-dashboard.html";
                }
                
                // Save session in localStorage
                localStorage.setItem("stackly_user", JSON.stringify(userObj));
                
                showToast(`Welcome back, ${userObj.name}!`, "success");
                
                setTimeout(() => {
                    window.location.href = targetURL;
                }, 1000);
                
            }, 1200);
        });
    }

    // ==========================================================================
    // 5. Signup Processing with Role Selection
    // ==========================================================================
    const signupForm = document.getElementById("signup-form");
    const signupBtn = document.getElementById("signup-btn");
    
    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const name = document.getElementById("signup-name").value.trim();
            const email = document.getElementById("signup-email").value.trim().toLowerCase();
            const phone = document.getElementById("signup-phone").value.trim();
            const role = document.getElementById("signup-role").value;
            const password = document.getElementById("signup-password").value;
            const confirm = document.getElementById("signup-confirm").value;
            
            if (password !== confirm) {
                showToast("Passwords do not match!", "error");
                document.getElementById("signup-confirm").classList.add("invalid");
                return;
            }
            
            if (signupBtn) {
                signupBtn.disabled = true;
                signupBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Registering Account...';
            }
            
            setTimeout(() => {
                const newUser = {
                    email: email,
                    name: name,
                    phone: phone,
                    role: role
                };
                
                localStorage.setItem("stackly_user", JSON.stringify(newUser));
                
                let targetURL = "customer-dashboard.html";
                if (role === "Admin") targetURL = "admin-dashboard.html";
                else if (role === "Staff") targetURL = "orders-dashboard.html";
                else if (role === "Delivery Partner") targetURL = "delivery-dashboard.html";
                
                showToast("Account Created Successfully! Welcome to Stackly.", "success");
                
                setTimeout(() => {
                    window.location.href = targetURL;
                }, 1200);
                
            }, 1500);
        });
        
        const signupConfirm = document.getElementById("signup-confirm");
        if (signupConfirm && signupPass) {
            signupConfirm.addEventListener("input", () => {
                if (signupConfirm.value === signupPass.value) {
                    signupConfirm.classList.remove("invalid");
                    signupConfirm.classList.add("valid");
                } else {
                    signupConfirm.classList.remove("valid");
                    signupConfirm.classList.add("invalid");
                }
            });
        }
    }

    // ==========================================================================
    // 6. Toast Alerts System
    // ==========================================================================
    function showToast(message, type = "success") {
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
