/* ==========================================================================
   LoopIn Frontend Controller — Profile, Favorites & Package Tracking (app.js)
   ========================================================================== */

// 0. HELPER INTEGRASI GAMBAR LOKAL (Otomatis mencoba variasi nama & ekstensi)
function tryNextImageSource(imgEl, onAllFailed) {
  const raw = imgEl.getAttribute('data-fallbacks');
  if (!raw) {
    if (typeof onAllFailed === 'function') onAllFailed();
    return;
  }
  const list = raw.split(',').map((s) => s.trim()).filter(Boolean);
  if (list.length === 0) {
    if (typeof onAllFailed === 'function') onAllFailed();
    return;
  }
  const nextSrc = list.shift();
  imgEl.setAttribute('data-fallbacks', list.join(','));
  imgEl.src = nextSrc;
}

// Menghilangkan latar belakang hitam jika file logo berupa .jpg (seperti 1.jpg)
function handleLogoLoaded(imgEl) {
  const currentSrc = (imgEl.currentSrc || imgEl.src || '').toLowerCase();
  if (currentSrc.endsWith('.jpg') || currentSrc.endsWith('.jpeg')) {
    // Mode mix-blend-screen menghilangkan warna hitam (#000) dan menyisakan ikon terang di atas header sage
    imgEl.style.mixBlendMode = 'screen';
    imgEl.style.filter = 'brightness(1.85) contrast(1.2)';
  } else {
    // Jika file PNG transparan (1.png), putihkan ikonnya agar konsisten dengan auth.html
    imgEl.style.filter = 'brightness(0) invert(1)';
  }
}

// 1. DATA KATALOG PRODUK ASLI LOOPIN (Sesuai file foto di folder VS Code Anda)
const loopinCatalog = [
  {
    id: 'LPN-ITEM-01',
    name: 'White Wrap Pleated Blouse',
    brand: 'LoopIn Curated Studio',
    category: 'Atasan',
    size: 'M',
    condition: 'Like New (98%)',
    price: 115000,
    co2Saved: '4.2 kg',
    image: 'assets/images/catalog/1.jpg',
    fallbacks: ['assets/images/catalog/1.jpg']
  },
  {
    id: 'LPN-ITEM-02',
    name: 'Off-White Ruched Puff Sleeve Top',
    brand: 'Atelier Preloved',
    category: 'Atasan',
    size: 'S–M',
    condition: 'Excellent (95%)',
    price: 98000,
    co2Saved: '3.8 kg',
    image: 'assets/images/catalog/2.jpg',
    fallbacks: ['assets/images/catalog/2.jpg']
  },
  {
    id: 'LPN-ITEM-03',
    name: 'Cream Cable-Knit Daisy Cardigan',
    brand: 'Cottage Knit Archive',
    category: 'Rajut',
    size: 'All Size',
    condition: 'Like New (99%)',
    price: 149000,
    co2Saved: '5.6 kg',
    image: 'assets/images/catalog/3.jpg',
    fallbacks: ['assets/images/catalog/3.jpg']
  },
  {
    id: 'LPN-ITEM-04',
    name: 'Taupe Embroidered Collar Blouse',
    brand: 'Earth Tone Thrift',
    category: 'Atasan',
    size: 'L',
    condition: 'Excellent (94%)',
    price: 108000,
    co2Saved: '4.0 kg',
    image: 'assets/images/catalog/4.1.jpg',
    fallbacks: ['assets/images/catalog/4.1.jpg']
  },
  {
    id: 'LPN-ITEM-05',
    name: 'Ice-Blue Tiered Ribbon Maxi Skirt',
    brand: 'Pastel Loop Collection',
    category: 'Bawahan',
    size: 'M',
    condition: 'Like New (97%)',
    price: 132000,
    co2Saved: '4.9 kg',
    image: 'assets/images/catalog/5.jpg',
    fallbacks: ['assets/images/catalog/5.jpg']
  },
  {
    id: 'LPN-ITEM-06',
    name: 'Olive-Green Ribbed Knit Cardigan',
    brand: 'Tahari Preloved',
    category: 'Rajut',
    size: 'M',
    condition: 'Like New (98%)',
    price: 142000,
    co2Saved: '5.3 kg',
    image: 'assets/images/catalog/6.jpg',
    fallbacks: ['assets/images/catalog/6.jpg']
  },
  {
    id: 'LPN-ITEM-07',
    name: 'Beige Classic Collared Shirt',
    brand: 'Benhill Woman',
    category: 'Atasan',
    size: 'S',
    condition: 'Excellent (96%)',
    price: 112000,
    co2Saved: '4.1 kg',
    image: 'assets/images/catalog/7.2.jpg',
    fallbacks: ['assets/images/catalog/7.2.jpg']
  }
];

// 2. DATA SIMULASI PELACAKAN PAKET
const shipmentsData = [
  {
    resi: 'LPN-2026-0842',
    label: 'Paket #1 • LPN-2026-0842',
    courier: 'SiCepat Green Eco',
    origin: 'LoopIn Hub Bandung',
    eta: 'Hari ini, 14:00 – 17:00 WIB',
    currentStep: 2,
    subtotal: 264000,
    items: ['LPN-ITEM-01', 'LPN-ITEM-03'],
    history: [
      {
        time: '16 Nov 2026 • 09:42 WIB',
        title: 'Paket sedang diantar kurir menuju alamat tujuan',
        desc: 'Kurir Bagus Pratama (ID #SC-4412) sedang menuju area Ketintang, Surabaya.',
        active: true
      },
      {
        time: '16 Nov 2026 • 05:18 WIB',
        title: 'Tiba di Gudang Sortir Surabaya Selatan',
        desc: 'Paket lolos pemindaian sortir akhir dalam kondisi segel kraft utuh.',
        active: false
      },
      {
        time: '15 Nov 2026 • 18:30 WIB',
        title: 'Selesai Steam-Sanitizing & Eco-Packaging',
        desc: 'Tim kurasi LoopIn telah mensterilkan pakaian dan mengemasnya dengan boks kraft daur ulang.',
        active: false
      },
      {
        time: '15 Nov 2026 • 13:10 WIB',
        title: 'Pesanan Terkonfirmasi',
        desc: 'Pembayaran diterima dan item dikunci dari katalog publik.',
        active: false
      }
    ]
  },
  {
    resi: 'LPN-2026-0791',
    label: 'Paket #2 • LPN-2026-0791',
    courier: 'JNE Trucking Eco',
    origin: 'LoopIn Hub Yogyakarta',
    eta: 'Besok, 11:00 – 15:00 WIB',
    currentStep: 1,
    subtotal: 240000,
    items: ['LPN-ITEM-04', 'LPN-ITEM-05'],
    history: [
      {
        time: '16 Nov 2026 • 08:15 WIB',
        title: 'Proses Quality Check & Steam-Sanitizing',
        desc: 'Pakaian sedang menjalani uap antibakteri dan pelipatan kertas tisu bebas asam.',
        active: true
      },
      {
        time: '15 Nov 2026 • 21:04 WIB',
        title: 'Pesanan Diterima Hub Yogyakarta',
        desc: 'Menunggu jadwal penjemputan armada pengiriman antarkota.',
        active: false
      }
    ]
  },
  {
    resi: 'LPN-2026-0615',
    label: 'Selesai • LPN-2026-0615',
    courier: 'Anteraja Eco',
    origin: 'LoopIn Hub Jakarta',
    eta: 'Terkirim • 10 Nov 2026',
    currentStep: 3,
    subtotal: 142000,
    items: ['LPN-ITEM-06'],
    history: [
      {
        time: '10 Nov 2026 • 15:20 WIB',
        title: 'Paket Diterima oleh Flora Jasmine',
        desc: 'Diterima langsung di alamat tujuan. Terima kasih telah memberi siklus kedua!',
        active: true
      },
      {
        time: '10 Nov 2026 • 09:00 WIB',
        title: 'Kurir Menuju Lokasi Penerima',
        desc: 'Paket dibawa oleh kurir wilayah Surabaya Selatan.',
        active: false
      }
    ]
  }
];

// 3. STATE APLIKASI (Disimpan di localStorage agar persisten)
let favoriteIds = JSON.parse(localStorage.getItem('loopin_favorites')) || [
  'LPN-ITEM-01',
  'LPN-ITEM-03',
  'LPN-ITEM-06'
];
let activeFavCategory = 'Semua';
let activeShipmentIndex = 0;

function formatRupiah(num) {
  return 'Rp ' + num.toLocaleString('id-ID');
}

// 4. NAVIGASI ANTAR HALAMAN (PROFIL <-> LACAK PAKET)
function switchPage(pageName) {
  const pageProfile = document.getElementById('page-profile');
  const pageTracking = document.getElementById('page-tracking');
  const navProfile = document.getElementById('nav-profile');
  const navTracking = document.getElementById('nav-tracking');

  if (pageName === 'profile') {
    pageProfile.classList.remove('hidden');
    pageTracking.classList.add('hidden');
    navProfile.className = 'px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all bg-white text-charcoal shadow-sm flex items-center gap-2';
    navTracking.className = 'px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all text-white/85 hover:text-white flex items-center gap-2';
  } else {
    pageProfile.classList.add('hidden');
    pageTracking.classList.remove('hidden');
    navTracking.className = 'px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all bg-white text-charcoal shadow-sm flex items-center gap-2';
    navProfile.className = 'px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all text-white/85 hover:text-white flex items-center gap-2';
    renderTrackingPage();
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 5. FITUR FAVORITE (LIKE / UNLIKE REAL-TIME)
function toggleFavorite(itemId) {
  const index = favoriteIds.indexOf(itemId);
  const item = loopinCatalog.find((p) => p.id === itemId);

  if (index === -1) {
    favoriteIds.push(itemId);
    showToast(`"${item.name}" ditambahkan ke Barang Disukai ♥`, 'success');
  } else {
    favoriteIds.splice(index, 1);
    showToast(`"${item.name}" dihapus dari Barang Disukai`, 'info');
  }

  localStorage.setItem('loopin_favorites', JSON.stringify(favoriteIds));
  updateFavoriteCounters();
  renderFavoritesSection();
  renderCatalogSection();
}

function updateFavoriteCounters() {
  const count = favoriteIds.length;
  const badge = document.getElementById('nav-fav-badge');
  const stat = document.getElementById('stat-fav-count');
  if (badge) badge.textContent = count;
  if (stat) stat.textContent = count;
}

function setFavCategory(category) {
  activeFavCategory = category;
  document.querySelectorAll('.fav-cat-btn').forEach((btn) => {
    if (btn.dataset.cat === category) {
      btn.className = 'fav-cat-btn px-3.5 py-1.5 rounded-full text-xs font-semibold bg-charcoal text-white transition-all';
    } else {
      btn.className = 'fav-cat-btn px-3.5 py-1.5 rounded-full text-xs font-semibold bg-oatmeal text-charcoal hover:bg-taupe/70 border border-taupe transition-all';
    }
  });
  renderFavoritesSection();
}

function renderFavoritesSection() {
  const grid = document.getElementById('favorites-grid');
  const emptyState = document.getElementById('favorites-empty');
  if (!grid || !emptyState) return;

  const likedItems = loopinCatalog.filter((item) => {
    const isLiked = favoriteIds.includes(item.id);
    const matchCat = activeFavCategory === 'Semua' || item.category === activeFavCategory;
    return isLiked && matchCat;
  });

  if (likedItems.length === 0) {
    grid.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  grid.innerHTML = likedItems
    .map(
      (item) => `
      <article class="loopin-card bg-oatmeal/60 rounded-2xl border border-taupe overflow-hidden flex flex-col justify-between">
        <div>
          <div class="relative aspect-[4/3] bg-taupe/40 overflow-hidden">
            <img
              src="${item.image}"
              data-fallbacks="${item.fallbacks.join(',')}"
              alt="${item.name}"
              class="w-full h-full object-cover object-center"
              onerror="tryNextImageSource(this)"
            />
            <span class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 text-charcoal text-[10px] font-semibold shadow-xs">
              ${item.condition}
            </span>
            <button onclick="toggleFavorite('${item.id}')" class="heart-btn heart-pop absolute top-3 right-3 w-9 h-9 rounded-full bg-white text-rose-600 shadow-md flex items-center justify-center hover:bg-rose-50" title="Hapus dari Favorit" aria-label="Hapus dari Favorit">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
          </div>
          <div class="p-4 space-y-1.5">
            <div class="flex items-center justify-between text-[11px] text-charcoal-muted font-medium">
              <span>${item.brand}</span>
              <span class="px-2 py-0.5 rounded-md bg-white border border-taupe text-charcoal font-semibold">Size ${item.size}</span>
            </div>
            <h3 class="font-serif text-base font-bold text-charcoal leading-snug">${item.name}</h3>
            <p class="text-[11px] text-sage-dark font-medium">Hemat ${item.co2Saved} emisi CO₂e</p>
          </div>
        </div>
        <div class="px-4 pb-4 pt-2 flex items-center justify-between gap-2 border-t border-taupe/60">
          <span class="font-serif text-base font-bold text-charcoal tabular-nums">${formatRupiah(item.price)}</span>
          <button onclick="checkoutFavoriteItem('${item.name}')" class="px-3.5 py-2 bg-charcoal hover:bg-charcoal-hover text-white text-xs font-semibold rounded-xl transition-colors">
            + Keranjang
          </button>
        </div>
      </article>
    `
    )
    .join('');
}

function renderCatalogSection() {
  const grid = document.getElementById('catalog-grid');
  if (!grid) return;

  grid.innerHTML = loopinCatalog
    .map((item) => {
      const isLiked = favoriteIds.includes(item.id);
      return `
        <article class="loopin-card bg-white rounded-2xl border border-taupe overflow-hidden flex flex-col justify-between">
          <div>
            <div class="relative aspect-[4/5] bg-oatmeal overflow-hidden">
              <img
                src="${item.image}"
                data-fallbacks="${item.fallbacks.join(',')}"
                alt="${item.name}"
                class="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                onerror="tryNextImageSource(this)"
              />
              <button onclick="toggleFavorite('${item.id}')" class="heart-btn absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 shadow-sm flex items-center justify-center ${
                isLiked ? 'text-rose-600' : 'text-charcoal-muted hover:text-rose-600'
              }" title="${isLiked ? 'Disukai' : 'Sukai Barang Ini'}">
                <svg class="w-4 h-4 ${isLiked ? 'fill-current' : 'fill-none'}" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
            <div class="p-3.5 space-y-1">
              <span class="text-[10px] font-semibold uppercase tracking-wider text-sage-dark">${item.category} • Size ${item.size}</span>
              <h3 class="font-serif text-sm font-bold text-charcoal line-clamp-1">${item.name}</h3>
            </div>
          </div>
          <div class="px-3.5 pb-3.5 flex items-center justify-between">
            <span class="text-xs font-bold text-charcoal tabular-nums">${formatRupiah(item.price)}</span>
            <button onclick="toggleFavorite('${item.id}')" class="text-[11px] font-semibold ${
              isLiked ? 'text-rose-600' : 'text-sage hover:underline'
            }">
              ${isLiked ? '♥ Tersimpan' : '+ Suka'}
            </button>
          </div>
        </article>
      `;
    })
    .join('');
}

function checkoutFavoriteItem(name) {
  showToast(`"${name}" dimasukkan ke keranjang LoopIn!`, 'success');
}

// 6. EDIT PROFIL PENGGUNA
function openEditProfileModal() {
  document.getElementById('input-edit-name').value = document.getElementById('profile-name').textContent;
  document.getElementById('input-edit-bio').value = document.getElementById('profile-bio').textContent.trim();
  document.getElementById('input-edit-address').value = document.getElementById('profile-address').textContent;
  document.getElementById('input-edit-phone').value = document.getElementById('profile-phone').textContent;
  document.getElementById('input-edit-email').value = document.getElementById('profile-email').textContent;
  document.getElementById('edit-profile-modal').classList.remove('hidden');
}

function closeEditProfileModal() {
  document.getElementById('edit-profile-modal').classList.add('hidden');
}

function saveProfileChanges(e) {
  e.preventDefault();
  document.getElementById('profile-name').textContent = document.getElementById('input-edit-name').value;
  document.getElementById('profile-bio').textContent = document.getElementById('input-edit-bio').value;
  document.getElementById('profile-address').textContent = document.getElementById('input-edit-address').value;
  document.getElementById('profile-phone').textContent = document.getElementById('input-edit-phone').value;
  document.getElementById('profile-email').textContent = document.getElementById('input-edit-email').value;
  closeEditProfileModal();
  showToast('Profil & alamat pengiriman berhasil diperbarui!', 'success');
}

// 7. HALAMAN STATUS & LACAK PAKET
function renderTrackingPage() {
  const shipment = shipmentsData[activeShipmentIndex];
  const selectorGroup = document.getElementById('shipment-selector-group');

  selectorGroup.innerHTML = shipmentsData
    .map(
      (s, idx) => `
      <button onclick="selectShipment(${idx})" class="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
        idx === activeShipmentIndex
          ? 'bg-charcoal text-white shadow-xs'
          : 'bg-white text-charcoal border border-taupe hover:border-sage'
      }">
        ${s.label}
      </button>
    `
    )
    .join('');

  document.getElementById('track-resi-code').textContent = shipment.resi;
  document.getElementById('track-courier-info').innerHTML = `Kurir: <strong class="text-charcoal">${shipment.courier}</strong> • Dikirim dari ${shipment.origin}`;
  document.getElementById('track-eta').textContent = shipment.eta;

  const statusLabels = [
    'Pesanan Dikonfirmasi',
    'Proses Sanitasi & Kemas',
    'Dalam Pengantaran Kurir',
    'Paket Telah Diterima'
  ];
  const statusPill = document.getElementById('track-status-pill');
  statusPill.textContent = statusLabels[shipment.currentStep];
  statusPill.className =
    shipment.currentStep === 3
      ? 'px-4 py-2 rounded-2xl text-xs font-bold bg-sage-light text-sage-dark border border-sage/30'
      : 'px-4 py-2 rounded-2xl text-xs font-bold bg-amber-light text-charcoal border border-amber/40';

  const stages = [
    { title: '1. Pesanan Dikunci', sub: 'Item diamankan dari katalog' },
    { title: '2. Steam & Eco-Pack', sub: 'Sterilisasi & boks kraft' },
    { title: '3. Dalam Pengiriman', sub: 'Kurir menuju alamatmu' },
    { title: '4. Tiba di Tujuan', sub: 'Siap diberi siklus baru' }
  ];

  document.getElementById('tracking-stepper').innerHTML = stages
    .map((st, idx) => {
      const done = idx <= shipment.currentStep;
      const isCurrent = idx === shipment.currentStep;
      return `
        <div class="p-4 rounded-2xl border ${
          isCurrent
            ? 'bg-sage-light/70 border-sage shadow-xs'
            : done
            ? 'bg-oatmeal border-taupe'
            : 'bg-white border-taupe/60 opacity-60'
        }">
          <div class="flex items-center justify-between mb-1.5">
            <span class="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
              done ? 'bg-sage text-white' : 'bg-taupe text-charcoal-muted'
            }">
              ${done ? '✓' : idx + 1}
            </span>
            ${isCurrent ? '<span class="text-[10px] font-bold uppercase text-sage-dark">Status Saat Ini</span>' : ''}
          </div>
          <p class="font-serif text-sm font-bold text-charcoal">${st.title}</p>
          <p class="text-[11px] text-charcoal-muted mt-0.5">${st.sub}</p>
        </div>
      `;
    })
    .join('');

  document.getElementById('tracking-timeline').innerHTML = shipment.history
    .map(
      (log) => `
      <div class="relative">
        <span class="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
          log.active ? 'bg-sage ring-4 ring-sage-light' : 'bg-taupe'
        }"></span>
        <p class="text-[11px] font-semibold text-charcoal-muted tabular-nums">${log.time}</p>
        <h3 class="text-xs sm:text-sm font-bold text-charcoal mt-0.5">${log.title}</h3>
        <p class="text-xs text-charcoal/75 mt-1 leading-relaxed">${log.desc}</p>
      </div>
    `
    )
    .join('');

  const packageItems = shipment.items.map((id) => loopinCatalog.find((p) => p.id === id)).filter(Boolean);
  document.getElementById('track-item-count').textContent = `${packageItems.length} Item`;
  document.getElementById('track-items-list').innerHTML = packageItems
    .map(
      (item) => `
      <div class="flex items-center gap-3.5 p-2.5 rounded-2xl bg-oatmeal/70 border border-taupe/70">
        <img
          src="${item.image}"
          data-fallbacks="${item.fallbacks.join(',')}"
          alt="${item.name}"
          class="w-14 h-14 rounded-xl object-cover border border-taupe shrink-0"
          onerror="tryNextImageSource(this)"
        />
        <div class="min-w-0 flex-1">
          <p class="font-serif text-xs sm:text-sm font-bold text-charcoal truncate">${item.name}</p>
          <p class="text-[11px] text-charcoal-muted">Size ${item.size} • ${item.condition}</p>
          <p class="text-xs font-bold text-charcoal mt-0.5 tabular-nums">${formatRupiah(item.price)}</p>
        </div>
      </div>
    `
    )
    .join('');

  document.getElementById('track-subtotal').textContent = formatRupiah(shipment.subtotal);
  document.getElementById('track-total').textContent = formatRupiah(shipment.subtotal + 12000);
}

function selectShipment(idx) {
  activeShipmentIndex = idx;
  renderTrackingPage();
}

function handleSearchResi(e) {
  e.preventDefault();
  const query = document.getElementById('resi-search-input').value.trim().toUpperCase();
  if (!query) return;

  const foundIndex = shipmentsData.findIndex((s) => s.resi === query);
  if (foundIndex !== -1) {
    activeShipmentIndex = foundIndex;
    renderTrackingPage();
    showToast(`Resi ${query} ditemukan!`, 'success');
  } else {
    showToast(`Resi "${query}" tidak ditemukan. Coba: LPN-2026-0842`, 'error');
  }
}

function simulateNextShipmentStep() {
  const shipment = shipmentsData[activeShipmentIndex];
  if (shipment.currentStep >= 3) {
    showToast('Paket ini sudah berstatus Tiba di Tujuan.', 'info');
    return;
  }

  shipment.currentStep += 1;
  shipment.history.forEach((h) => (h.active = false));

  const nextMessages = {
    2: {
      title: 'Paket keluar dari hub dan sedang diantar kurir',
      desc: 'Kurir sedang dalam perjalanan menuju alamat penerima di Surabaya.'
    },
    3: {
      title: 'Paket Telah Diterima oleh Flora Jasmine',
      desc: 'Pengiriman selesai. Jangan lupa beri ulasan kurasi di profil kamu!'
    }
  };

  const info = nextMessages[shipment.currentStep];
  if (info) {
    shipment.history.unshift({
      time: 'Baru saja • Real-Time Update',
      title: info.title,
      desc: info.desc,
      active: true
    });
  }
  if (shipment.currentStep === 3) {
    shipment.eta = 'Terkirim • Baru saja';
  }

  renderTrackingPage();
  showToast('Status pengiriman berhasil diperbarui!', 'success');
}

function copyResiCode() {
  const code = document.getElementById('track-resi-code').textContent;
  navigator.clipboard?.writeText(code);
  showToast(`Nomor resi ${code} disalin!`, 'success');
}

// 8. GENERATOR UNDUH LOGO TRANSPARAN LOOPIN (PNG)
function downloadTransparentLoopInLogo() {
  const canvas = document.createElement('canvas');
  canvas.width = 520;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.strokeStyle = '#4B5B4A';
  ctx.lineWidth = 11;
  ctx.beginPath();
  ctx.arc(82, 46, 14, Math.PI, 0, false);
  ctx.lineTo(96, 62);
  ctx.stroke();

  ctx.strokeStyle = '#5B6E5A';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.arc(54, 92, 26, 0.35 * Math.PI, 1.85 * Math.PI, false);
  ctx.stroke();

  ctx.strokeStyle = '#9AA898';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.arc(110, 92, 26, 1.15 * Math.PI, 0.65 * Math.PI, false);
  ctx.stroke();

  ctx.fillStyle = '#4B5B4A';
  ctx.font = 'bold 64px "Playfair Display", Georgia, serif';
  ctx.fillText('LoopIn', 165, 98);

  ctx.fillStyle = '#5C625A';
  ctx.font = '500 18px Inter, sans-serif';
  ctx.fillText('Give it another loop.', 168, 128);

  const link = document.createElement('a');
  link.download = 'Logo-LoopIn-Transparan.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast('Logo-LoopIn-Transparan.png berhasil diunduh!', 'success');
}

// 9. TOAST NOTIFICATION
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');

  let bgColor = 'bg-charcoal text-white';
  if (type === 'success') bgColor = 'bg-sage text-white';
  if (type === 'error') bgColor = 'bg-rose-700 text-white';
  if (type === 'info') bgColor = 'bg-amber text-white';

  toast.className = `${bgColor} px-4 py-3 rounded-2xl shadow-xl text-xs font-medium flex items-center justify-between gap-3 pointer-events-auto border border-white/20 mb-2 toast-slide`;
  toast.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()" class="opacity-75 hover:opacity-100 text-sm">&times;</button>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    if (toast.parentElement) toast.remove();
  }, 3200);
}

// 10. INISIALISASI SAAT HALAMAN DIMUAT
document.addEventListener('DOMContentLoaded', () => {
  updateFavoriteCounters();
  renderFavoritesSection();
  renderCatalogSection();
  renderTrackingPage();
  syncProfileFromBackend();
});

// Sinkronisasi data dari Node.js REST API jika server berjalan
async function syncProfileFromBackend() {
  try {
    const apiUrl = (window.location.port === '5000' || window.location.origin.includes('localhost:5000'))
      ? '/api'
      : 'http://localhost:5000/api';

    const res = await fetch(`${apiUrl}/orders`);
    if (!res.ok) return;
    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      console.log('✅ Terhubung ke Node.js Backend API & Database SQLite/MySQL.');
    }
  } catch (e) {
    // Mode offline / GitHub Pages
  }
}