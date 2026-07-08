/* balance tracker counter */
document.addEventListener("DOMContentLoaded", async () => {
  const TARGET_AMOUNT = 6194264;
  let RAISED_AMOUNT = parseInt(document.getElementById("raised-amount").dataset.fallbackValue);
  const scriptURL = "https://script.google.com/macros/s/AKfycbzOLj5wZh50kNrXl34liEmBWR6kkirVNBiw6wpwJILa0SxHLgKlmOJuvtoSrFX9iW4xOw/exec?action=getTotal";

  try {
    const response = await fetch(scriptURL, { method: "GET" });
    const data = await response.json();
    if (data.status === "success" && typeof data.total === "number") {
      RAISED_AMOUNT = data.total;
    }
  } catch (err) {}

  const gap = TARGET_AMOUNT - RAISED_AMOUNT;
  const percentage = Math.min((RAISED_AMOUNT / TARGET_AMOUNT) * 100, 100);

  const formatMoney = (amount) => {
    return "₹" + amount.toLocaleString("en-IN");
  };

  document.getElementById("goal-amount").innerText = formatMoney(TARGET_AMOUNT);

  setTimeout(() => {
    document.getElementById("progress-fill").style.width = percentage + "%";
  }, 300);

  const animateValue = (id, start, end, duration) => {
    const obj = document.getElementById(id);
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      const currentVal = Math.floor(progress * (end - start) + start);
      obj.innerHTML = formatMoney(currentVal);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  animateValue("raised-amount", 0, RAISED_AMOUNT, 2000);
  animateValue("gap-amount", TARGET_AMOUNT, gap, 2000);

  const percentObj = document.getElementById("percentage-label");
  let pStart = 0;

  if (Math.floor(percentage) > 0) {
    const pTimer = setInterval(() => {
      pStart++;
      percentObj.innerText = pStart + "%";
      if (pStart >= Math.floor(percentage)) clearInterval(pTimer);
    }, 2000 / percentage);
  } else {
    percentObj.innerText = "0%";
  }
});

/* batch congrats popup is now opened from the navbar button */
document.addEventListener("DOMContentLoaded", function () {
  const modalEl = document.getElementById("batchCongratsModal");
  if (!modalEl) return;

  const triggerButton = document.querySelector("[data-bs-target='#batchCongratsModal']");
  if (!triggerButton) return;

  triggerButton.addEventListener("click", function () {
    const congratsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
    congratsModal.show();
  });
});

/* alumni registration popup auto-opens on page load and closes after 5 seconds */
document.addEventListener("DOMContentLoaded", function () {
  const alumniModalEl = document.getElementById("alumniSignupModal");
  if (!alumniModalEl) return;

  const alumniModal = bootstrap.Modal.getOrCreateInstance(alumniModalEl);
  alumniModal.show();

  const hideTimer = window.setTimeout(() => {
    alumniModal.hide();
  }, 10000);

  alumniModalEl.addEventListener(
    "hidden.bs.modal",
    () => {
      window.clearTimeout(hideTimer);
    },
    { once: true }
  );
});

/* contact form post request */
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const formStatus = document.getElementById("formStatus");
  const scriptURL = "https://script.google.com/macros/s/AKfycbzq3-in5LRKKyvBeYIoumStkkpx7MWvu2S0HIUM9q_Oed4cDG_njhoXTKPHDsaguuco9Q/exec";
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.innerHTML = "Sending... <i class='fas fa-spinner fa-spin'></i>";
    formStatus.style.display = "none";

    const formData = new FormData(form);

    fetch(scriptURL, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          formStatus.innerHTML = "<span class='text-success-custom fw-bold'>Message sent successfully!</span>";
          formStatus.style.display = "block";

          form.reset();
        } else {
          throw new Error("Backend returned an error.");
        }
      })
      .catch((error) => {
        console.error("Error!", error.message);
        formStatus.innerHTML = "<span class='text-danger fw-bold'>Failed to send. Please try again.</span>";
        formStatus.style.display = "block";
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = "Send Message";
      });
  });
});
