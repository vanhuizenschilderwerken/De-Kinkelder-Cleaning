(function () {
  "use strict";

  var MOBILE_BREAKPOINT = 900;
  var MAX_UPLOAD_TOTAL = 10 * 1024 * 1024;

  var WEB3FORMS_ACCESS_KEY =
    "632cedec-5574-4c86-ae0e-1483cef3715b";

  var WEB3FORMS_ENDPOINT =
    "https://api.web3forms.com/submit";

  document.documentElement.classList.add("js");

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener(
        "DOMContentLoaded",
        callback,
        { once: true }
      );
    } else {
      callback();
    }
  }

  function normalizePath(pathname) {
    var path = pathname || "/";

    try {
      path = decodeURIComponent(path);
    } catch (error) {
      // Gebruik het oorspronkelijke pad wanneer decoderen niet lukt.
    }

    path = path
      .replace(/\\/g, "/")
      .replace(/\/+/g, "/")
      .replace(/\/(?:index|home)\.html?$/i, "/")
      .replace(/\.html?$/i, "")
      .replace(/\/+$/, "");

    return path || "/";
  }

  function initCurrentYear() {
    document
      .querySelectorAll("[data-current-year]")
      .forEach(function (node) {
        node.textContent =
          String(
            new Date().getFullYear()
          );
      });
  }

  function initHeader() {
    var header =
      document.querySelector(
        "[data-site-header]"
      );

    if (
      !header ||
      header.dataset.navigationReady ===
        "true"
    ) {
      return;
    }

    var toggle =
      header.querySelector(
        "[data-menu-toggle]"
      );

    var nav =
      header.querySelector(
        "[data-site-nav]"
      );

    var navAnchors =
      nav
        ? nav.querySelectorAll(
            "a[href]"
          )
        : [];

    var currentPath =
      normalizePath(
        window.location.pathname
      );

    function isMobile() {
      return (
        window.innerWidth <=
        MOBILE_BREAKPOINT
      );
    }

    function isOpen() {
      return header.classList.contains(
        "nav-open"
      );
    }

    function setMenu(open) {
      header.classList.toggle(
        "nav-open",
        open
      );

      document.body.classList.toggle(
        "menu-open",
        open
      );

      if (toggle) {
        toggle.setAttribute(
          "aria-expanded",
          String(open)
        );

        toggle.setAttribute(
          "aria-label",
          open
            ? "Menu sluiten"
            : "Menu openen"
        );
      }

      if (nav) {
        if (isMobile()) {
          nav.setAttribute(
            "aria-hidden",
            String(!open)
          );
        } else {
          nav.removeAttribute(
            "aria-hidden"
          );
        }
      }
    }

    function updateActiveLinks() {
      navAnchors.forEach(
        function (link) {
          var href =
            link.getAttribute(
              "href"
            );

          if (
            !href ||
            href.charAt(0) === "#" ||
            /^(?:mailto:|tel:)/i.test(
              href
            )
          ) {
            return;
          }

          var target;

          try {
            target =
              new URL(
                href,
                window.location.href
              );
          } catch (error) {
            return;
          }

          var active =
            normalizePath(
              target.pathname
            ) === currentPath;

          link.classList.toggle(
            "is-active",
            active
          );

          link.classList.toggle(
            "is-current",
            active &&
              link.classList.contains(
                "site-nav__cta"
              )
          );

          if (active) {
            link.setAttribute(
              "aria-current",
              "page"
            );
          } else {
            link.removeAttribute(
              "aria-current"
            );
          }
        }
      );
    }

    if (toggle) {
      toggle.addEventListener(
        "click",
        function () {
          setMenu(
            !isOpen()
          );
        }
      );
    }

    navAnchors.forEach(
      function (link) {
        link.addEventListener(
          "click",
          function () {
            if (isMobile()) {
              setMenu(false);
            }
          }
        );
      }
    );

    document.addEventListener(
      "click",
      function (event) {
        if (
          !isMobile() ||
          !isOpen() ||
          header.contains(
            event.target
          )
        ) {
          return;
        }

        setMenu(false);
      }
    );

    document.addEventListener(
      "keydown",
      function (event) {
        if (
          event.key ===
            "Escape" &&
          isOpen()
        ) {
          setMenu(false);

          if (toggle) {
            toggle.focus();
          }
        }
      }
    );

    window.addEventListener(
      "resize",
      function () {
        if (!isMobile()) {
          setMenu(false);
        } else if (nav) {
          nav.setAttribute(
            "aria-hidden",
            String(
              !isOpen()
            )
          );
        }
      }
    );

    window.addEventListener(
      "scroll",
      function () {
        header.classList.toggle(
          "is-scrolled",
          window.scrollY >
            10
        );
      },
      {
        passive: true
      }
    );

    updateActiveLinks();
    setMenu(false);

    header.dataset.navigationReady =
      "true";
  }

  function initRailButtons() {
    document
      .querySelectorAll(
        "[data-rail-prev], [data-rail-next]"
      )
      .forEach(
        function (button) {
          if (
            button.dataset
              .railReady ===
            "true"
          ) {
            return;
          }

          button.addEventListener(
            "click",
            function () {
              var wrap =
                button.closest(
                  ".rail-wrap"
                );

              var rail =
                wrap
                  ? wrap.querySelector(
                      "[data-rail]"
                    )
                  : null;

              if (!rail) {
                return;
              }

              var direction =
                button.hasAttribute(
                  "data-rail-prev"
                )
                  ? -1
                  : 1;

              rail.scrollBy({
                left:
                  direction *
                  rail.clientWidth *
                  0.82,

                behavior:
                  "smooth"
              });
            }
          );

          button.dataset.railReady =
            "true";
        }
      );
  }

  function initProjectCount() {
    var grid =
      document.querySelector(
        "[data-project-grid]"
      );

    var countNode =
      document.querySelector(
        "[data-project-count]"
      );

    if (
      !grid ||
      !countNode
    ) {
      return;
    }

    var amount =
      grid.querySelectorAll(
        "[data-project-card]"
      ).length;

    countNode.textContent =
      amount +
      (
        amount === 1
          ? " project zichtbaar"
          : " projecten zichtbaar"
      );
  }

  function initFaq() {
    document
      .querySelectorAll(
        "[data-contact-faq] details"
      )
      .forEach(
        function (item) {
          item.addEventListener(
            "toggle",
            function () {
              if (
                !item.open
              ) {
                return;
              }

              document
                .querySelectorAll(
                  "[data-contact-faq] details"
                )
                .forEach(
                  function (
                    other
                  ) {
                    if (
                      other !==
                      item
                    ) {
                      other.open =
                        false;
                    }
                  }
                );
            }
          );
        }
      );
  }

  function initQuoteForms() {
    /*
     * Zoek ALLE mogelijke
     * offerte/contactformulieren.
     */
    var forms =
      document.querySelectorAll(
        "[data-offerte-form], form.quote-form, form#form"
      );

    if (
      !forms.length
    ) {
      return;
    }

    forms.forEach(
      function (form) {
        if (
          form.dataset
            .quoteReady ===
          "true"
        ) {
          return;
        }

        /*
         * ====================================================
         * WEB3FORMS BASISINSTELLINGEN
         * ====================================================
         *
         * Een eventueel oude FormSubmit action
         * wordt hiermee overschreven.
         */
        form.setAttribute(
          "action",
          WEB3FORMS_ENDPOINT
        );

        form.setAttribute(
          "method",
          "POST"
        );

        form.setAttribute(
          "enctype",
          "multipart/form-data"
        );

        /*
         * Eventuele inline oude
         * onsubmit verwijderen.
         */
        form.removeAttribute(
          "onsubmit"
        );

        form.onsubmit =
          null;

        /*
         * Oude FormSubmit velden.
         *
         * Dit zijn onder andere de velden
         * die in je overzicht verschenen als:
         *
         * Autoresponse
         * Honey
         * Next
         * Template
         */
        var oldFormSubmitNames =
          [
            "_next",
            "_captcha",
            "_template",
            "_subject",
            "_autoresponse",
            "_cc",
            "_honey",

            "next",
            "captcha",
            "template",
            "autoresponse",
            "honey"
          ];

        /*
         * Oude FormSubmit inputs
         * volledig uit de HTML verwijderen.
         */
        Array.prototype
          .slice.call(
            form.elements
          )
          .forEach(
            function (
              element
            ) {
              if (
                element &&
                element.name &&
                oldFormSubmitNames.indexOf(
                  element.name
                ) !== -1
              ) {
                element.remove();
              }
            }
          );

        /*
         * Helper om hidden fields
         * veilig toe te voegen.
         */
        function ensureHiddenField(
          name,
          value
        ) {
          var input =
            form.querySelector(
              'input[type="hidden"][name="' +
                name +
                '"]'
            );

          if (!input) {
            input =
              document.createElement(
                "input"
              );

            input.type =
              "hidden";

            input.name =
              name;

            form.prepend(
              input
            );
          }

          input.value =
            value;

          return input;
        }

        /*
         * ====================================================
         * WEB3FORMS ACCESS KEY
         * ====================================================
         */
        ensureHiddenField(
          "access_key",
          WEB3FORMS_ACCESS_KEY
        );

        /*
         * Onderwerp van de e-mail.
         */
        ensureHiddenField(
          "subject",
          "Nieuwe offerteaanvraag via De Kinkelder Cleaning"
        );

        /*
         * Afzendernaam.
         */
        ensureHiddenField(
          "from_name",
          "De Kinkelder Cleaning website"
        );

        /*
         * Web3Forms botcheck.
         */
        var botcheck =
          form.querySelector(
            '[name="botcheck"]'
          );

        if (!botcheck) {
          botcheck =
            document.createElement(
              "input"
            );

          botcheck.type =
            "checkbox";

          botcheck.name =
            "botcheck";

          botcheck.tabIndex =
            -1;

          botcheck.autocomplete =
            "off";

          botcheck.style.display =
            "none";

          botcheck.setAttribute(
            "aria-hidden",
            "true"
          );

          form.prepend(
            botcheck
          );
        }

        /*
         * ====================================================
         * FORMULIER ELEMENTEN
         * ====================================================
         */

        var serviceInputs =
          Array.prototype
            .slice.call(
              form.querySelectorAll(
                '[name="dienst[]"]'
              )
            );

        var serviceFeedback =
          form.querySelector(
            "[data-service-feedback]"
          );

        var clientInputs =
          Array.prototype
            .slice.call(
              form.querySelectorAll(
                'input[name="opdrachtgever"]'
              )
            );

        var companyField =
          form.querySelector(
            "[data-company-field]"
          );

        var companyInput =
          form.querySelector(
            "[data-company-input]"
          );

        var submitButton =
          form.querySelector(
            'button[type="submit"], input[type="submit"]'
          );

        /*
         * ====================================================
         * PARTICULIER / ZAKELIJK
         * ====================================================
         */

        function selectedClientType() {
          var selected =
            form.querySelector(
              'input[name="opdrachtgever"]:checked'
            );

          return selected
            ? selected.value
            : "particulier";
        }

        function updateCompanyField() {
          if (
            !companyField &&
            !companyInput
          ) {
            return;
          }

          var required =
            selectedClientType() !==
            "particulier";

          if (
            companyField
          ) {
            companyField.hidden =
              !required;
          }

          if (
            companyInput
          ) {
            companyInput.required =
              required;

            companyInput.disabled =
              !required;

            companyInput.setAttribute(
              "aria-required",
              String(
                required
              )
            );
          }
        }

        /*
         * ====================================================
         * DIENST VALIDATIE
         * ====================================================
         */

        function hasSelectedService() {
          /*
           * Als het formulier geen
           * diensten bevat wordt verzending
           * niet geblokkeerd.
           */
          if (
            serviceInputs.length ===
            0
          ) {
            return true;
          }

          return serviceInputs.some(
            function (
              input
            ) {
              return (
                input.checked
              );
            }
          );
        }

        function updateServiceFeedback(
          showError
        ) {
          var valid =
            hasSelectedService();

          if (
            serviceFeedback
          ) {
            serviceFeedback.hidden =
              valid ||
              !showError;

            serviceFeedback.textContent =
              valid
                ? ""
                : "Selecteer minimaal één dienst voordat u het formulier verstuurt.";
          }

          serviceInputs.forEach(
            function (
              input
            ) {
              input.setAttribute(
                "aria-invalid",
                String(
                  !valid &&
                    showError
                )
              );
            }
          );

          return valid;
        }

        /*
         * ====================================================
         * URL PREFILL
         * ====================================================
         */

        function prefillFromQuery() {
          var params =
            new URLSearchParams(
              window.location.search
            );

          var service =
            params.get(
              "dienst"
            );

          var locationValue =
            params.get(
              "locatie"
            );

          var phone =
            params.get(
              "telefoon"
            );

          if (
            service
          ) {
            var safeService =
              String(
                service
              ).replace(
                /["\\]/g,
                "\\$&"
              );

            var serviceInput =
              form.querySelector(
                '[name="dienst[]"][value="' +
                  safeService +
                  '"]'
              );

            if (
              serviceInput
            ) {
              serviceInput.checked =
                true;
            }
          }

          if (
            locationValue
          ) {
            var postcode =
              form.querySelector(
                "[data-quote-location]"
              );

            var place =
              form.querySelector(
                'input[name="plaats"]'
              );

            if (
              /^\d{4}\s?[a-z]{2}$/i.test(
                locationValue.trim()
              )
            ) {
              if (
                postcode
              ) {
                postcode.value =
                  locationValue;
              }
            } else if (
              place
            ) {
              place.value =
                locationValue;
            }
          }

          if (
            phone
          ) {
            var phoneInput =
              form.querySelector(
                'input[name="telefoon"]'
              );

            if (
              phoneInput
            ) {
              phoneInput.value =
                phone;
            }
          }
        }

        /*
         * ====================================================
         * SUBMIT BUTTON
         * ====================================================
         */

        function getButtonLabel() {
          if (
            !submitButton
          ) {
            return "Versturen";
          }

          var span =
            submitButton.querySelector
              ? submitButton.querySelector(
                  "span"
                )
              : null;

          if (
            span
          ) {
            return (
              span.textContent
            );
          }

          if (
            submitButton.tagName ===
            "INPUT"
          ) {
            return (
              submitButton.value
            );
          }

          return (
            submitButton.textContent
          );
        }

        function setButtonLabel(
          text
        ) {
          if (
            !submitButton
          ) {
            return;
          }

          var span =
            submitButton.querySelector
              ? submitButton.querySelector(
                  "span"
                )
              : null;

          if (
            span
          ) {
            span.textContent =
              text;
          } else if (
            submitButton.tagName ===
            "INPUT"
          ) {
            submitButton.value =
              text;
          } else {
            submitButton.textContent =
              text;
          }
        }

        function setSubmitting(
          isSubmitting
        ) {
          if (
            !submitButton
          ) {
            return;
          }

          submitButton.disabled =
            isSubmitting;

          if (
            isSubmitting
          ) {
            submitButton.setAttribute(
              "aria-busy",
              "true"
            );
          } else {
            submitButton.removeAttribute(
              "aria-busy"
            );
          }
        }

        /*
         * Lege bestandvelden niet
         * naar Web3Forms sturen.
         */
        function removeEmptyFileFields(
          formData
        ) {
          form
            .querySelectorAll(
              'input[type="file"][name]'
            )
            .forEach(
              function (
                fileInput
              ) {
                if (
                  !fileInput.files ||
                  fileInput.files
                    .length === 0
                ) {
                  formData.delete(
                    fileInput.name
                  );
                }
              }
            );
        }

        /*
         * ====================================================
         * CHANGE EVENTS
         * ====================================================
         */

        clientInputs.forEach(
          function (
            input
          ) {
            input.addEventListener(
              "change",
              updateCompanyField
            );
          }
        );

        serviceInputs.forEach(
          function (
            input
          ) {
            input.addEventListener(
              "change",
              function () {
                updateServiceFeedback(
                  false
                );
              }
            );
          }
        );

        /*
         * ====================================================
         * VERZENDEN NAAR WEB3FORMS
         * ====================================================
         *
         * Capture = true
         *
         * Hierdoor wordt deze submit handler
         * vroeg uitgevoerd.
         *
         * stopImmediatePropagation voorkomt dat
         * een eventuele oude FormSubmit handler
         * daarna alsnog wordt uitgevoerd.
         */
        form.addEventListener(
          "submit",

          async function (
            event
          ) {
            /*
             * Nooit normale browser submission
             * gebruiken wanneer JS actief is.
             */
            event.preventDefault();

            event.stopImmediatePropagation();

            /*
             * Controle diensten.
             */
            if (
              !updateServiceFeedback(
                true
              )
            ) {
              if (
                serviceInputs[0]
              ) {
                serviceInputs[0].focus();
              }

              return;
            }

            /*
             * HTML validatie controleren.
             */
            if (
              !form.reportValidity()
            ) {
              return;
            }

            /*
             * Geen dubbele submit.
             */
            if (
              !submitButton ||
              submitButton.disabled
            ) {
              return;
            }

            var originalButtonLabel =
              getButtonLabel();

            /*
             * Alle formulierdata verzamelen.
             */
            var formData =
              new FormData(
                form
              );

            /*
             * Web3Forms access key
             * expliciet instellen.
             */
            formData.set(
              "access_key",
              WEB3FORMS_ACCESS_KEY
            );

            /*
             * Onderwerp expliciet instellen.
             */
            formData.set(
              "subject",
              "Nieuwe offerteaanvraag via De Kinkelder Cleaning"
            );

            /*
             * Afzendernaam.
             */
            formData.set(
              "from_name",
              "De Kinkelder Cleaning website"
            );

            /*
             * Het ingevulde e-mailadres
             * gebruiken als Reply-To.
             */
            var senderEmail =
              formData.get(
                "email"
              );

            if (
              typeof senderEmail ===
                "string" &&
              senderEmail.trim()
            ) {
              formData.set(
                "replyto",
                senderEmail.trim()
              );
            }

            /*
             * Oude FormSubmit data
             * definitief verwijderen.
             */
            oldFormSubmitNames.forEach(
              function (
                fieldName
              ) {
                formData.delete(
                  fieldName
                );
              }
            );

            /*
             * Geen lege bestandvelden.
             */
            removeEmptyFileFields(
              formData
            );

            /*
             * Visuele feedback.
             */
            setButtonLabel(
              "Aanvraag wordt verstuurd..."
            );

            setSubmitting(
              true
            );

            try {
              /*
               * ====================================================
               * BELANGRIJK
               * ====================================================
               *
               * Geen Content-Type header toevoegen.
               *
               * Bij FormData maakt de browser zelf
               * de multipart boundary correct aan.
               */
              var response =
                await fetch(
                  WEB3FORMS_ENDPOINT,
                  {
                    method:
                      "POST",

                    body:
                      formData
                  }
                );

              var data;

              try {
                data =
                  await response.json();
              } catch (
                jsonError
              ) {
                throw new Error(
                  "Web3Forms gaf geen geldige reactie terug."
                );
              }

              /*
               * Alleen succes tonen wanneer
               * Web3Forms daadwerkelijk success=true
               * teruggeeft.
               */
              if (
                !response.ok ||
                !data ||
                data.success !==
                  true
              ) {
                throw new Error(
                  data &&
                    data.message
                    ? data.message
                    : "Web3Forms heeft de aanvraag niet geaccepteerd."
                );
              }

              console.log(
                "Web3Forms verzending geslaagd:",
                data
              );

              /*
               * Succesmelding.
               */
              setButtonLabel(
                "Verzonden ✓"
              );

              /*
               * Formulier leegmaken.
               */
              form.reset();

              updateCompanyField();

              updateServiceFeedback(
                false
              );

              /*
               * Knop na 2,5 seconden
               * herstellen.
               */
              window.setTimeout(
                function () {
                  setButtonLabel(
                    originalButtonLabel
                  );

                  setSubmitting(
                    false
                  );
                },
                2500
              );
            } catch (
              error
            ) {
              console.error(
                "Web3Forms fout:",
                error
              );

              alert(
                "Kon het formulier niet verzenden. " +
                  (
                    error &&
                    error.message
                      ? error.message
                      : "Probeer het later opnieuw."
                  )
              );

              setButtonLabel(
                originalButtonLabel
              );

              setSubmitting(
                false
              );
            }
          },

          /*
           * Capture mode.
           */
          true
        );

        /*
         * Formulier initialiseren.
         */
        prefillFromQuery();

        updateCompanyField();

        updateServiceFeedback(
          false
        );

        form.dataset.quoteReady =
          "true";
      }
    );
  }

  function initFileUpload() {
    document
      .querySelectorAll(
        "[data-file-field]"
      )
      .forEach(
        function (
          field
        ) {
          if (
            field.dataset.fileReady ===
            "true"
          ) {
            return;
          }

          var input =
            field.querySelector(
              "[data-file-input]"
            );

          var preview =
            field.querySelector(
              "[data-file-preview]"
            );

          var feedback =
            field.querySelector(
              "[data-file-feedback]"
            );

          if (
            !input ||
            !preview ||
            !feedback
          ) {
            return;
          }

          var selectedFiles =
            Array.prototype
              .slice.call(
                input.files ||
                  []
              );

          function fileKey(
            file
          ) {
            return [
              file.name,
              file.size,
              file.lastModified
            ].join(
              "::"
            );
          }

          function syncInput() {
            if (
              typeof DataTransfer ===
              "undefined"
            ) {
              return;
            }

            var transfer =
              new DataTransfer();

            selectedFiles.forEach(
              function (
                file
              ) {
                transfer.items.add(
                  file
                );
              }
            );

            input.files =
              transfer.files;
          }

          function totalSize(
            files
          ) {
            return files.reduce(
              function (
                sum,
                file
              ) {
                return (
                  sum +
                  file.size
                );
              },
              0
            );
          }

          function showFeedback(
            message
          ) {
            feedback.textContent =
              message || "";

            feedback.hidden =
              !message;
          }

          function removeFile(
            index
          ) {
            selectedFiles.splice(
              index,
              1
            );

            syncInput();

            render();

            showFeedback(
              ""
            );
          }

          function render() {
            preview.replaceChildren();

            preview.hidden =
              selectedFiles.length ===
              0;

            selectedFiles.forEach(
              function (
                file,
                index
              ) {
                var figure =
                  document.createElement(
                    "figure"
                  );

                var image =
                  document.createElement(
                    "img"
                  );

                var caption =
                  document.createElement(
                    "figcaption"
                  );

                var removeButton =
                  document.createElement(
                    "button"
                  );

                var objectUrl =
                  URL.createObjectURL(
                    file
                  );

                figure.className =
                  "contact-file-preview";

                image.src =
                  objectUrl;

                image.alt =
                  "Voorbeeld van " +
                  file.name;

                image.loading =
                  "lazy";

                image.addEventListener(
                  "load",
                  function () {
                    URL.revokeObjectURL(
                      objectUrl
                    );
                  },
                  {
                    once: true
                  }
                );

                image.addEventListener(
                  "error",
                  function () {
                    URL.revokeObjectURL(
                      objectUrl
                    );
                  },
                  {
                    once: true
                  }
                );

                caption.className =
                  "contact-file-preview__name";

                caption.textContent =
                  file.name;

                removeButton.type =
                  "button";

                removeButton.className =
                  "contact-file-preview__remove";

                removeButton.setAttribute(
                  "aria-label",
                  "Verwijder " +
                    file.name
                );

                removeButton.textContent =
                  "×";

                removeButton.addEventListener(
                  "click",
                  function () {
                    removeFile(
                      index
                    );
                  }
                );

                figure.appendChild(
                  image
                );

                figure.appendChild(
                  caption
                );

                figure.appendChild(
                  removeButton
                );

                preview.appendChild(
                  figure
                );
              }
            );
          }

          input.addEventListener(
            "change",
            function () {
              var incoming =
                Array.prototype
                  .slice.call(
                    input.files ||
                      []
                  );

              var known =
                new Set(
                  selectedFiles.map(
                    fileKey
                  )
                );

              var candidates =
                selectedFiles.slice();

              var errorMessage =
                "";

              incoming.forEach(
                function (
                  file
                ) {
                  if (
                    !/^image\/(?:jpeg|png|webp)$/i.test(
                      file.type
                    )
                  ) {
                    errorMessage =
                      "Gebruik alleen JPG-, PNG- of WebP-afbeeldingen.";

                    return;
                  }

                  var key =
                    fileKey(
                      file
                    );

                  if (
                    !known.has(
                      key
                    )
                  ) {
                    candidates.push(
                      file
                    );

                    known.add(
                      key
                    );
                  }
                }
              );

              if (
                totalSize(
                  candidates
                ) >
                MAX_UPLOAD_TOTAL
              ) {
                errorMessage =
                  "De totale bestandsgrootte mag maximaal 10 MB zijn.";
              } else if (
                !errorMessage
              ) {
                selectedFiles =
                  candidates;
              }

              syncInput();

              render();

              showFeedback(
                errorMessage
              );
            }
          );

          var parentForm =
            field.closest(
              "form"
            );

          if (
            parentForm
          ) {
            parentForm.addEventListener(
              "reset",
              function () {
                window.setTimeout(
                  function () {
                    selectedFiles =
                      [];

                    syncInput();

                    render();

                    showFeedback(
                      ""
                    );
                  },
                  0
                );
              }
            );
          }

          render();

          field.dataset.fileReady =
            "true";
        }
      );
  }

  /*
   * ======================================================
   * ALLES STARTEN NADAT DE PAGINA KLAAR IS
   * ======================================================
   */
  onReady(
    function () {
      initCurrentYear();

      initHeader();

      initRailButtons();

      initProjectCount();

      initFaq();

      initQuoteForms();

      initFileUpload();
    }
  );
})();
