/* =========================================
   EDWARD MADISON APARTMENTS
   & REAL ESTATE MANAGEMENT
   Main JavaScript
========================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* =========================================
     ELEMENTS
  ========================================= */

  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");

  const searchForm = document.getElementById("propertySearch");
  const propertyType = document.getElementById("propertyType");
  const locationSearch = document.getElementById("locationSearch");

  const contactForm = document.getElementById("contactForm");
  const formNote = document.getElementById("formNote");
  const interestField = document.getElementById("interest");

  const toast = document.getElementById("toast");
  const year = document.getElementById("year");


  /* =========================================
     COPYRIGHT YEAR
  ========================================= */

  if (year) {
    year.textContent = new Date().getFullYear();
  }


  /* =========================================
     MOBILE MENU
  ========================================= */

  if (menuToggle && nav) {

    menuToggle.addEventListener("click", function (event) {

      event.stopPropagation();

      const isOpen = nav.classList.toggle("open");

      menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

      menuToggle.textContent =
        isOpen ? "✕" : "☰";

    });


    const navLinks = nav.querySelectorAll("a");

    navLinks.forEach(function (link) {

      link.addEventListener("click", function () {

        nav.classList.remove("open");

        menuToggle.setAttribute(
          "aria-expanded",
          "false"
        );

        menuToggle.textContent = "☰";

      });

    });


    document.addEventListener("click", function (event) {

      if (
        nav.classList.contains("open") &&
        !nav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {

        nav.classList.remove("open");

        menuToggle.setAttribute(
          "aria-expanded",
          "false"
        );

        menuToggle.textContent = "☰";

      }

    });

  }

/* =========================================
   TOAST NOTIFICATION
========================================= */

let toastTimer = null;

/**
 * @param {string} message
 */
function showToast(message) {

  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.classList.add("show");

  if (toastTimer) {
    clearTimeout(toastTimer);
  }

  toastTimer = setTimeout(function () {
    toast.classList.remove("show");
  }, 3500);

}
  /* =========================================
     PROPERTY SEARCH
  ========================================= */

  if (searchForm) {

    searchForm.addEventListener("submit", function (event) {

      event.preventDefault();

      const selectedType =
        propertyType
          ? propertyType.value.toLowerCase()
          : "all";

      const requestedLocation =
        locationSearch
          ? locationSearch.value.trim().toLowerCase()
          : "";

      const cards =
        document.querySelectorAll(
          ".property-card, .land-card"
        );

      let visibleCount = 0;

      cards.forEach(function (card) {

        const cardType =
          (card.dataset.type || "").toLowerCase();

        const cardLocation =
          (card.dataset.location || "").toLowerCase();

        const matchesType =
          selectedType === "all" ||
          cardType === selectedType;

        const matchesLocation =
          requestedLocation === "" ||
          cardLocation.includes(requestedLocation);

        const shouldShow =
          matchesType && matchesLocation;

        card.classList.toggle(
          "hidden",
          !shouldShow
        );

        if (shouldShow) {
          visibleCount++;
        }

      });


      let targetSection = null;

      if (selectedType === "land") {

        targetSection =
          document.getElementById("land");

      } else {

        targetSection =
          document.getElementById("rentals");

      }


      if (targetSection) {

        setTimeout(function () {

          targetSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }, 100);

      }


      if (visibleCount === 0) {

        showToast(
          "No sample properties match your search. Try another location or select all properties."
        );

      } else {

        showToast(
          visibleCount +
          " sample property" +
          (visibleCount === 1 ? "" : " cards") +
          " found. Please confirm actual availability directly."
        );

      }

    });

  }


  /* =========================================
     PROPERTY ENQUIRY BUTTONS
  ========================================= */

  const interestLinks =
    document.querySelectorAll("[data-interest]");

  interestLinks.forEach(function (link) {

    link.addEventListener("click", function () {

      const interest =
        link.getAttribute("data-interest");

      if (interestField && interest) {

        interestField.value = interest;

      }

    });

  });


  /* =========================================
     CONTACT FORM — FORMSPREE
  ========================================= */

  if (contactForm) {

    contactForm.addEventListener(
      "submit",
      async function (event) {

        event.preventDefault();

        if (!contactForm.checkValidity()) {

          contactForm.reportValidity();

          return;

        }


        const submitButton =
          contactForm.querySelector(
            'button[type="submit"]'
          );

        const formData =
          new FormData(contactForm);


        if (submitButton) {

          submitButton.disabled = true;

          submitButton.textContent =
            "Sending...";

        }


        if (formNote) {

          formNote.textContent =
            "Sending your enquiry...";

        }


        try {

          const response =
            await fetch(
              "https://formspree.io/f/xqpavzay",
              {
                method: "POST",

                body: formData,

                headers: {
                  Accept: "application/json"
                }
              }
            );


          if (response.ok) {

            contactForm.reset();

            if (formNote) {

              formNote.textContent =
                "Your enquiry has been sent successfully. We will contact you soon.";

            }

            showToast(
              "Enquiry sent successfully!"
            );

          } else {

            throw new Error(
              "Form submission failed."
            );

          }

        } catch (error) {

          console.error(
            "Formspree error:",
            error
          );

          if (formNote) {

            formNote.textContent =
              "We couldn't send your enquiry. Please try again.";

          }

          showToast(
            "Unable to send enquiry. Please try again."
          );

        } finally {

          if (submitButton) {

            submitButton.disabled = false;

            submitButton.textContent =
              "Send Enquiry ↗";

          }

        }

      }
    );

  }


  /* =========================================
     SMOOTH SCROLLING
  ========================================= */

  const pageLinks =
    document.querySelectorAll(
      'a[href^="#"]'
    );

  pageLinks.forEach(function (link) {

    link.addEventListener("click", function (event) {

      const targetId =
        link.getAttribute("href");

      if (
        !targetId ||
        targetId === "#"
      ) {
        return;
      }


      const targetElement =
        document.querySelector(targetId);

      if (!targetElement) {
        return;
      }


      event.preventDefault();


      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    });

  });


  /* =========================================
     WEBSITE READY
  ========================================= */

  console.log(
    "Edward Madison Real Estate website loaded successfully."
  );

});