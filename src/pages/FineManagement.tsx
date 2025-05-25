import React, { useState, useEffect } from "react";
import { Search, AlertCircle, Plus, Filter, Trash } from "lucide-react";
import {
  getFines,
  createFine,
  updateFineStatus,
  getHouses,
  deleteFine,
} from "../api";

interface Fine {
  _id: string;
  houseId: {
    _id: string;
    houseNumber: string;
    residentName: string;
  };
  amount: number;
  reason: string;
  createdAt: string;
  status: "submitted" | "pending" | "overdue";
}

interface House {
  _id: string;
  houseNumber: string;
  residentName: string;
}

const FineManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddFine, setShowAddFine] = useState(false);
  const [fines, setFines] = useState<Fine[]>([]);
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [finesResponse, housesResponse] = await Promise.all([
          getFines(),
          getHouses(),
        ]);

        setFines(finesResponse.data);
        setHouses(housesResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to fetch data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddFine = async () => {
    const houseId = (
      document.getElementById("houseNumber") as HTMLSelectElement
    ).value;
    const amount = parseFloat(
      (document.getElementById("fineAmount") as HTMLInputElement).value
    );
    const reason = (document.getElementById("reason") as HTMLSelectElement)
      .value;
    const notes = (document.getElementById("notes") as HTMLTextAreaElement)
      .value;

    if (!houseId || isNaN(amount) || !reason) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const fineData = {
        houseId,
        amount,
        reason: notes ? `${reason} - ${notes}` : reason,
        status: "pending",
      };

      await createFine(fineData);
      setShowAddFine(false);

      // Refresh fines data
      const finesResponse = await getFines();
      setFines(finesResponse.data);
    } catch (error) {
      console.error("Failed to add fine:", error);
      alert("Failed to add fine. Please try again.");
    }
  };

  const handleUpdateStatus = async (
    fineId: string,
    newStatus: "submitted" | "pending" | "overdue"
  ) => {
    try {
      await updateFineStatus(fineId, newStatus);

      // Update local state
      setFines(
        fines.map((fine) =>
          fine._id === fineId ? { ...fine, status: newStatus } : fine
        )
      );
    } catch (error) {
      console.error("Failed to update fine status:", error);
      alert("Failed to update fine status. Please try again.");
    }
  };

  const handleDeleteFine = async (fineId: string) => {
    if (window.confirm("Are you sure you want to delete this fine?")) {
      try {
        await deleteFine(fineId);

        // Update local state by removing the deleted fine
        setFines(fines.filter((fine) => fine._id !== fineId));
      } catch (error) {
        console.error("Failed to delete fine:", error);
        alert("Failed to delete fine. Please try again.");
      }
    }
  };

  // Filter fines based on search query and status filter
  const filteredFines = fines.filter((fine) => {
    // Skip fines with null/undefined houseId
    if (!fine.houseId) return false;

    const matchesSearch =
      (fine.houseId.houseNumber
        ? fine.houseId.houseNumber
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        : false) ||
      (fine.houseId.residentName
        ? fine.houseId.residentName
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        : false) ||
      (fine.reason
        ? fine.reason.toLowerCase().includes(searchQuery.toLowerCase())
        : false);

    const matchesFilter =
      selectedFilter === "all" || fine.status === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  // Get stats
  const totalFines = fines.length;
  const pendingFines = fines.filter((fine) => fine.status === "pending").length;
  const submittedFines = fines.filter(
    (fine) => fine.status === "submitted"
  ).length;
  const overdueFines = fines.filter((fine) => fine.status === "overdue").length;

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Fine Management
        </h1>

        <div className="mt-4 md:mt-0 flex items-center">
          <button
            onClick={() => setShowAddFine(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Fine
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="rounded-full bg-red-100 p-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-500">
                Total Fines
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {totalFines}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="rounded-full bg-yellow-100 p-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-500">Pending</div>
              <div className="text-lg font-semibold text-gray-900">
                {pendingFines}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-2">
              <AlertCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-500">Submitted</div>
              <div className="text-lg font-semibold text-gray-900">
                {submittedFines}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="rounded-full bg-red-100 p-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-500">Overdue</div>
              <div className="text-lg font-semibold text-gray-900">
                {overdueFines}
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
              placeholder="Search by house number, resident name, or reason"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="pl-3 pr-10 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Fines</option>
              <option value="submitted">Submitted</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>

        {/* Fines Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">{error}</div>
          ) : (
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
                    Fine Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Reason
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
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
                {filteredFines.map((fine) => (
                  <tr
                    key={fine._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {fine.houseId.houseNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            {fine.houseId.residentName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{fine.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{fine.reason}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(fine.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${
                          fine.status === "submitted"
                            ? "bg-green-100 text-green-800"
                            : fine.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {fine.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleDeleteFine(fine._id)}
                          className="inline-flex items-center px-2 py-1 text-sm font-medium text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors duration-150"
                        >
                          <Trash className="h-4 w-4 mr-1.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">{filteredFines.length}</span> of{" "}
                <span className="font-medium">{filteredFines.length}</span>{" "}
                results
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Fine Modal */}
      {showAddFine && (
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
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Add New Fine
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label
                          htmlFor="houseNumber"
                          className="block text-sm font-medium text-gray-700"
                        >
                          House Number
                        </label>
                        <select
                          id="houseNumber"
                          name="houseNumber"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                          <option value="">Select House</option>
                          {houses.map((house) => (
                            <option key={house._id} value={house._id}>
                              {house.houseNumber} ({house.residentName})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="fineAmount"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Fine Amount
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">₹</span>
                          </div>
                          <input
                            type="text"
                            name="fineAmount"
                            id="fineAmount"
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="reason"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Reason
                        </label>
                        <select
                          id="reason"
                          name="reason"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                          <option value="">Select Reason</option>
                          <option value="Late bill payment">
                            Late bill payment
                          </option>
                          <option value="Parking violation">
                            Parking violation
                          </option>
                          <option value="Garbage disposal violation">
                            Garbage disposal violation
                          </option>
                          <option value="Noise complaint">
                            Noise complaint
                          </option>
                          <option value="Property damage">
                            Property damage
                          </option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="notes"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Additional Notes (Optional)
                        </label>
                        <textarea
                          id="notes"
                          name="notes"
                          rows={3}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                          placeholder="Add any additional details here..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleAddFine}
                >
                  Add Fine
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowAddFine(false)}
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

export default FineManagement;
