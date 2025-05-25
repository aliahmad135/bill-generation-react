import React, { useState, useEffect } from "react";
import { Building2, Download, Search, Trash } from "lucide-react";
import {
  getHouses,
  getBills,
  deleteHouse,
  getHouseById,
  getBillsByHouseId,
  getFines,
  getFinesByHouseId,
  updateFineStatus,
} from "../api";
import { generateBillPDF } from "../utils/pdfGenerator";

interface House {
  _id: string;
  houseNumber: string;
  residentName: string;
  houseSize: string;
  phone?: string;
  billStatus: "submitted" | "overdue" | "pending";
  lastBillAmount: number;
  unpaidAmount: number;
  fineAmount: number;
  latestDueDate: string | null;
  billId?: string; // Added to store the latest bill ID
}

interface Bill {
  _id: string;
  houseId: any;
  amount: number;
  masjidFund: number;
  guardService: number;
  streetLighting: number;
  gardener: number;
  month: string;
  dueDate: string;
  status: string;
  createdAt: string;
}

interface Fine {
  _id: string;
  houseId: any;
  amount: number;
  reason: string;
  status: string;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const handleDeleteHouse = async (houseId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this house and all its bills?"
      )
    ) {
      try {
        await deleteHouse(houseId);
        setHouses(houses.filter((house) => house._id !== houseId));
      } catch (error: unknown) {
        if (error instanceof Error) {
          alert("Failed to delete house: " + error.message);
        } else {
          alert("Failed to delete house");
        }
      }
    }
  };

  const handleDownloadBill = async (house: House) => {
    if (generatingPdf) return; // Prevent multiple clicks
    setGeneratingPdf(true);

    try {
      // Get house details with all bills
      const billsResponse = await getBillsByHouseId(house._id);
      const houseBills = billsResponse.data;

      console.log("houseBills for PDF:", houseBills);

      // Get fines for this house
      const finesResponse = await getFinesByHouseId(house._id);
      const houseFines = finesResponse.data;

      // If there are no bills, show alert
      if (houseBills.length === 0) {
        alert("No bills found for this house");
        setGeneratingPdf(false);
        return;
      }

      // Filter all bills that are not submitted
      const unpaidBills = houseBills.filter(
        (bill: Bill) => bill.status !== "submitted"
      );

      // If all bills are submitted, use the most recent bill
      const allSubmitted = unpaidBills.length === 0;
      let billsToSum: Bill[];
      let pdfDueDate: string;
      let pdfAmount: number;
      let pdfMasjidFund: number;
      let pdfGuardService: number;
      let pdfStreetLighting: number;
      let pdfGardener: number;
      let pdfStatus: string;
      let pdfMonth: string;
      if (allSubmitted) {
        // Sort by due date descending
        houseBills.sort(
          (a: Bill, b: Bill) =>
            new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
        );
        const latestBill = houseBills[0];
        billsToSum = [latestBill];
        pdfDueDate = latestBill.dueDate;
        pdfAmount = latestBill.amount;
        pdfMasjidFund = latestBill.masjidFund;
        pdfGuardService = latestBill.guardService;
        pdfStreetLighting = latestBill.streetLighting;
        pdfGardener = latestBill.gardener;
        pdfStatus = latestBill.status;
        pdfMonth = latestBill.month;
      } else {
        // Sum all unpaid bills
        billsToSum = unpaidBills;
        // Find the latest due date among unpaid bills
        const latestDueDate = unpaidBills.reduce(
          (latest: Date | null, bill: Bill) => {
            const billDue = new Date(bill.dueDate);
            return !latest || billDue > latest ? billDue : latest;
          },
          null as Date | null
        );
        pdfDueDate = latestDueDate
          ? latestDueDate.toISOString()
          : unpaidBills[0].dueDate;
        pdfAmount = unpaidBills.reduce(
          (sum: number, bill: Bill) => sum + (bill.amount || 0),
          0
        );
        pdfMasjidFund = unpaidBills.reduce(
          (sum: number, bill: Bill) => sum + (bill.masjidFund || 0),
          0
        );
        pdfGuardService = unpaidBills.reduce(
          (sum: number, bill: Bill) => sum + (bill.guardService || 0),
          0
        );
        pdfStreetLighting = unpaidBills.reduce(
          (sum: number, bill: Bill) => sum + (bill.streetLighting || 0),
          0
        );
        pdfGardener = unpaidBills.reduce(
          (sum: number, bill: Bill) => sum + (bill.gardener || 0),
          0
        );
        pdfStatus = unpaidBills[0].status;
        pdfMonth = unpaidBills[0].month;
      }

      // Get all fines for this house that are not submitted (or for the latest bill if all submitted)
      let totalFineAmount = 0;
      if (allSubmitted) {
        // Only include fines for the latest bill's status
        const latestBill = billsToSum[0];
        const billFines = houseFines.filter(
          (fine: Fine) => fine && fine.status === latestBill.status
        );
        totalFineAmount = billFines.reduce(
          (sum: number, fine: Fine) => sum + (fine.amount || 0),
          0
        );
      } else {
        const unpaidFines = houseFines.filter(
          (fine: Fine) => fine && fine.status !== "submitted"
        );
        totalFineAmount = unpaidFines.reduce(
          (sum: number, fine: Fine) => sum + (fine.amount || 0),
          0
        );
      }

      // Bill history: always show all bills
      const billHistory = houseBills
        .sort(
          (a: Bill, b: Bill) =>
            new Date(a.month).getTime() - new Date(b.month).getTime()
        )
        .map((bill: Bill) => {
          const billDate = new Date(bill.month);
          // Find fines for this bill (based on the same house and matching status)
          const billFines = houseFines.filter(
            (fine: Fine) => fine && fine.status === bill.status
          );
          const billFineAmount = billFines.reduce(
            (sum: number, fine: Fine) => sum + (fine.amount || 0),
            0
          );
          const totalAmount = bill.amount + billFineAmount;
          return {
            billingMonth: `${billDate.toLocaleString("default", {
              month: "short",
            })}-${billDate.getFullYear()}`,
            amount: totalAmount,
            receivedAmount: bill.status === "submitted" ? totalAmount : 0,
          };
        });

      // Prepare data for PDF generation
      const billData = {
        _id: billsToSum[0]._id, // Use the first bill's ID
        houseNumber: house.houseNumber,
        residentName: house.residentName,
        houseSize: house.houseSize,
        phone: house.phone || "",
        month: pdfMonth,
        dueDate: pdfDueDate,
        amount: pdfAmount,
        status: pdfStatus,
        masjidFund: pdfMasjidFund,
        guardService: pdfGuardService,
        streetLighting: pdfStreetLighting,
        gardener: pdfGardener,
        fineAmount: totalFineAmount > 0 ? totalFineAmount : undefined,
        billHistory,
      };

      // Generate and download PDF
      await generateBillPDF(billData);
    } catch (error) {
      console.error("Failed to download bill:", error);
      alert("Failed to download bill. Please try again.");
    } finally {
      setGeneratingPdf(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [housesResponse, billsResponse, finesResponse] =
          await Promise.all([getHouses(), getBills(), getFines()]);

        const housesWithBills = housesResponse.data.map((house: any) => {
          const houseBills = billsResponse.data.filter(
            (bill: any) => bill.houseId._id === house._id
          );
          const lastBill = houseBills[houseBills.length - 1];

          // Calculate total unpaid amount and get latest due date
          const unpaidBills = houseBills.filter(
            (bill: any) =>
              bill.status === "pending" || bill.status === "overdue"
          );

          const unpaidAmount = unpaidBills.reduce(
            (sum: number, bill: any) => sum + bill.amount,
            0
          );

          // Calculate fines for this house (only pending/overdue fines)
          const houseFines = finesResponse.data.filter(
            (fine: any) =>
              fine &&
              fine.houseId &&
              (typeof fine.houseId === "object"
                ? fine.houseId._id === house._id
                : fine.houseId === house._id) &&
              (fine.status === "pending" || fine.status === "overdue")
          );

          const fineAmount = houseFines.reduce(
            (sum: number, fine: any) => sum + (fine.amount || 0),
            0
          );

          // Get the latest due date from unpaid bills
          let latestDueDate = null;
          if (unpaidBills.length > 0) {
            // Sort unpaid bills by due date in descending order
            unpaidBills.sort(
              (a: any, b: any) =>
                new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
            );
            latestDueDate = unpaidBills[0].dueDate;
          }

          return {
            _id: house._id,
            houseNumber: house.houseNumber,
            residentName: house.residentName,
            houseSize: house.houseSize,
            phone: house.phone,
            billStatus: lastBill?.status || "pending",
            lastBillAmount: lastBill?.amount || 0,
            unpaidAmount: unpaidAmount + fineAmount, // Add fine amount to unpaid amount
            fineAmount: fineAmount,
            latestDueDate: latestDueDate
              ? new Date(latestDueDate).toISOString().split("T")[0]
              : null,
            billId: lastBill?._id,
          };
        });
        setHouses(housesWithBills);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredHouses = houses.filter(
    (house) =>
      house.houseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      house.residentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalHouses = houses.length;
  const totalUnpaidAmount = houses.reduce(
    (sum, house) => sum + house.unpaidAmount,
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Houses</p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalHouses}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3">
              <Building2 className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Total Unpaid Amount
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                ₹{totalUnpaidAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* House Listing Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 max-w-lg relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by house number or resident name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

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
                  Unpaid Amount
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
                  Bill Status
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
                <tr key={house._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {house.houseNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {house.residentName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{house.unpaidAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {house.latestDueDate || "-"}
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
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-3">
                      <button
                        onClick={() => handleDownloadBill(house)}
                        disabled={generatingPdf}
                        className="inline-flex items-center px-2.5 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-md transition-colors duration-150"
                      >
                        <Download className="h-4 w-4 mr-1.5" />
                        Download Bill
                      </button>
                      <button
                        onClick={() => handleDeleteHouse(house._id)}
                        className="inline-flex items-center px-2.5 py-1.5 text-sm font-medium text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors duration-150"
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
        </div>

        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredHouses.length}</span>{" "}
            houses
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
