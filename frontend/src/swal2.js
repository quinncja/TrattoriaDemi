import Swal from "sweetalert2";

export function successfulReserveAlert() {
    return Swal.fire({
      title: `Reservation Successful!`,
      icon: "success",
      iconColor: "#d3963a",
      timer: 3500,
      text: "We look forward to serving you",
      padding: "2rem",
      customClass: {
        title: "swal-header"
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
      timer: 3500,
      text: "We will get back to you as soon as possible",
      padding: "2rem",
      customClass: {
        title: "swal-header"
      },
      timerProgressBar: true,
      showConfirmButton: false,
    });
}

export function successfulGiftcardAlert(){
  return Swal.fire({
    title: `Thank you for your purchase`,
    icon: "success",
    iconColor: "#d3963a",
    timer: 3500,
    text: "A reciept has been sent to your email",
    padding: "2rem",
    customClass: {
      title: "swal-header"
    },
    timerProgressBar: true,
    showConfirmButton: false,
  });
}