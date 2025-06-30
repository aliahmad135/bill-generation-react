import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface BillData {
  _id: string;
  houseNumber: string;
  residentName: string;
  billNo?: string;
  houseSize: string;
  plotNo?: string;
  area?: string;
  phone?: string;
  month: Date | string;
  dueDate: Date | string;
  amount: number;
  status: string;
  masjidFund?: number;
  guardService?: number;
  streetLighting?: number;
  gardener?: number;
  fineAmount?: number;
  billHistory?: Array<{
    billingMonth: string;
    amount: number;
    receivedAmount: number;
  }>;
}

/**
 * Generates a PDF bill based on the provided bill data
 */
export const generateBillPDF = async (billData: BillData): Promise<void> => {
  // Create a temporary div to render the bill HTML
  const billElement = document.createElement("div");
  billElement.style.width = "210mm";
  billElement.style.padding = "5mm";
  billElement.style.backgroundColor = "white";
  billElement.style.fontFamily = "Arial, sans-serif";

  // Format dates
  const issueDateObj = new Date();
  const issueDate = issueDateObj.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Use current month for bill period rather than the month stored in the database
  const currentMonth = issueDateObj;
  const monthName = currentMonth.toLocaleString("default", { month: "long" });
  const year = currentMonth.getFullYear();

  // Calculate the first and last day of the current month
  const firstDay = new Date(year, currentMonth.getMonth(), 1);
  const lastDay = new Date(year, currentMonth.getMonth() + 1, 0);

  // Calculate total amount including fine if present
  const totalAmount = billData.amount + (billData.fineAmount || 0);

  const billPeriod = `${firstDay
    .getDate()
    .toString()
    .padStart(2, "0")}-${monthName.substring(
    0,
    3
  )}-${year} To ${lastDay.getDate()}-${monthName.substring(0, 3)}-${year}`;

  // Function to generate a single bill HTML
  const generateSingleBillHTML = () => `
    <div style="border: 2px solid #000; padding: 8px; margin-bottom: 10px; position: relative;">
      <!-- Logo at the top -->
      <div style="text-align: center; margin-bottom: 8px;">
        <img src='/maqbool-garden.jpeg' alt='Maqbool Garden Logo' style='height: 60px; margin-bottom: 4px;' />
      </div>
      <div style="text-align: center; margin-bottom: 8px; font-weight: bold; font-size: 12px;">
        Maqbool Garden Housing Society
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
        <div>
          <table style="border-collapse: collapse; font-size: 10px;">
            <tr>
              <td style="border: 1px solid #000; padding: 3px; white-space: nowrap;">Date of issue:</td>
              <td style="border: 1px solid #000; padding: 3px; min-width: 60px;">${issueDate}</td>
              <td style="border: 1px solid #000; padding: 3px; white-space: nowrap;">Due Date:</td>
              <td style="border: 1px solid #000; padding: 3px; min-width: 60px;">${formatDate(
                billData.dueDate
              )}</td>
            </tr>
          </table>
        </div>
      </div>    
      <div style="margin-bottom: 8px;">
        <div style="font-size: 10px;"><strong>Name:</strong> ${
          billData.residentName
        }</div>
        <div style="font-size: 10px;"><strong>House Number:</strong> ${
          billData.houseNumber
        }</div>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
        <div style="width: 48%;">
          <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
            <tr style="background-color: #f2f2f2;">
              <th style="border: 1px solid #000; padding: 3px; text-align: left;">Bill Payment History</th>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 3px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <th style="border-bottom: 1px solid #000; padding: 2px; text-align: left; width: 40%;">Billing Month</th>
                    <th style="border-bottom: 1px solid #000; padding: 2px; text-align: right; width: 30%;">Bill Amount</th>
                    <th style="border-bottom: 1px solid #000; padding: 2px; text-align: right; width: 30%;">Received Amount</th>
                  </tr>
                  ${billData?.billHistory
                    ?.map(
                      (row) => `
                        <tr>
                          <td style="padding: 2px; text-align: left;">${
                            row.billingMonth
                          }</td>
                          <td style="padding: 2px; text-align: right;">${row.amount.toLocaleString()}</td>
                          <td style="padding: 2px; text-align: right;">${row.receivedAmount.toLocaleString()}</td>
                        </tr>
                      `
                    )
                    .join("")}
                </table>
              </td>
            </tr>
          </table>
        </div>
        <div style="width: 48%;">
          <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
            <tr>
              <td style="border: 1px solid #000; padding: 3px; background-color: #f2f2f2;">Arrears:</td>
              <td style="border: 1px solid #000; padding: 3px; text-align: right;">Rs.</td>
              <td style="border: 1px solid #000; padding: 3px; text-align: right;">0</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 3px; background-color: #f2f2f2;">MASJID FUND</td>
              <td style="border: 1px solid #000; padding: 3px; text-align: right;">Rs.</td>
              <td style="border: 1px solid #000; padding: 3px; text-align: right;">${
                billData.masjidFund?.toLocaleString() ?? 0
              }</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 3px; background-color: #f2f2f2;">GUARD SERVICE</td>
              <td style="border: 1px solid #000; padding: 3px; text-align: right;">Rs.</td>
              <td style="border: 1px solid #000; padding: 3px; text-align: right;">${
                billData.guardService?.toLocaleString() ?? 0
              }</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 3px; background-color: #f2f2f2;">STREET LIGHTING</td>
              <td style="border: 1px solid #000; padding: 3px; text-align: right;">Rs.</td>
              <td style="border: 1px solid #000; padding: 3px; text-align: right;">${
                billData.streetLighting?.toLocaleString() ?? 0
              }</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 3px; background-color: #f2f2f2;">GARDENER</td>
              <td style="border: 1px solid #000; padding: 3px; text-align: right;">Rs.</td>
              <td style="border: 1px solid #000; padding: 3px; text-align: right;">${
                billData.gardener?.toLocaleString() ?? 0
              }</td>
            </tr>
            ${
              billData.fineAmount
                ? `
            <tr>
              <td style="border: 1px solid #000; padding: 3px; background-color: #f2f2f2;">FINE</td>
              <td style="border: 1px solid #000; padding: 3px; text-align: right;">Rs.</td>
              <td style="border: 1px solid #000; padding: 3px; text-align: right;">${billData.fineAmount.toLocaleString()}</td>
            </tr>
            `
                : ""
            }
            <tr>
              <td style="border: 1px solid #000; padding: 3px; background-color: #f2f2f2; font-weight: bold;">Total Payable:</td>
              <td style="border: 1px solid #000; padding: 3px; text-align: right;">Rs.</td>
              <td style="border: 1px solid #000; padding: 3px; text-align: right; font-weight: bold;">${totalAmount.toLocaleString()}</td>
            </tr>
          </table>
        </div>
      </div>
      <div style="font-size: 8px; margin-bottom: 15px;">
        This is computer generated document as such requires no signature.<br>
        Errors and omissions excepted.
      </div>
      <div style="text-align: center; font-weight: bold; font-size: 10px; margin-bottom: 8px;">
        Complaint Timings from 9 AM to 4 PM
      </div>
    </div>
  `;

  // Generate the complete HTML with two bills side by side
  billElement.innerHTML = `
    <div style="display: flex; justify-content: space-between; gap: 10px;">
      <div style="width: 48%;">
        ${generateSingleBillHTML()}
      </div>
      <div style="width: 48%;">
        ${generateSingleBillHTML()}
      </div>
    </div>
  `;

  // Add the element to the DOM temporarily
  document.body.appendChild(billElement);

  try {
    // Convert the HTML element to canvas
    const canvas = await html2canvas(billElement, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    // Create PDF
    const pdf = new jsPDF("p", "mm", "a4");
    const imgData = canvas.toDataURL("image/png");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;

    pdf.addImage(imgData, "PNG", imgX, 0, imgWidth * ratio, imgHeight * ratio);

    // Download the PDF
    pdf.save(`Bill_${billData.houseNumber}_${monthName}_${year}.pdf`);
  } finally {
    // Clean up
    document.body.removeChild(billElement);
  }
};
