import axios from "axios";
const API_URL = process.env.REACT_APP_LOCAL_BACKEND;

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


export async function getMenus(){
  try{
    const response = await axios({
      method: "get",
      url: `${API_URL}api/order/menus`,
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function checkoutCart(serverItemsList){
  try{
    const response = await axios({
      method: "post",
      url: `${API_URL}api/order/checkout`,
      data: serverItemsList
    })
    return response;
  } catch (error) {
    console.error(error);
  }
}