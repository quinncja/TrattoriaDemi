import axios from "axios";
const API_URL = process.env.REACT_APP_URL;

export async function getReservationById(id, signal) {
  try {
    const response = await axios({
      method: "get",
      url: `${API_URL}api/reservations/id/${id}`,
      signal,
    });
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled", error.message);
    } else {
      throw error;
    }
  }
}

export async function getReservationsByDate(date, signal) {
  try {
    const response = await axios({
      method: "get",
      url: `${API_URL}api/reservations/date/${date}`,
      signal,
    });
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled", error.message);
    } else {
      throw error;
    }
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
    throw error;
  }
}

export async function checkReservation(numGuests, date, time, signal) {
  try {
    const response = await axios({
      method: "get",
      url: `${API_URL}api/reservations/check`,
      params: {
        numGuests: numGuests,
        date: date,
        time: time,
      },
      signal,
    });
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled", error.message);
    } else {
      throw error;
    }
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
    throw error;
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
    throw error;
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
    throw error;
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
    throw error;
  }
}

export async function getMenus(signal) {
  try {
    const response = await axios({
      method: "get",
      url: `${API_URL}api/order/menus`,
      signal,
    });
    return response;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log(error.message);
    } else {
      throw error;
    }
  }
}

export async function checkForUpdate(signal) {
  try {
    const response = await axios({
      method: "get",
      url: `${API_URL}api/order/menu-check`,
      signal,
    });
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled", error.message);
    } else {
      throw error;
    }
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
    if (axios.isCancel(error)) {
      console.log("Request canceled", error.message);
    } else {
      throw error;
    }
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
    if (axios.isCancel(error)) {
      console.log("Request canceled", error.message);
    } else {
      throw error;
    }
  }
}

export async function getOrders(signal) {
  try {
    const response = await axios({
      method: "get",
      url: `${API_URL}api/order/today`,
      signal,
    });
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled", error.message);
    } else {
      throw error;
    }
  }
}

export async function getOrderById(id, signal) {
  try {
    const response = await axios({
      method: "get",
      url: `${API_URL}api/order/id/${id}`,
      signal,
    });
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled", error.message);
    } else {
      throw error;
    }
  }
}

export async function patchOrderConfirm(id, time) {
  try {
    const response = await axios({
      method: "patch",
      url: `${API_URL}api/order/id/${id}`,
      data: {
        time,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled", error.message);
    } else {
      throw error;
    }
  }
}

export async function markComplete(id) {
  try {
    const response = await axios({
      method: "put",
      url: `${API_URL}api/order/id/${id}`,
    });
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled", error.message);
    } else {
      throw error;
    }
  }
}

export async function getSystemStatus(signal) {
  try {
    const response = await axios({
      method: "get",
      url: `${API_URL}api/order/status`,
      signal,
    });
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled", error.message);
    } else {
      throw error;
    }
  }
}

export async function patchSystemStatus(status) {
  try {
    const response = await axios({
      method: "patch",
      url: `${API_URL}api/order/status`,
      data: status,
    });
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled", error.message);
    } else {
      throw error;
    }
  }
}

export async function deleteOrder(id) {
  try {
    await axios({
      method: "delete",
      url: `${API_URL}api/order/id/${id}`,
      data: id,
    });
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled", error.message);
    } else {
      throw error;
    }
  }
}

export async function getEmployees() {
  try {
    const response = await axios({
      method: "get",
      url: `${API_URL}api/payroll/employees`,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateEmployee(employee) {
  try {
    const response = await axios({
      method: "put",
      url: `${API_URL}api/payroll/employee`,
      data: employee,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getPayrollByPeriod(period) {
  try {
    const response = await axios({
      method: "get",
      url: `${API_URL}api/payroll/`,
      params: { period },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function savePayroll(payrollData) {
  try {
    const response = await axios({
      method: "post",
      url: `${API_URL}api/payroll/`,
      data: payrollData,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getPayrollGraph() {
  try {
    const response = await axios({
      method: "get",
      url: `${API_URL}api/payroll/graph`,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getGiftcardData() {
  try {
    const response = await axios({
      method: "get",
      url: `${API_URL}api/giftcard/stats`,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
