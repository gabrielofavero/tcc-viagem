// ======= Gallery JS =======

// ======= LOADERS =======
function _loadPortfolioLightbox() {
    const portfolioLightbox = GLightbox({
        selector: '.portfolio-lightbox',
        autofocusVideos: false,
        touchNavigation: true,
        touchFollowAxis: true,
        width: 'auto',
        height: 'auto'
    });
}

function _loadGallery() {
    loadGalleryFilters(GALLERY_JSON.filters);
    loadGalleryPhotos(GALLERY_JSON.photos);
}

function loadGalleryFilters(filters) {
    let result = "";
    let filtersDiv = document.getElementById("portfolio-flters");
    let filterKeys = Object.keys(filters);

    filterKeys.forEach(key => {
        result += `<li data-filter=".${key}">${filters[key]}</li>`;
    });

    filtersDiv.innerHTML += result;
}

function loadGalleryPhotos(photos) {
    let result = "";
    let photosDiv = document.getElementById("portfolio-container");

    photos.forEach(photo => {
        let src = photo.src;
        let title = photo.title;
        let description = photo.description;
        let filter = photo.filter;

        result += `
       <div class="col-lg-4 col-md-6 portfolio-item ${filter}">
           <div class="portfolio-wrap">
           <img src="${src}" class="img-fluid portfolio-lightbox" data-gallery="portfolioGallery" alt="">
           <div class="portfolio-info">
               <h4>${title}</h4>
               <p>${description}</p>
               <div class="portfolio-links">
               <a href="${src}" data-gallery="portfolioGallery" class="portfolio-lightbox" title="${description}"><i class="bx bx-zoom-in"></i></a>
               </div>
           </div>
           </div>
       </div>`
    });

    photosDiv.innerHTML = result;
    _loadPortfolioLightbox();
}

// ======= CHECKERS =======
function _checkGallery() { // Checks if Gallery is active
    if (GALLERY_ACTIVE) {
        if (GALLERY_JSON) {
            return true;
        } else {
            console.log(ERROR, "JSON de Galeria Vazio")
            return false;
        }
    }
}