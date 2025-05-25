import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

// House APIs
export const getHouses = () => api.get("/houses");
export const createHouse = (house: any) => api.post("/houses", house);
export const getHouseById = (id: string) => api.get(`/houses/${id}`);
export const deleteHouse = (id: string) => api.delete(`/houses/${id}`);

// Bill APIs
export const getBills = () => api.get("/bills");
export const createBill = (bill: any) => api.post("/bills", bill);
// index.ts - Update the updateBillStatus function
export const updateBill = (id: string, billData: any) =>
  api.patch(`/bills/${id}`, billData);
export const deleteBill = (id: string) => api.delete(`/bills/${id}`);
export const getBillsByHouseId = (houseId: string) =>
  api.get(`/bills?houseId=${houseId}`);
// Get the latest bill for a house
export const getLatestBillForHouse = async (houseId: string) => {
  const bills = await getBillsByHouseId(houseId);
  const houseBills = bills.data;
  // Sort bills by date (newest first)
  houseBills.sort(
    (a: any, b: any) =>
      new Date(b.month).getTime() - new Date(a.month).getTime()
  );
  return houseBills.length > 0 ? houseBills[0] : null;
};

// Fine APIs
export const getFines = () => api.get("/fines");
export const createFine = (fine: any) => api.post("/fines", fine);
export const updateFineStatus = (id: string, status: string) =>
  api.patch(`/fines/${id}/status`, { status });
export const deleteFine = (id: string) => api.delete(`/fines/${id}`);
export const getFinesByHouseId = (houseId: string) =>
  api.get(`/fines?houseId=${houseId}`);
