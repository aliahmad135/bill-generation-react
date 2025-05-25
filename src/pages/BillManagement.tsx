import React, { useEffect, useState } from "react";
import {
  Calendar,
  DollarSign,
  Clock,
  Search,
  Plus,
  Filter,
  Trash,
  AlertCircle,
} from "lucide-react";
import {
  getHouses,
  getBills,
  createBill,
  updateBill,
  deleteBill,
  getFines,
  getFinesByHouseId,
  updateFineStatus,
} from "../api";

interface Bill {
  _id: string;
  houseId:
    | {
        _id: string;
        houseNumber: string;
        residentName: string;
        houseSize: string;
        phone: string;
        createdAt: string;
        __v: number;
      }
    | string; // Allow both object and string formats for backward compatibility
  amount: number;
  month: Date;
  dueDate: Date;
  status: "submitted" | "pending" | "overdue";
  houseNumber?: string;
  residentName?: string;
  fineAmount?: number; // Added to store fine amount
}
interface House {
  _id: string;
  houseNumber: string;
  residentName: string;
  houseSize: string;
}

interface Fine {
  _id: string;
  houseId: any;
  amount: number;
  reason: string;
  status: "submitted" | "pending" | "overdue";
}

const BillManagement: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState("June 2023");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddBill, setShowAddBill] = useState(false);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [houseSearch, setHouseSearch] = useState("");
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
  const [allHouses, setAllHouses] = useState<House[]>([]);
  const [showHouseDropdown, setShowHouseDropdown] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [fines, setFines] = useState<Fine[]>([]);

  const calculateTotal = (houseSize: string) => {
    const [sizeValue, sizeUnit] = houseSize.split(" ");
    const marlas =
      sizeUnit === "kanal" ? parseInt(sizeValue) * 20 : parseInt(sizeValue);
    return (marlas * 100).toLocaleString();
  };

  const handleAddBill = async () => {
    if (!selectedHouse) {
      alert("Please select a house");
      return;
    }
    const billData = {
      houseId: selectedHouse._id,
      month: (document.getElementById("month") as HTMLSelectElement).value,
      dueDate: (document.getElementById("dueDate") as HTMLInputElement).value,
    };

    try {
      await createBill(billData);
      setShowAddBill(false);
      const billsResponse = await getBills();
      setBills(billsResponse.data);
      window.location.reload();
    } catch (error) {
      console.error("Failed to create bill:", error);
      alert("Failed to create bill: " + (error as any).response?.data?.message);
    }
  };

  const handleEditClick = (bill: Bill) => {
    setEditingBill(bill);

    // Find the corresponding house when editing a bill
    if (typeof bill.houseId === "object" && bill.houseId !== null) {
      const houseData = {
        _id: bill.houseId._id,
        houseNumber: bill.houseId.houseNumber,
        residentName: bill.houseId.residentName,
        houseSize: bill.houseId.houseSize,
      };
      setSelectedHouse(houseData);
    } else {
      // If houseId is a string, find the house in allHouses
      const house = allHouses.find((h) => h._id === bill.houseId);
      if (house) {
        setSelectedHouse(house);
      }
    }

    setShowEditModal(true);
  };
  const handleDeleteBill = async (billId: string) => {
    if (window.confirm("Are you sure you want to delete this bill?")) {
      try {
        await deleteBill(billId);
        setBills(bills.filter((bill) => bill._id !== billId));
      } catch (error: unknown) {
        if (error instanceof Error) {
          alert("Failed to delete bill: " + error.message);
        } else {
          alert("Failed to delete bill");
        }
      }
    }
  };

  const handleUpdateBill = async () => {
    if (!editingBill) return;

    try {
      const newStatus = (
        document.getElementById("editStatus") as HTMLSelectElement
      ).value;
      const houseId =
        typeof editingBill.houseId === "object"
          ? editingBill.houseId._id
          : editingBill.houseId;

      const updatedData = {
        amount: editingBill.amount,
        month:
          (document.getElementById("editMonth") as HTMLInputElement).value +
          "-01",
        dueDate: (document.getElementById("editDueDate") as HTMLInputElement)
          .value,
        status: newStatus,
      };

      await updateBill(editingBill._id, updatedData);

      // If status is being changed, update all fines for this house to match the new status
      const oldStatus = editingBill.status;
      if (newStatus !== oldStatus) {
        // Get all fines for this house
        const houseFines = fines.filter((fine) => {
          if (!fine.houseId) return false;
          return (
            (typeof fine.houseId === "object"
              ? fine.houseId._id
              : fine.houseId) === houseId
          );
        });

        // Update the status of all fines
        const fineUpdatePromises = houseFines.map((fine) =>
          updateFineStatus(fine._id, newStatus)
        );

        await Promise.all(fineUpdatePromises);
      }

      // Clean up modal state
      handleCloseEditModal();

      // Refresh bills list
      const billsResponse = await getBills();
      setBills(billsResponse.data);

      // Refresh fines list
      const finesResponse = await getFines();
      setFines(finesResponse.data);
    } catch (error) {
      console.error("Failed to update bill:", error);
      alert(
        `Failed to update bill: ${
          error instanceof Error
            ? error.message
            : typeof error === "object" && error !== null && "response" in error
            ? (error.response as any)?.data?.message
            : "An unknown error occurred"
        }`
      );
    }
  };

  // Add function to handle closing the edit modal
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingBill(null);
    // Don't reset selectedHouse here as it affects the Add Bill modal too
  };

  // Add this useEffect to fetch houses
  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const response = await getHouses();
        setAllHouses(response.data);
      } catch (err) {
        console.error("Failed to fetch houses:", err);
      }
    };
    fetchHouses();
  }, []);

  // Update useEffect to also fetch fines
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [billsResponse, finesResponse] = await Promise.all([
          getBills(),
          getFines(),
        ]);

        const billsData = billsResponse.data;
        const finesData = finesResponse.data;

        setFines(finesData);

        // Process bills and add fine amounts
        const processedBills = billsData.map((bill: any) => {
          // Ensure we have proper houseId object and extract info
          let houseNumber = "";
          let residentName = "";
          let houseId = bill.houseId;

          if (typeof bill.houseId === "object" && bill.houseId !== null) {
            houseNumber = bill.houseId.houseNumber || "";
            residentName = bill.houseId.residentName || "";
          }

          // Get fines for this house that are pending or overdue
          const houseFines = finesData.filter((fine: any) => {
            // Skip if fine.houseId or bill.houseId is null/undefined
            if (!fine || !fine.houseId || !bill.houseId) return false;

            const fineHouseId =
              typeof fine.houseId === "object" && fine.houseId !== null
                ? fine.houseId._id
                : fine.houseId;
            const billHouseId =
              typeof bill.houseId === "object" && bill.houseId !== null
                ? bill.houseId._id
                : bill.houseId;

            // Skip if either ID is null/undefined
            if (!fineHouseId || !billHouseId) return false;

            return (
              fineHouseId === billHouseId &&
              (fine.status === "pending" ||
                fine.status === "overdue" ||
                fine.status === "submitted")
            );
          });

          // Calculate total fine amount
          const fineAmount = houseFines.reduce(
            (sum: number, fine: any) => sum + fine.amount,
            0
          );

          return {
            ...bill,
            houseNumber,
            residentName,
            fineAmount: fineAmount > 0 ? fineAmount : 0,
          };
        });

        console.log("Processed Bills:", processedBills);
        setBills(processedBills);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Add filtered houses calculation
  const filteredHouses = allHouses.filter((house) =>
    house.houseNumber.toLowerCase().includes(houseSearch.toLowerCase())
  );

  // Get unique months from the bills
  const months = Array.from(
    new Set(
      bills.map((bill) => {
        try {
          return new Date(bill.month).toLocaleString("default", {
            month: "long",
            year: "numeric",
          });
        } catch (err) {
          console.error("Error parsing date:", bill.month);
          return "Unknown";
        }
      })
    )
  );

  // Filter bills based on search query
  const filteredBills =
    searchQuery.trim() === ""
      ? bills
      : bills.filter((bill) => {
          const houseNumberMatch =
            bill.houseNumber &&
            bill.houseNumber.toLowerCase().includes(searchQuery.toLowerCase());
          const residentNameMatch =
            bill.residentName &&
            bill.residentName.toLowerCase().includes(searchQuery.toLowerCase());
          return houseNumberMatch || residentNameMatch;
        });

  // Update stats calculations
  const totalBills = bills.length;
  const pendingBills = bills.filter((bill) => bill.status === "pending").length;
  const submittedBills = bills.filter(
    (bill) => bill.status === "submitted"
  ).length;
  const overdueBills = bills.filter((bill) => bill.status === "overdue").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4 border border-red-200 rounded bg-red-50">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Bill Management
        </h1>

        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="pl-10 pr-10 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {months.length > 0 ? (
                months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))
              ) : (
                <option value="">No bills available</option>
              )}
            </select>
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>

          <button
            onClick={() => setShowAddBill(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Bill
          </button>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-500">
                Total Bills
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {totalBills}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="rounded-full bg-yellow-100 p-2">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-500">Pending</div>
              <div className="text-lg font-semibold text-gray-900">
                {pendingBills}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-2">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-500">Submitted</div>
              <div className="text-lg font-semibold text-gray-900">
                {submittedBills}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="rounded-full bg-red-100 p-2">
              <Clock className="h-5 w-5 text-red-600" />
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-500">Overdue</div>
              <div className="text-lg font-semibold text-gray-900">
                {overdueBills}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-xl relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="search"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search by house number or resident name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Export
            </button>
          </div>
        </div>

        {/* Bills Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  House Info
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Bill Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Fine Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Month
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Due Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBills.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No bills found. Try a different search or add a new bill.
                  </td>
                </tr>
              ) : (
                filteredBills.map((bill) => (
                  <tr
                    key={bill._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {typeof bill.houseId === "object" &&
                            bill.houseId !== null
                              ? bill.houseId.houseNumber
                              : bill.houseNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            {typeof bill.houseId === "object" &&
                            bill.houseId !== null
                              ? bill.houseId.residentName
                              : bill.residentName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{bill.amount ? bill.amount.toLocaleString() : 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {bill.fineAmount && bill.fineAmount > 0 ? (
                        <div className="flex items-center">
                          <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                          <div className="text-sm font-medium text-red-600">
                            ₹{bill.fineAmount.toLocaleString()}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">₹0</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {bill.month
                          ? new Date(bill.month).toLocaleString("default", {
                              month: "long",
                              year: "numeric",
                            })
                          : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {bill.dueDate
                          ? new Date(bill.dueDate).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${
                          bill.status === "submitted"
                            ? "bg-green-100 text-green-800"
                            : bill.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {bill.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <button
                          onClick={() => handleEditClick(bill)}
                          className="inline-flex items-center px-2.5 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-md transition-colors duration-150"
                        >
                          <svg
                            className="h-4 w-4 mr-1.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBill(bill._id)}
                          className="inline-flex items-center px-2.5 py-1.5 text-sm font-medium text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors duration-150"
                        >
                          <Trash className="h-4 w-4 mr-1.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination info */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {filteredBills.length > 0 ? 1 : 0}
                </span>{" "}
                to <span className="font-medium">{filteredBills.length}</span>{" "}
                of <span className="font-medium">{filteredBills.length}</span>{" "}
                results
              </p>
            </div>
            <div className="flex space-x-2">
              <button className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700">
                « Previous
              </button>
              <button className="bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-1 border text-sm font-medium">
                1
              </button>
              <button className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700">
                Next »
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Bill Modal */}
      {showAddBill && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Add New Bill
                    </h3>
                    <div className="mt-4 space-y-4">
                      {/* House Number Search Input */}
                      <div>
                        <label
                          htmlFor="houseSearch"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Search House Number{" "}
                          {selectedHouse &&
                            `- Selected: ${selectedHouse.houseNumber}`}
                        </label>
                        <div className="mt-1 relative">
                          <input
                            type="text"
                            id="houseSearch"
                            value={houseSearch}
                            className="block w-full pl-3 pr-10 py-2 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            placeholder="Start typing house number..."
                            onChange={(e) => {
                              setHouseSearch(e.target.value);
                              setSelectedHouse(null);
                              setShowHouseDropdown(true);
                            }}
                            onBlur={() =>
                              setTimeout(() => setShowHouseDropdown(false), 150)
                            }
                            onFocus={() => {
                              if (houseSearch) setShowHouseDropdown(true);
                            }}
                          />
                        </div>
                        {showHouseDropdown &&
                          houseSearch &&
                          filteredHouses.length > 0 && (
                            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                              {filteredHouses.map((house) => (
                                <div
                                  key={house._id}
                                  onMouseDown={() => {
                                    setSelectedHouse(house);
                                    setHouseSearch(house.houseNumber);
                                    setShowHouseDropdown(false);
                                  }}
                                  className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50"
                                >
                                  <div className="flex items-center">
                                    <span className="font-medium">
                                      {house.houseNumber}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>

                      {/* Bill Amount Input */}
                      <div>
                        <label
                          htmlFor="billAmount"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Bill Amount
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">₹</span>
                          </div>
                          <input
                            type="number"
                            name="billAmount"
                            id="billAmount"
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                          />
                        </div>
                      </div>

                      {/* Bill Month Selector */}
                      <div>
                        <label
                          htmlFor="month"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Bill Month
                        </label>
                        <select
                          id="month"
                          name="month"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                          {Array.from({ length: 12 }, (_, i) => {
                            const date = new Date();
                            date.setMonth(date.getMonth() + i);
                            return (
                              <option
                                key={date.toISOString()}
                                value={date.toISOString()}
                              >
                                {date.toLocaleString("default", {
                                  month: "long",
                                  year: "numeric",
                                })}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      {/* Due Date Picker */}
                      <div>
                        <label
                          htmlFor="dueDate"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Due Date
                        </label>
                        <input
                          type="date"
                          name="dueDate"
                          id="dueDate"
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleAddBill}
                >
                  Add Bill
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowAddBill(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingBill && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Edit Bill
                    </h3>
                    <div className="mt-4 space-y-4">
                      {/* House Info (readonly) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          House Number
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            className="block w-full pl-3 pr-10 py-2 bg-gray-100 border-gray-300 rounded-md sm:text-sm"
                            value={editingBill.houseNumber || ""}
                            readOnly
                          />
                        </div>
                      </div>

                      {/* Bill Amount */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Bill Amount
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                            <span className="text-gray-500">₹</span>
                          </div>
                          <input
                            type="text"
                            id="editBillAmount"
                            readOnly
                            className="bg-gray-100 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                            value={editingBill.amount.toLocaleString()}
                          />
                        </div>
                      </div>

                      {/* Bill Month */}
                      <div>
                        <label
                          htmlFor="editMonth"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Bill Month
                        </label>
                        <input
                          type="month"
                          id="editMonth"
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          defaultValue={new Date(editingBill.month)
                            .toISOString()
                            .slice(0, 7)}
                        />
                      </div>

                      {/* Due Date */}
                      <div>
                        <label
                          htmlFor="editDueDate"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Due Date
                        </label>
                        <input
                          type="date"
                          id="editDueDate"
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          defaultValue={
                            new Date(editingBill.dueDate)
                              .toISOString()
                              .split("T")[0]
                          }
                        />
                      </div>

                      {/* Status */}
                      <div>
                        <label
                          htmlFor="editStatus"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Status
                        </label>
                        <select
                          id="editStatus"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                          defaultValue={editingBill.status}
                        >
                          <option value="pending">Pending</option>
                          <option value="submitted">Submitted</option>
                          <option value="overdue">Overdue</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleUpdateBill}
                >
                  Update Bill
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCloseEditModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillManagement;
