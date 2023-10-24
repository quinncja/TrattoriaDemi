import Swal from "sweetalert2";

export function successfulReserveAlert() {
  return Swal.fire({
    title: `Reservation Successful!`,
    icon: "success",
    iconColor: "#d3963a",
    timer: 5500,
    text: "We look forward to serving you",
    padding: "2rem",
    customClass: {
      title: "swal-header",
    },
    timerProgressBar: true,
    showConfirmButton: false,
  });
}

export function discardResAlert() {
  return Swal.fire({
    title: `Discard Reservation?`,
    icon: "warning",
    iconColor: "#d3963a",
    timer: 5500,
    padding: "2rem",
    customClass: {
      title: "swal-header",
    },
    showConfirmButton: true,
    showCancelButton: true,
  });
}

export function successfulAdminResAlert() {
  return Swal.fire({
    title: `Reservation Created`,
    icon: "success",
    iconColor: "#d3963a",
    timer: 2500,
    padding: "2rem",
    customClass: {
      title: "swal-header",
    },
    timerProgressBar: true,
    showConfirmButton: false,
  });
}

export function orderSuccess() {
  return Swal.fire({
    title: `Order success`,
    text: "You will recieve a text when your order is confirmed",
    icon: "success",
    iconColor: "#d3963a",
    timer: 5500,
    padding: "2rem",
    customClass: {
      title: "swal-header",
    },
    timerProgressBar: true,
    showConfirmButton: false,
  });
}

export function successfulCancelAlert() {
  return Swal.fire({
    title: `Reservation Canceled`,
    icon: "success",
    iconColor: "#d3963a",
    timer: 5500,
    text: "We hope to see you soon",
    padding: "2rem",
    customClass: {
      title: "swal-header",
    },
    timerProgressBar: true,
    showConfirmButton: false,
  });
}

export function successfulContactAlert() {
  return Swal.fire({
    title: `Thanks for reaching out`,
    icon: "success",
    iconColor: "#d3963a",
    timer: 5500,
    text: "We will get back to you as soon as possible",
    padding: "2rem",
    customClass: {
      title: "swal-header",
    },
    timerProgressBar: true,
    showConfirmButton: false,
  });
}

export function successfulGiftcardAlert() {
  return Swal.fire({
    title: `Thank you for your purchase`,
    icon: "success",
    iconColor: "#d3963a",
    timer: 5500,
    text: "A reciept has been sent to your email",
    padding: "2rem",
    customClass: {
      title: "swal-header",
    },
    timerProgressBar: true,
    showConfirmButton: false,
  });
}

export function statusAlert() {
  return Swal.fire({
    title: `Check back soon`,
    text: `We are not currently taking online orders`,
    icon: "warning",
    iconColor: "#d3963a",
    timer: 10500,
    padding: "2rem",
    customClass: {
      title: "swal-header",
    },
    timerProgressBar: true,
    showConfirmButton: false,
  });
}
