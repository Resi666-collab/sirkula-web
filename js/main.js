const SUPABASE_URL = 'https://sfgggatdahekprmkeomo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmZ2dnYXRkYWhla3BybWtlb21vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ3Mjc4NzIsImV4cCI6MjExMDMwMzg3Mn0.-H2ZAvkJLcGBEG1POuUnrcA9AYbTcxATJakSsCF7Qac';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
let currentListingData = null;

const translations = {
  id: { home: "Home", how: "How It Works", categories: "Categories", explore: "Explore Waste", about: "About Us", impact: "Impact", tagline: "Waste less. Give more. Grow better.", heroTitle: "Ubah Limbah Organik Menjadi <span class='highlight'>Peluang Baru.</span>", heroSub: "Menghubungkan bisnis makanan dengan orang-orang yang mengubah limbah organik menjadi sumber daya berharga untuk Indonesia yang lebih berkelanjutan.", ctaExplore: "Jelajahi Limbah", ctaJoin: "Bergabung", activeMatch: "Pencocokan Aktif", posting: "Post Waste", req: "Requests" },
  en: { home: "Home", how: "How It Works", categories: "Categories", explore: "Explore Waste", about: "About Us", impact: "Impact", tagline: "Waste less. Give more. Grow better.", heroTitle: "Turn Organic Waste Into <span class='highlight'>New Opportunities.</span>", heroSub: "Connecting food businesses with people who transform organic waste into valuable resources.", ctaExplore: "Explore Waste", ctaJoin: "Join SIRKULA", activeMatch: "Active Matchmaking", posting: "Post Waste", req: "Requests" }
};
let currentLang = localStorage.getItem('sirkula_lang') || 'id';

document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  initTheme();
  initLanguage();
  initAuthState(); 
  fetchMarketplaceListings();
  initScrollSpy();
  initMarketplaceFilter();
  
  // Mobile Nav
  const toggleBtn = document.getElementById('menuToggleBtn');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  if (toggleBtn) toggleBtn.addEventListener('click', () => { drawer.classList.add('open'); backdrop.classList.add('open'); });
  if (document.getElementById('closeDrawerBtn')) document.getElementById('closeDrawerBtn').addEventListener('click', () => { drawer.classList.remove('open'); backdrop.classList.remove('open'); });
  if (backdrop) backdrop.addEventListener('click', () => { drawer.classList.remove('open'); backdrop.classList.remove('open'); });
});

// Memastikan ikon di footer ter-render setelah semua elemen dimuat
window.addEventListener('load', () => {
  if (typeof lucide !== 'undefined') lucide.createIcons();
});

function initMarketplaceFilter() {
  const filterChips = document.querySelectorAll('.filter-chip');
  if (!filterChips.length) return;

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const filterValue = chip.getAttribute('data-filter');
      
      const listingCards = document.querySelectorAll('.listing-card');
      listingCards.forEach(card => {
        const category = (card.getAttribute('data-category') || '').toLowerCase();
        
        let match = false;
        if (filterValue === 'all') match = true;
        else if (filterValue === 'vegetables' && (category.includes('kompos') || category.includes('sayur'))) match = true;
        else if (filterValue === 'bakery' && category.includes('pakan')) match = true;
        else if (filterValue === 'cooked' && category.includes('bsf')) match = true;
        else if (category.includes(filterValue)) match = true;

        if (match) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; }, 10);
        } else {
          card.style.opacity = '0';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });
}

function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 150;
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
  });
}

function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  if (localStorage.getItem('sirkula_theme') === 'dark') {
    document.body.classList.add('dark-mode');
    if(themeToggle) themeToggle.innerHTML = '<i data-lucide="sun" style="width: 14px;"></i>';
  }
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('sirkula_theme', isDark ? 'dark' : 'light');
      themeToggle.innerHTML = isDark ? '<i data-lucide="sun" style="width: 14px;"></i>' : '<i data-lucide="moon" style="width: 14px;"></i>';
      lucide.createIcons();
    });
  }
}

function initLanguage() {
  const langToggle = document.getElementById('langToggle');
  const applyLanguage = (lang) => {
    document.querySelectorAll('[data-translate]').forEach(el => {
      const key = el.getAttribute('data-translate');
      if (translations[lang][key]) {
        if (key === 'heroTitle') el.innerHTML = translations[lang][key];
        else el.textContent = translations[lang][key];
      }
    });
    if (langToggle) langToggle.innerHTML = `<i data-lucide="globe" style="width: 14px;"></i> ${lang.toUpperCase()}`;
    lucide.createIcons();
  };
  applyLanguage(currentLang);
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      currentLang = currentLang === 'id' ? 'en' : 'id';
      localStorage.setItem('sirkula_lang', currentLang);
      applyLanguage(currentLang);
    });
  }
}

async function initAuthState() {
  try {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) return;

    const headerActions = document.getElementById('headerActions');
    const heroGreetingContainer = document.getElementById('heroGreetingContainer');

    const { data: profile } = await supabaseClient.from('profiles').select('full_name, role').eq('id', session.user.id).single();
    const userName = profile?.full_name || session.user.email.split('@')[0];
    const userRole = profile?.role || 'producer';

    // TAMPILKAN SAPAAN DI HERO (TANPA ICON PROFIL)
    if (heroGreetingContainer) {
      heroGreetingContainer.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px; background: #e8f5e9; color: #174D38; padding: 0.6rem 1.2rem; border-radius: 30px; font-weight: 700; width: fit-content; border: 1px solid #c8e6c9; font-size: 0.9rem;">
          Halo, ${userName}! Selamat datang kembali.
        </div>
      `;
    }

    if (headerActions) {
      const loginBtn = document.getElementById('navLogin');
      const registerBtn = document.getElementById('navRegister');
      if (loginBtn) loginBtn.remove();
      if (registerBtn) registerBtn.remove();

      const authContainer = document.createElement('div');
      authContainer.style.display = 'flex';
      authContainer.style.alignItems = 'center';
      authContainer.style.gap = '0.4rem';

      if (userRole === 'producer') {
        const addBtn = document.createElement('a');
        addBtn.href = 'tambah-limbah.html';
        addBtn.className = 'btn btn-primary btn-sm';
        addBtn.innerHTML = `<i data-lucide="plus" style="width: 14px; margin-right: 2px;"></i> ${translations[currentLang].posting}`;
        authContainer.appendChild(addBtn);

        const reqBtn = document.createElement('a');
        reqBtn.href = 'permintaan-masuk.html';
        reqBtn.className = 'btn btn-secondary btn-sm';
        reqBtn.innerHTML = `<i data-lucide="inbox" style="width: 14px; margin-right: 2px;"></i> ${translations[currentLang].req}`;
        authContainer.appendChild(reqBtn);
      }

      const langBtn = document.getElementById('langToggle');
      headerActions.insertBefore(authContainer, langBtn);

      // LOGOUT DI UJUNG PALING KANAN
      const logoutBtn = document.createElement('button');
      logoutBtn.className = 'btn btn-secondary btn-sm';
      logoutBtn.style.marginLeft = '0.5rem';
      logoutBtn.style.borderColor = '#dc2626';
      logoutBtn.style.color = '#dc2626';
      logoutBtn.innerHTML = 'Logout';
      logoutBtn.addEventListener('click', async () => {
        await supabaseClient.auth.signOut();
        window.location.reload();
      });
      
      const themeBtn = document.getElementById('themeToggle');
      headerActions.insertBefore(logoutBtn, themeBtn.nextSibling);
    }

    lucide.createIcons();
  } catch (err) { console.error(err); }
}

async function fetchMarketplaceListings() {
  const grid = document.getElementById('marketplaceCardsGrid');
  if (!grid) return;
  
  try {
    const { data } = await supabaseClient.from('waste_listings').select(`*, profiles (entity_name), waste_categories (name)`).order('created_at', { ascending: false });
    
    if (data && data.length > 0) {
      const demoBox = document.querySelector('.demo-disclaimer-box');
      if (demoBox) demoBox.style.display = 'none';

      grid.innerHTML = '';
      data.forEach(item => {
        const card = document.createElement('article');
        card.className = 'listing-card';
        
        const catName = item.waste_categories?.name || 'Organik';
        card.setAttribute('data-category', catName); 

        card.innerHTML = `
          <div class="listing-card-header">
            <span class="badge-demo" style="background: #e8f5e9; color: #2e7d32;"><i data-lucide="check-circle" style="width:12px;"></i> VERIFIED</span>
            <span class="badge-status available">${item.status}</span>
          </div>
          <div class="listing-card-body">
            <h3 class="listing-producer-title">${item.profiles?.entity_name || 'Mitra'}</h3>
            <div class="listing-waste-type">${item.title}</div>
            <div class="listing-card-footer">
              <span class="listing-verification"><i data-lucide="tag" style="width: 14px;"></i> ${catName}</span>
              <button type="button" class="btn btn-secondary btn-sm btn-dynamic-detail">Lihat Detail</button>
            </div>
          </div>
        `;
        grid.appendChild(card);
        
        card.querySelector('.btn-dynamic-detail').addEventListener('click', () => {
          currentListingData = item;
          document.getElementById('modalListingTitle').textContent = item.title;
          document.getElementById('modalProducerName').textContent = item.profiles?.entity_name;
          document.getElementById('modalLocation').textContent = item.location;
          document.getElementById('modalVolume').textContent = item.quantity + ' ' + item.unit;
          document.getElementById('modalSchedule').textContent = item.pickup_schedule;
          document.getElementById('modalNotes').textContent = item.description || '-';
          document.getElementById('listingDetailModal').classList.add('open');
        });
      });
      lucide.createIcons();
    }
  } catch (err) { console.error(err); }
}

document.getElementById('closeModalBtn')?.addEventListener('click', () => {
  document.getElementById('listingDetailModal').classList.remove('open');
});