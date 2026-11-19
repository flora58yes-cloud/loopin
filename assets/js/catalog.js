/* =================================================
   LOOPIN E-COMMERCE CORE JAVASCRIPT (CLEAN & ROBUST)
   ================================================= */

let originalCatalogHTML = "";

// 1. DATABASE PRODUK TERPUSAT (DENGAN MULTI-KATEGORI)
const productsData = {
  "1": {
    title: "Cream Knit Cardigan",
    price: 35000,
    priceFormatted: "Rp 35.000",
    size: "m",
    category: ["atasan", "jaket & luaran"],
    condition: "layak pakai",
    seller: "lovedbythia",
    city: "Kota Surabaya",
    images: ["assets/images/catalog/1.jpg"],
    desc: "Cardigan rajut warna kream lembut dengan detail kancing depan. Bahannya adem, fleksibel, dan sangat nyaman dipakai untuk luaran santai atau kuliah."
  },
  "2": {
    title: "Floral Off-Shoulder Top",
    price: 25000,
    priceFormatted: "Rp 25.000",
    size: "s",
    category: ["atasan"],
    condition: "sangat baik",
    seller: "nabila.closet",
    city: "Kota Surabaya",
    images: ["assets/images/catalog/2.jpg"],
    desc: "Atasan off-shoulder motif bunga manis dengan karet dada yang nyaman. Jahitan rapi dan warna masih tajam seperti baru."
  },
  "3": {
    title: "Textured Knit Sweater",
    price: 40000,
    priceFormatted: "Rp 40.000",
    size: "m",
    category: ["atasan", "jaket & luaran"],
    condition: "seperti baru",
    seller: "studiopreloved",
    city: "Kota Sidoarjo",
    images: ["assets/images/catalog/3.jpg"],
    desc: "Sweater rajut bertekstur tebal dan hangat. Sangat cocok untuk dipakai hangout atau cuaca dingin, belum pernah dipakai luar ruangan."
  },
  "4": {
    title: "Chocolate Brown Blouse",
    price: 35000,
    priceFormatted: "Rp 35.000",
    size: "l",
    category: ["atasan"],
    condition: "sangat baik",
    seller: "lovedbythia",
    city: "Kota Surabaya",
    images: ["assets/images/catalog/4.1.jpg"],
    desc: "Blus warna cokelat dengan potongan elegan dan bahan jatuh yang halus di kulit. Kondisi terawat tanpa noda."
  },
  "5": {
    title: "Patterned Blue Skirt",
    price: 40000,
    priceFormatted: "Rp 40.000",
    size: "m",
    category: ["bawahan"],
    condition: "layak pakai",
    seller: "kenesthrift",
    city: "Kota Sidoarjo",
    images: ["assets/images/catalog/5.jpg"],
    desc: "Bawahan bermotif estetik dengan nuansa vintage. Sangat nyaman dan pas dipadupadankan."
  },
  "6": {
    title: "Olive Casual Top",
    price: 45000,
    priceFormatted: "Rp 45.000",
    size: "s",
    category: ["atasan"],
    condition: "sangat baik",
    seller: "ayupreloved",
    city: "Kota Surabaya",
    images: ["assets/images/catalog/6.jpg"],
    desc: "Atasan kasual warna olive green dengan aksen kancing depan yang cantik. Bahan katun adem dan menyerap keringat."
  },
  "7": {
    title: "Beige Utility Dress",
    price: 50000,
    priceFormatted: "Rp 50.000",
    size: "m",
    category: ["gaun", "jaket & luaran"],
    condition: "sangat baik",
    seller: "lovedbythia",
    city: "Kota Surabaya",
    images: ["assets/images/catalog/7.jpg", "assets/images/catalog/7.2.jpg"],
    desc: "Gaun midi warna beige dengan potongan utility yang elegan, dilengkapi tali pinggang yang manis."
  },
  "8": {
    title: "Vintage Floral Long Dress",
    price: 45000,
    priceFormatted: "Rp 45.000",
    size: "l",
    category: ["gaun"],
    condition: "seperti baru",
    seller: "nabila.closet",
    city: "Kota Surabaya",
    images: ["assets/images/catalog/8.jpg", "assets/images/catalog/8.2.jpg", "assets/images/catalog/8.3.jpg"],
    desc: "Dress panjang motif bunga bernuansa vintage, bahan jatuh dan sangat nyaman."
  },
  "9": {
    title: "Classic Striped Shirt",
    price: 25000,
    priceFormatted: "Rp 25.000",
    size: "s",
    category: ["atasan"],
    condition: "sangat baik",
    seller: "studiopreloved",
    city: "Kota Sidoarjo",
    images: ["assets/images/catalog/9.jpg", "assets/images/catalog/9.2.jpg"],
    desc: "Kemeja garis klasik dengan detail jahitan rapi, cocok untuk gaya kerja maupun kasual."
  },
  "10": {
    title: "Plaid Oversized Flannel",
    price: 30000,
    priceFormatted: "Rp 30.000",
    size: "m",
    category: ["atasan", "jaket & luaran"],
    condition: "layak pakai",
    seller: "kenesthrift",
    city: "Kota Sidoarjo",
    images: ["assets/images/catalog/10.jpg", "assets/images/catalog/10.2.jpg"],
    desc: "Kemeja flanel motif kotak-kotak bergaya oversized, pas banget dijadikan outer santai."
  }
};

// Inisialisasi Utama Saat Dokumen Dimuat
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  initWishlistSystem();
  initLiveSearch();
  initAdvancedFilters();
  syncProductsFromBackend();

  const productGrid = document.querySelector(".product-grid");
  if (productGrid) {
    originalCatalogHTML = productGrid.innerHTML;
  }
});

// Integrasi REST API Backend Node.js
async function syncProductsFromBackend() {
  try {
    const apiUrl = (window.location.port === '5000' || window.location.origin.includes('localhost:5000'))
      ? '/api/products'
      : 'http://localhost:5000/api/products';

    const res = await fetch(apiUrl);
    if (!res.ok) return;
    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      json.data.forEach((item) => {
        productsData[String(item.id)] = {
          title: item.title,
          price: item.price,
          priceFormatted: item.price_formatted || `Rp ${Number(item.price).toLocaleString('id-ID')}`,
          size: item.size,
          category: typeof item.category === 'string' ? item.category.split(',').map((c) => c.trim()) : item.category,
          condition: item.condition,
          seller: item.seller,
          city: item.city,
          images: item.images,
          desc: item.description
        };
      });
      console.log('✅ Sinkronisasi katalog dari Node.js Backend API & Database berhasil.');
    }
  } catch (e) {
    // Berjalan di mode offline / GitHub Pages tanpa server lokal
  }
}


/* =================================================
   2. SISTEM WISHLIST (FAVORIT)
   ================================================= */
function initWishlistSystem() {
  const wishlistButtons = document.querySelectorAll(".wishlist-btn");
  let wishlist = JSON.parse(localStorage.getItem('loopin_wishlist')) || [];

  wishlistButtons.forEach((btn, index) => {
    const cardId = String(index + 1);
    const svgIcon = btn.querySelector("svg");

    if (wishlist.includes(cardId)) {
      btn.classList.add("liked");
      if (svgIcon) {
        svgIcon.setAttribute("fill", "#B97D7B");
        svgIcon.style.color = "#B97D7B";
      }
    }

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const isLiked = btn.classList.toggle("liked");

      if (isLiked) {
        if (svgIcon) {
          svgIcon.setAttribute("fill", "#B97D7B");
          svgIcon.style.color = "#B97D7B";
        }
        if (!wishlist.includes(cardId)) wishlist.push(cardId);
      } else {
        if (svgIcon) {
          svgIcon.setAttribute("fill", "none");
          svgIcon.style.color = "inherit";
        }
        wishlist = wishlist.filter(id => id !== cardId);
      }
      localStorage.setItem('loopin_wishlist', JSON.stringify(wishlist));
    });
  });
}


/* =================================================
   3. LIVE SEARCH (PENCARIAN CEPAT)
   ================================================= */
function initLiveSearch() {
  const searchInput = document.querySelector(".search-bar input");
  const productCards = document.querySelectorAll(".product-card");

  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    const keyword = e.target.value.toLowerCase().trim();

    productCards.forEach((card, index) => {
      const productId = String(index + 1);
      const item = productsData[productId];
      const title = item ? item.title.toLowerCase() : "";

      if (title.includes(keyword)) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  });
}


/* =================================================
   4. ADVANCED FILTER (KATEGORI, UKURAN, KONDISI)
   ================================================= */
function initAdvancedFilters() {
  const categoryCheckboxes = document.querySelectorAll('.filter-kategori');
  const conditionCheckboxes = document.querySelectorAll('.filter-kondisi');
  const sizeButtons = document.querySelectorAll(".size-btn");
  const productCards = document.querySelectorAll(".product-card");
  const gridContainer = document.querySelector(".product-grid");

  let emptyStateMsg = document.getElementById('no-product-message');
  if (!emptyStateMsg && gridContainer) {
    emptyStateMsg = document.createElement('div');
    emptyStateMsg.id = 'no-product-message';
    emptyStateMsg.style.cssText = "grid-column: 1 / -1; text-align: center; padding: 40px 20px; display: none;";
    emptyStateMsg.innerHTML = `
      <div style="background-color: #FFFFFF; border: 1px solid #E5E0D8; border-radius: 16px; padding: 24px; max-width: 400px; margin: 0 auto; box-shadow: 0 4px 12px rgba(35,40,34,0.04);">
        <h3 style="font-family: serif; font-size: 16px; font-weight: 700; color: #232822; margin-bottom: 6px;">Tidak ada produk yang sesuai</h3>
        <p style="font-size: 12px; color: #232822; opacity: 0.7;">Coba ubah pilihan filter atau ukuran untuk melihat koleksi lainnya.</p>
      </div>
    `;
    gridContainer.appendChild(emptyStateMsg);
  }

  let selectedSize = 'allsize';

  sizeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const isActive = btn.classList.contains("active-size");
      sizeButtons.forEach(b => {
        b.classList.remove("active-size");
        b.style.backgroundColor = "";
        b.style.color = "";
      });

      if (!isActive) {
        btn.classList.add("active-size");
        btn.style.backgroundColor = "#232822";
        btn.style.color = "#FFFFFF";
        selectedSize = btn.textContent.trim().toLowerCase();
      } else {
        selectedSize = 'allsize';
      }
      applyFilters();
    });
  });

  categoryCheckboxes.forEach(cb => cb.addEventListener('change', applyFilters));
  conditionCheckboxes.forEach(cb => cb.addEventListener('change', applyFilters));

  function applyFilters() {
    const checkedCategories = Array.from(categoryCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value.toLowerCase());

    const checkedConditions = Array.from(conditionCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value.toLowerCase());

    let visibleCount = 0;

    productCards.forEach((card, index) => {
      const productId = String(index + 1);
      const item = productsData[productId];

      if (!item) return;

      let matchesCategory = checkedCategories.length === 0;
      if (checkedCategories.length > 0 && Array.isArray(item.category)) {
        matchesCategory = item.category.some(cat => checkedCategories.includes(cat));
      }

      let matchesSize = (selectedSize === 'allsize' || item.size === selectedSize);
      let matchesCondition = checkedConditions.length === 0 || checkedConditions.includes(item.condition);

      if (matchesCategory && matchesSize && matchesCondition) {
        card.style.display = "";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    if (emptyStateMsg) {
      if (visibleCount === 0) {
        emptyStateMsg.style.display = "block";
      } else {
        emptyStateMsg.style.display = "none";
      }
    }
  }
}


/* =================================================
   5. GLOBAL CART & BADGE SYNCHRONIZATION
   ================================================= */
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('loopin_cart')) || [];
  const badge = document.getElementById('cart-badge');
  
  if (!badge) return;

  const totalQty = cart.reduce((sum, item) => sum + (parseInt(item.qty) || 1), 0);

  if (totalQty > 0) {
    badge.textContent = totalQty > 99 ? '99+' : totalQty;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

/* =================================================
   FUNGSI FILTER NEW ARRIVALS
   ================================================= */
function filterNewArrivals() {
  const productGrid = document.querySelector(".product-grid");
  if (productGrid && !productGrid.querySelector(".product-card") && originalCatalogHTML) {
    productGrid.innerHTML = originalCatalogHTML;
    initWishlistSystem();
  }

  const productCards = document.querySelectorAll(".product-card");
  
  productCards.forEach((card, index) => {
    const productId = String(index + 1);
    const imgBox = card.querySelector(".card-img-box");
    
    imgBox.querySelectorAll(".new-badge, .sale-badge, .local-badge").forEach(b => b.remove());

    if (["7", "8", "9", "10"].includes(productId)) {
      card.style.display = "";
      const badge = document.createElement("span");
      badge.className = "new-badge";
      badge.textContent = "New Arrival";
      imgBox.appendChild(badge);
    } else {
      card.style.display = "none";
    }
  });

  const catalogHeaderTitle = document.querySelector(".products-header h2");
  const productCount = document.querySelector(".products-area .product-count");
  if (catalogHeaderTitle) catalogHeaderTitle.textContent = "New Arrivals Today";
  if (productCount) productCount.textContent = "4 Products Found";
}

/* =================================================
   FUNGSI FILTER SUPER SALE
   ================================================= */
function filterSuperSale() {
  const productGrid = document.querySelector(".product-grid");
  if (productGrid && !productGrid.querySelector(".product-card") && originalCatalogHTML) {
    productGrid.innerHTML = originalCatalogHTML;
    initWishlistSystem();
  }

  const productCards = document.querySelectorAll(".product-card");
  
  productCards.forEach((card, index) => {
    const productId = String(index + 1);
    const imgBox = card.querySelector(".card-img-box");
    
    imgBox.querySelectorAll(".new-badge, .sale-badge, .local-badge").forEach(b => b.remove());

    if (["1", "2", "4", "9", "10"].includes(productId)) {
      card.style.display = "";
      const badge = document.createElement("span");
      badge.className = "sale-badge";
      badge.textContent = "Super Sale";
      imgBox.appendChild(badge);
    } else {
      card.style.display = "none";
    }
  });

  const catalogHeaderTitle = document.querySelector(".products-header h2");
  const productCount = document.querySelector(".products-area .product-count");
  if (catalogHeaderTitle) catalogHeaderTitle.textContent = "Super Sale Deals";
  if (productCount) productCount.textContent = "5 Products Found";
}

/* =================================================
   FITUR PENJUAL TERDEKAT / LOKAL SHOWCASE DINAMIS
   ================================================= */
function filterPenjualTerdekat() {
  const catalogSection = document.querySelector(".products-area");
  if (!catalogSection) return;

  const catalogHeaderTitle = catalogSection.querySelector(".products-header h2");
  const productCount = catalogSection.querySelector(".product-count");
  const productGrid = catalogSection.querySelector(".product-grid");

  const allStores = {};
  Object.keys(productsData).forEach(id => {
    const item = productsData[id];
    if (!allStores[item.seller]) {
      allStores[item.seller] = {
        city: item.city,
        items: []
      };
    }
    allStores[item.seller].items.push({ id, ...item });
  });

  const storeKeys = Object.keys(allStores);

  if (catalogHeaderTitle) catalogHeaderTitle.textContent = "Semua Toko & Penjual Terdekat";
  if (productCount) productCount.textContent = `${storeKeys.length} Toko Aktif Ditemukan`;

  let htmlContent = `<div class="store-showcase-container">`;

  storeKeys.forEach((sellerName, index) => {
    const storeData = allStores[sellerName];
    const items = storeData.items;
    const avatarInitials = sellerName.substring(0, 2).toUpperCase();
    
    const distances = ["1.2 km darimu", "2.8 km darimu", "4.1 km darimu", "5.6 km darimu"];
    const distanceText = distances[index % distances.length];
    
    const bgColors = ["#588157", "#232822", "#3A5A40", "#A4243B"];
    const bgColor = bgColors[index % bgColors.length];

    htmlContent += `
      <div class="store-row-card">
        <div class="store-profile-card" style="background-color: ${bgColor};">
          <div class="store-avatar">${avatarInitials}</div>
          <div class="store-name">${sellerName}</div>
          <div class="store-location">${storeData.city}</div>
          <div class="store-distance">📍 ${distanceText}</div>
        </div>
    `;

    items.forEach(product => {
      const mainImg = (product.images && product.images.length > 0) ? product.images[0] : '';
      htmlContent += `
        <a href="product_detail.html?id=${product.id}" class="store-item-card">
          <img src="${mainImg}" alt="${product.title}">
          <div class="store-item-info">
            <div class="store-item-title">${product.title}</div>
            <div class="store-item-price">${product.priceFormatted}</div>
          </div>
        </a>
      `;
    });

    htmlContent += `
        <div class="store-action-end">
          <button onclick="filterStoreProducts('${sellerName}')" class="btn-explore-store">Lihat Semua</button>
        </div>
      </div>
    `;
  });

  htmlContent += `</div>`;
  productGrid.innerHTML = htmlContent;
}

/* =================================================
   FUNGSI TOMBOL "LIHAT SEMUA" TOKO (DENGAN TOMBOL KEMBALI BERSIH)
   ================================================= */
function filterStoreProducts(storeName) {
  const productGrid = document.querySelector(".product-grid");
  if (!productGrid) return;

  // Kembalikan struktur grid katalog awal jika sebelumnya berada di tampilan showcase
  if (!productGrid.querySelector(".product-card") && originalCatalogHTML) {
    productGrid.innerHTML = originalCatalogHTML;
    initWishlistSystem();
  }

  const productCards = document.querySelectorAll(".product-card");
  let visibleCount = 0;

  productCards.forEach((card, index) => {
    const productId = String(index + 1);
    const item = productsData[productId];
    const imgBox = card.querySelector(".card-img-box");
    
    imgBox.querySelectorAll(".new-badge, .sale-badge, .local-badge").forEach(b => b.remove());

    if (item && item.seller === storeName) {
      card.style.display = "";
      visibleCount++;
    } else {
      card.style.display = "none";
    }
  });

  const catalogHeaderTitle = document.querySelector(".products-header h2");
  const productCount = document.querySelector(".products-area .product-count");
  
  if (catalogHeaderTitle) {
    // Sembunyikan tombol ganda dan buat satu tombol kembali yang elegan di dalam header
    catalogHeaderTitle.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
        <button onclick="filterPenjualTerdekat()" style="background: none; border: 1.5px solid var(--neutral-taupe, #E5E0D8); padding: 4px 12px; border-radius: 8px; cursor: pointer; font-size: 12px; font-weight: 600; color: var(--deep-charcoal, #232822); display: inline-flex; align-items: center; gap: 6px; transition: background 0.2s;">
          &larr; Kembali
        </button>
        <span style="font-size: 20px; font-weight: 700; color: var(--deep-charcoal);">Produk: ${storeName}</span>
      </div>
    `;
  }
  
  if (productCount) {
    productCount.textContent = `${visibleCount} Produk Ditemukan`;
  }

  const katalogSection = document.getElementById('katalog') || document.querySelector('.products-area');
  if (katalogSection) {
    katalogSection.scrollIntoView({ behavior: 'smooth' });
  }
}

/* =================================================
   HALAMAN TENTANG KAMI (ABOUT US)
   ================================================= */
function showAboutUs() {
  const catalogSection = document.querySelector(".products-area");
  if (!catalogSection) return;

  const catalogHeaderTitle = catalogSection.querySelector(".products-header h2");
  const productCount = catalogSection.querySelector(".product-count");
  const productGrid = catalogSection.querySelector(".product-grid");

  if (catalogHeaderTitle) {
    catalogHeaderTitle.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
    
        <span>Tentang LoopIn</span>
      </div>
    `;
  }
  
  if (productCount) {
    productCount.textContent = "Sustainable Fashion Platform";
  }

  // Render konten Tentang Kami
  productGrid.innerHTML = `
    <div class="about-us-container">
      <div class="about-header">
        <h2>Give it another loop</h2>
        <p class="about-tagline">"Setiap pakaian berhak dicintai kembali."</p>
      </div>

      <div class="about-body">
        <p>
          <strong>LoopIn</strong> merupakan platform marketplace fashion pre-loved yang hadir dengan gagasan bahwa setiap pakaian layak mendapatkan kesempatan kedua. Terinspirasi dari konsep siklus yang terus berputar, nama LoopIn merepresentasikan upaya memberikan kehidupan baru bagi pakaian dengan mempertemukannya dengan pemilik baru. Melalui tagline <em>"Give it another loop,"</em> LoopIn mengajak masyarakat untuk membeli dan menjual pakaian pre-loved melalui platform yang lebih mudah diakses, praktis, dan terintegrasi.
        </p>
        <p>
          LoopIn berfokus pada penyelesaian berbagai permasalahan dalam industri fashion pre-loved, seperti pakaian layak pakai yang hanya menumpuk di lemari, terbatasnya akses terhadap marketplace pakaian bekas yang terorganisasi, serta proses jual beli yang masih tersebar di berbagai platform. Dengan mempertemukan penjual dan pembeli dalam satu platform, LoopIn bertujuan mempermudah proses penggunaan kembali pakaian sekaligus memberikan kesempatan bagi setiap produk fashion untuk kembali dimanfaatkan.
        </p>
      </div>

      <div class="about-grid-features">
        <div class="about-card-feature">
          <h4>Mendukung SDG 12</h4>
          <p>Mendukung Sustainable Development Goal 12: Konsumsi dan Produksi yang Bertanggung Jawab dengan memperpanjang masa pakai pakaian.</p>
        </div>
        <div class="about-card-feature">
          <h4>Kurangi Limbah Tekstil</h4>
          <p>Meningkatkan kesadaran terhadap pengurangan limbah tekstil melalui kebiasaan konsumsi yang lebih bijak dan ramah lingkungan.</p>
        </div>
      </div>
    </div>
  `;

  // Scroll halus ke area katalog
  const katalogSection = document.getElementById('katalog') || document.querySelector('.products-area');
  if (katalogSection) {
    katalogSection.scrollIntoView({ behavior: 'smooth' });
  }
}