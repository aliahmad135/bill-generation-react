import React, { useState } from "react";
import { Search, Download, Filter, Building2 } from "lucide-react";

interface House {
  id: number;
  houseNumber: string;
  residentName: string;
  houseSize: string;
  billStatus: "submitted" | "pending" | "overdue";
  contactInfo: string;
}

const HouseListing: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Mock houses data
  const houses: House[] = [
    {
      id: 1,
      houseNumber: "H-101",
      residentName: "John Doe",
      houseSize: "10 Marla",
      billStatus: "submitted",
      contactInfo: "john.doe@example.com",
    },
    {
      id: 2,
      houseNumber: "H-102",
      residentName: "Sarah Johnson",
      houseSize: "5 Marla",
      billStatus: "pending",
      contactInfo: "sarah.j@example.com",
    },
    {
      id: 3,
      houseNumber: "H-103",
      residentName: "Robert Williams",
      houseSize: "1 Kanal",
      billStatus: "overdue",
      contactInfo: "robert.w@example.com",
    },
    {
      id: 4,
      houseNumber: "H-104",
      residentName: "Emily Davis",
      houseSize: "10 Marla",
      billStatus: "submitted",
      contactInfo: "emily.d@example.com",
    },
    {
      id: 5,
      houseNumber: "H-105",
      residentName: "Michael Brown",
      houseSize: "7 Marla",
      billStatus: "pending",
      contactInfo: "michael.b@example.com",
    },
    {
      id: 6,
      houseNumber: "H-106",
      residentName: "Jessica Wilson",
      houseSize: "5 Marla",
      billStatus: "submitted",
      contactInfo: "jessica.w@example.com",
    },
    {
      id: 7,
      houseNumber: "H-107",
      residentName: "David Taylor",
      houseSize: "2 Kanal",
      billStatus: "overdue",
      contactInfo: "david.t@example.com",
    },
    {
      id: 8,
      houseNumber: "H-108",
      residentName: "Jennifer Martinez",
      houseSize: "10 Marla",
      billStatus: "submitted",
      contactInfo: "jennifer.m@example.com",
    },
  ];

  // Filter houses based on search query and status filter
  const filteredHouses = houses.filter((house) => {
    const matchesSearch =
      house.houseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      house.residentName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilter === "all" || house.billStatus === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  // Prepare stats
  const totalHouses = houses.length;
  const submittedBills = houses.filter(
    (house) => house.billStatus === "submitted"
  ).length;
  const pendingBills = houses.filter(
    (house) => house.billStatus === "pending"
  ).length;
  const overdueBills = houses.filter(
    (house) => house.billStatus === "overdue"
  ).length;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">House Listing</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-2">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-500">
                Total Houses
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {totalHouses}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-2">
              <Building2 className="h-5 w-5 text-green-600" />
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
            <div className="rounded-full bg-yellow-100 p-2">
              <Building2 className="h-5 w-5 text-yellow-600" />
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
            <div className="rounded-full bg-red-100 p-2">
              <Building2 className="h-5 w-5 text-red-600" />
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
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="pl-3 pr-10 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Houses</option>
              <option value="submitted">Submitted</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>

            <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </button>

            <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Export
            </button>
          </div>
        </div>

        {/* Houses Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  House Number
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Resident Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  House Size
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Bill Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Contact Info
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
              {filteredHouses.map((house) => (
                <tr
                  key={house.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {house.houseNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {house.residentName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {house.houseSize}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${
                        house.billStatus === "submitted"
                          ? "bg-green-100 text-green-800"
                          : house.billStatus === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {house.billStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {house.contactInfo}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a
                      href="#"
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View
                    </a>
                    <a
                      href="#"
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </a>
                    <button className="text-blue-600 hover:text-blue-900 inline-flex items-center">
                      <Download className="h-4 w-4 mr-1" />
                      Bill
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">8</span> of{" "}
                <span className="font-medium">8</span> results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <a
                  href="#"
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  &laquo;
                </a>
                <a
                  href="#"
                  aria-current="page"
                  className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                >
                  1
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  &raquo;
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Bill Preview (hidden, would be shown when clicking Download Bill) */}
      <div className="hidden fixed inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Bill Preview - H-101
                  </h3>
                  <div className="mt-4">
                    {/* Bill Content would go here */}
                    <div className="border-2 border-gray-200 p-4 rounded-md">
                      <div className="text-center mb-6">
                        <h2 className="text-xl font-bold">
                          Housing Society Billing
                        </h2>
                        <p className="text-sm text-gray-600">
                          Invoice #INV-20230601-101
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">
                            Resident Information
                          </h3>
                          <p className="text-sm">John Doe</p>
                          <p className="text-sm">H-101</p>
                          <p className="text-sm">10 Marla</p>
                        </div>

                        <div className="text-right">
                          <h3 className="text-sm font-medium text-gray-500">
                            Billing Information
                          </h3>
                          <p className="text-sm">Bill Date: June 1, 2023</p>
                          <p className="text-sm">Due Date: June 30, 2023</p>
                          <p className="text-sm">Status: Submitted</p>
                        </div>
                      </div>

                      <table className="min-w-full divide-y divide-gray-200 mb-6">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Description
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr>
                            <td className="px-4 py-2 text-sm">
                              Monthly Maintenance
                            </td>
                            <td className="px-4 py-2 text-sm text-right">
                              ₹1,200
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 text-sm">
                              Security Charges
                            </td>
                            <td className="px-4 py-2 text-sm text-right">
                              ₹800
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 text-sm">Water Charges</td>
                            <td className="px-4 py-2 text-sm text-right">
                              ₹500
                            </td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr>
                            <td className="px-4 py-2 text-sm font-medium">
                              Total
                            </td>
                            <td className="px-4 py-2 text-sm font-medium text-right">
                              ₹2,500
                            </td>
                          </tr>
                        </tfoot>
                      </table>

                      <div className="text-center text-sm text-gray-500 mt-8">
                        <p>Thank you for your prompt payment.</p>
                        <p>
                          For any queries, please contact the society office.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HouseListing;
