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

export function successfulUpdatedAlert() {
  return Swal.fire({
    title: `Reservation Updated!`,
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
export function cancelReservationAlert() {
  return Swal.fire({
    title: `Cancel your reservation?`,
    text: "You cannot undo this action",
    icon: "warning",
    iconColor: "#d3963a",
    customClass: {
      title: "swal-header",
      confirmButton: "submit-button",
    },
    confirmButtonText: "Confirm",
    showConfirmButton: true,
    showCancelButton: false,
    buttonsStyling: false,
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

export function employeeSaveSuccess(employeeName, type) {
  return Swal.fire({
    title: `Employee ${type}`,
    icon: "success",
    iconColor: "#d3963a",
    text: `${employeeName} was successfully ${type}`,
    timer: 3500,
    padding: "2rem",
    background: "#151319",
    color: "#f8f4f1",
    timerProgressBar: true,
    showConfirmButton: false,
  });
}

export function employeeSaveFail(employeeName, error) {
  return Swal.fire({
    title: `Update Error`,
    icon: "error",
    iconColor: "#d3963a",
    text: `Unable to update ${employeeName}, please check your input fields and try again. Error code: ${error}`,
    timer: 3500,
    padding: "2rem",
    background: "#151319",
    color: "#f8f4f1",
    timerProgressBar: true,
    showConfirmButton: false,
  });
}

export function successfulContactAlert() {
  return Swal.fire({
    title: `Thanks you for contacting us`,
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
    text: "A reciept has been sent to your email",
    padding: "2rem",
    customClass: {
      title: "swal-header",
    },
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

export function locationAlert() {
  return Swal.fire({
    title: `Address out of range`,
    text: `Were sorry, we do not offer delivery outside of Evanston`,
    icon: "error",
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
