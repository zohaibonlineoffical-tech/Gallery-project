const images = [
    { title: 'Mountain Landscape', category: 'Nature', icon: '△', src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85', alt: 'Layered mountains under a soft blue sky' },
    { title: 'Forest Trail', category: 'Nature', icon: '◌', src: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=85', alt: 'Sunlight filtering through a green forest trail' },
    { title: 'Ocean View', category: 'Nature', icon: '⌁', src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85', alt: 'Turquoise ocean waves meeting a sandy beach' },
    { title: 'City Skyline', category: 'City', icon: '▥', src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=85', alt: 'City skyline with tall buildings at dusk' },
    { title: 'Bridge View', category: 'City', icon: '∩', src: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=1200&q=85', alt: 'Historic bridge over a city river' },
    { title: 'Historic City', category: 'City', icon: '⌂', src: 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?auto=format&fit=crop&w=1200&q=85', alt: 'Warm architecture along a historic European street' },
    { title: 'Wild Fox', category: 'Animals', icon: '✦', src: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=1200&q=85', alt: 'Red fox looking toward the camera in the wild' },
    { title: 'Elephant', category: 'Animals', icon: '◒', src: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1200&q=85', alt: 'Elephant standing in a natural grassland' },
    { title: 'Colorful Bird', category: 'Animals', icon: '✧', src: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=1200&q=85', alt: 'Colorful bird perched on a branch' },
    { title: 'Cybersecurity', category: 'Tech', icon: '⌘', src: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=85', alt: 'Laptop displaying a secure digital lock interface' },
    { title: 'Code in Focus', category: 'Tech', icon: '〈/〉', src: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=1200&q=85', alt: 'Programming code on a monitor in a dark workspace' },
    { title: 'Developer Workspace', category: 'Tech', icon: '⌨', src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85', alt: 'Modern developer desk with code on a computer' },
    { title: 'Data Analytics', category: 'Tech', icon: '▥', src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85', alt: 'Colorful data analytics charts on a screen' },
    { title: 'Digital Network', category: 'Tech', icon: '◈', src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=85', alt: 'Blue digital network visualization across a globe' },
    { title: 'Machine Intelligence', category: 'Tech', icon: '✦', src: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=85', alt: 'Abstract artificial intelligence illustration on a screen' }
];

const galleryGrid = document.querySelector('#galleryGrid');
const emptyState = document.querySelector('#emptyState');
const imageCount = document.querySelector('#imageCount');
const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightboxImage');
const lightboxTitle = document.querySelector('#lightboxTitle');
const lightboxCategory = document.querySelector('#lightboxCategory');
const lightboxCounter = document.querySelector('#lightboxCounter');
const favorites = new Set(JSON.parse(localStorage.getItem('photogallery-favorites') || '[]'));
const uploadedImages = [];
const pictureInput = document.querySelector('#pictureInput');
let activeFilter = 'All';
let visibleImages = [...images];
let activeIndex = 0;

function renderGallery() {
    const allImages = [...images, ...uploadedImages];
    visibleImages = activeFilter === 'All' ? allImages : allImages.filter((image) => image.category === activeFilter);
    document.querySelectorAll('.filter-button').forEach((button) => {
        const count = button.dataset.filter === 'All' ? allImages.length : allImages.filter((image) => image.category === button.dataset.filter).length;
        button.querySelector('span').textContent = String(count).padStart(2, '0');
    });
    galleryGrid.innerHTML = visibleImages.map((image, index) => `
    <article class="gallery-card" data-index="${index}" tabindex="0" role="button" aria-label="Open ${image.title}">
      <img src="${image.src}" alt="${image.alt}" loading="lazy">
      <button class="favorite-button ${favorites.has(image.title) ? 'active' : ''}" type="button" data-favorite="${image.title}" aria-label="${favorites.has(image.title) ? 'Remove' : 'Add'} ${image.title} ${favorites.has(image.title) ? 'from' : 'to'} favorites" aria-pressed="${favorites.has(image.title)}">${favorites.has(image.title) ? '♥' : '♡'}</button>
      <div class="card-info"><p class="card-category"><span class="card-icon">${image.icon}</span>${image.category}</p><h3 class="card-title">${image.title}</h3></div>
    </article>`).join('');
    imageCount.textContent = String(visibleImages.length).padStart(2, '0');
    emptyState.hidden = visibleImages.length > 0;
}

function updateLightbox() {
    const image = visibleImages[activeIndex];
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxTitle.textContent = image.title;
    lightboxCategory.textContent = image.category;
    lightboxCounter.textContent = `${activeIndex + 1} / ${visibleImages.length}`;
}

function openLightbox(index) {
    activeIndex = index;
    updateLightbox();
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    document.querySelector('#lightboxClose').focus();
}

function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
}

function moveLightbox(step) {
    activeIndex = (activeIndex + step + visibleImages.length) % visibleImages.length;
    updateLightbox();
}

function saveFavorites() { localStorage.setItem('photogallery-favorites', JSON.stringify([...favorites])); }

function applyFilter(filter) {
    activeFilter = filter;
    document.querySelectorAll('.filter-button').forEach((button) => button.classList.toggle('active', button.dataset.filter === filter));
    renderGallery();
}

galleryGrid.addEventListener('click', (event) => {
    const favoriteButton = event.target.closest('[data-favorite]');
    if (favoriteButton) {
        const title = favoriteButton.dataset.favorite;
        favorites.has(title) ? favorites.delete(title) : favorites.add(title);
        saveFavorites();
        renderGallery();
        return;
    }
    const card = event.target.closest('.gallery-card');
    if (card) openLightbox(Number(card.dataset.index));
});
galleryGrid.addEventListener('keydown', (event) => {
    if ((event.key === 'Enter' || event.key === ' ') && event.target.closest('.gallery-card')) {
        event.preventDefault();
        openLightbox(Number(event.target.closest('.gallery-card').dataset.index));
    }
});
document.querySelectorAll('.filter-button').forEach((button) => button.addEventListener('click', () => applyFilter(button.dataset.filter)));
document.querySelector('#addPictureButton').addEventListener('click', () => pictureInput.click());
pictureInput.addEventListener('change', (event) => {
    [...event.target.files].filter((file) => file.type.startsWith('image/')).forEach((file) => {
        uploadedImages.push({ title: file.name.replace(/\.[^/.]+$/, ''), category: 'My Photos', icon: '✦', src: URL.createObjectURL(file), alt: `Uploaded photograph: ${file.name}` });
    });
    if (event.target.files.length) {
        activeFilter = 'All';
        document.querySelectorAll('.filter-button').forEach((button) => button.classList.toggle('active', button.dataset.filter === 'All'));
        renderGallery();
    }
    event.target.value = '';
});
document.querySelector('#lightboxClose').addEventListener('click', closeLightbox);
document.querySelector('#previousButton').addEventListener('click', () => moveLightbox(-1));
document.querySelector('#nextButton').addEventListener('click', () => moveLightbox(1));
lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (event) => { if (lightbox.hidden) return; if (event.key === 'Escape') closeLightbox(); if (event.key === 'ArrowRight') moveLightbox(1); if (event.key === 'ArrowLeft') moveLightbox(-1); });

document.querySelector('#imageEffect').addEventListener('change', (event) => { galleryGrid.dataset.effect = event.target.value; });
const themeToggle = document.querySelector('#themeToggle');

function setTheme(theme) {
    document.body.classList.toggle('light', theme === 'light');
    themeToggle.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
    document.querySelector('#themeIcon').textContent = theme === 'light' ? '☾' : '☼';
    localStorage.setItem('photogallery-theme', theme);
}
setTheme(localStorage.getItem('photogallery-theme') || 'dark');
themeToggle.addEventListener('click', () => setTheme(document.body.classList.contains('light') ? 'dark' : 'light'));
const menuToggle = document.querySelector('#menuToggle');
const navLinks = document.querySelector('#navLinks');
menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
});
document.querySelectorAll('.nav-link').forEach((link) => link.addEventListener('click', () => navLinks.classList.remove('open')));

renderGallery();