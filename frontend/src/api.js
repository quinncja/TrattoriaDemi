import axios from "axios";
const API_URL = process.env.REACT_APP_DEPLOYED_BACKEND;

export async function getReservations() {
  try {
    const response = await axios({
      method: "get",
      url: `${API_URL}api/reservations/`,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getReservationById(id) {
  try {
    const response = await axios({
      method: "get",
      url: `${API_URL}api/reservations/id/${id}`,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getReservationsByDate(date) {
  try {
    const response = await axios({
      method: "get",
      url: `${API_URL}api/reservations/date/${date}`,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function patchReservation(id, state) {
  try {
    const response = await axios({
      method: "patch",
      url: `${API_URL}api/reservations/id/${id}/state/${state}`,
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function checkReservation(numGuests, date, time) {
  try {
    const response = await axios({
      method: "get",
      url: `${API_URL}api/reservations/check`,
      params: {
        numGuests: numGuests,
        date: date,
        time: time,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function postReservation(newRes) {
  try {
    const response = await axios({
      method: "post",
      url: `${API_URL}api/reservations/`,
      data: newRes,
    });
    return response.status;
  } catch (error) {
    console.error(error);
  }
}

export async function postAdminReservation(newRes) {
  try {
    const response = await axios({
      method: "post",
      url: `${API_URL}api/reservations/override`,
      data: newRes,
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function postContact(newContact) {
  try {
    const response = await axios({
      method: "post",
      url: `${API_URL}api/messages`,
      data: newContact,
    });
    return response.status;
  } catch (error) {
    console.error(error);
  }
}

export async function postGiftcard(newGiftcard) {
  try {
    const response = await axios({
      method: "post",
      url: `${API_URL}api/giftcard`,
      data: newGiftcard,
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function getMenus() {
  try {
    const response = await axios({
      method: "get",
      url: `${API_URL}api/order/menus`,
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function checkForUpdate() {
  try {
    const response = await axios({
      method: "get",
      url: `${API_URL}api/order/menu-check`,
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function checkoutCart(newOrder) {
  try {
    const response = await axios({
      method: "post",
      url: `${API_URL}api/order/checkout`,
      data: newOrder,
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function placePickupOrder(newOrder) {
  try {
    const response = await axios({
      method: "post",
      url: `${API_URL}api/order/pickup`,
      data: newOrder,
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function getOrderById(id) {
  try {
    const response = await axios({
      method: "get",
      url: `${API_URL}api/order/id/${id}`,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
