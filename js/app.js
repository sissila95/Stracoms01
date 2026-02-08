/* ===========================
   CongoMeublé - JavaScript
   =========================== */

document.addEventListener('DOMContentLoaded', function () {

    // --- Mobile Navigation ---
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('.nav__link').forEach(function (link) {
            link.addEventListener('click', function () {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // --- Header scroll effect ---
    var header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                header.classList.add('header--scrolled');
            } else {
                header.classList.remove('header--scrolled');
            }
        });
    }

    // --- Animated counters ---
    var counters = document.querySelectorAll('[data-count]');
    if (counters.length > 0) {
        var animated = false;
        function animateCounters() {
            if (animated) return;
            counters.forEach(function (counter) {
                var rect = counter.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    animated = true;
                    var target = parseInt(counter.getAttribute('data-count'), 10);
                    var duration = 2000;
                    var step = Math.ceil(target / (duration / 16));
                    var current = 0;
                    var timer = setInterval(function () {
                        current += step;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        counter.textContent = current + '+';
                    }, 16);
                }
            });
        }
        window.addEventListener('scroll', animateCounters);
        animateCounters();
    }

    // --- Search form on homepage ---
    var searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var city = document.getElementById('city').value;
            var type = document.getElementById('type').value;
            var budget = document.getElementById('budget').value;

            var params = new URLSearchParams();
            if (city) params.set('city', city);
            if (type) params.set('type', type);
            if (budget) params.set('budget', budget);

            var url = 'pages/appartements.html';
            if (params.toString()) {
                url += '?' + params.toString();
            }
            window.location.href = url;
        });
    }

    // --- Catalog: Filters toggle (mobile) ---
    var filtersToggle = document.getElementById('filtersToggle');
    var filtersSidebar = document.getElementById('filtersSidebar');
    var filtersClose = document.getElementById('filtersClose');

    if (filtersToggle && filtersSidebar) {
        filtersToggle.addEventListener('click', function () {
            filtersSidebar.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (filtersClose && filtersSidebar) {
        filtersClose.addEventListener('click', function () {
            filtersSidebar.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // --- Catalog: Filter apartments ---
    var filtersForm = document.getElementById('filtersForm');
    var apartmentsList = document.getElementById('apartmentsList');
    var resultsCount = document.getElementById('resultsCount');

    if (filtersForm && apartmentsList) {
        // Pre-fill filters from URL params
        var urlParams = new URLSearchParams(window.location.search);
        var cityParam = urlParams.get('city');
        var typeParam = urlParams.get('type');
        var budgetParam = urlParams.get('budget');

        if (cityParam) {
            var filterCity = document.getElementById('filterCity');
            if (filterCity) filterCity.value = cityParam;
        }
        if (typeParam) {
            var filterType = document.getElementById('filterType');
            if (filterType) filterType.value = typeParam;
        }
        if (budgetParam) {
            var filterBudget = document.getElementById('filterBudget');
            if (filterBudget) filterBudget.value = budgetParam;
        }

        function filterApartments() {
            var cards = apartmentsList.querySelectorAll('.apartment-card');
            var city = document.getElementById('filterCity') ? document.getElementById('filterCity').value : '';
            var type = document.getElementById('filterType') ? document.getElementById('filterType').value : '';
            var budget = document.getElementById('filterBudget') ? document.getElementById('filterBudget').value : '';
            var visibleCount = 0;

            cards.forEach(function (card) {
                var cardCity = card.getAttribute('data-city') || '';
                var cardType = card.getAttribute('data-type') || '';
                var cardPrice = parseInt(card.getAttribute('data-price') || '0', 10);

                var show = true;

                if (city && cardCity !== city) show = false;
                if (type && cardType !== type) show = false;
                if (budget && cardPrice > parseInt(budget, 10)) show = false;

                card.style.display = show ? '' : 'none';
                if (show) visibleCount++;
            });

            if (resultsCount) {
                resultsCount.textContent = visibleCount;
            }
        }

        filtersForm.addEventListener('submit', function (e) {
            e.preventDefault();
            filterApartments();
            // Close mobile sidebar
            if (filtersSidebar) {
                filtersSidebar.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        filtersForm.addEventListener('reset', function () {
            setTimeout(function () {
                filterApartments();
            }, 10);
        });

        // Auto-filter on page load if params exist
        if (cityParam || typeParam || budgetParam) {
            filterApartments();
        }
    }

    // --- Sort apartments ---
    var sortSelect = document.getElementById('sortBy');
    if (sortSelect && apartmentsList) {
        sortSelect.addEventListener('change', function () {
            var cards = Array.from(apartmentsList.querySelectorAll('.apartment-card'));
            var sortValue = sortSelect.value;

            cards.sort(function (a, b) {
                var priceA = parseInt(a.getAttribute('data-price') || '0', 10);
                var priceB = parseInt(b.getAttribute('data-price') || '0', 10);

                if (sortValue === 'price-asc') return priceA - priceB;
                if (sortValue === 'price-desc') return priceB - priceA;
                return 0;
            });

            cards.forEach(function (card) {
                apartmentsList.appendChild(card);
            });
        });
    }

    // --- Contact Form ---
    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var formData = new FormData(contactForm);
            var data = {};
            formData.forEach(function (value, key) {
                data[key] = value;
            });

            // Show success message
            var alert = document.createElement('div');
            alert.className = 'alert alert--success';
            alert.style.display = 'block';
            alert.innerHTML = '<strong>Message envoyé !</strong> Nous vous répondrons dans les plus brefs délais. Merci de votre confiance.';

            contactForm.parentNode.insertBefore(alert, contactForm);
            contactForm.reset();

            // Scroll to alert
            alert.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Remove alert after 5 seconds
            setTimeout(function () {
                alert.remove();
            }, 5000);
        });
    }

    // --- FAQ Accordion ---
    var faqItems = document.querySelectorAll('.faq-item__question');
    faqItems.forEach(function (question) {
        question.addEventListener('click', function () {
            var faqItem = question.parentElement;
            var isActive = faqItem.classList.contains('active');

            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(function (item) {
                item.classList.remove('active');
            });

            // Toggle current
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });

    // --- Gallery thumbnail click (detail page) ---
    var thumbs = document.querySelectorAll('.detail-gallery__thumb');
    thumbs.forEach(function (thumb) {
        thumb.addEventListener('click', function () {
            thumbs.forEach(function (t) {
                t.classList.remove('active');
            });
            thumb.classList.add('active');
        });
    });

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});
