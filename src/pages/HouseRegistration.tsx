import React, { useState } from "react";
import { Building2, Check, X } from "lucide-react";
import { createHouse } from "../api";

interface FormData {
  houseNumber: string;
  residentName: string;
  houseSize: string;
  phone: string;
}

const HouseRegistration: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    houseNumber: "",
    residentName: "",
    houseSize: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.houseNumber) {
      newErrors.houseNumber = "House number is required";
    }

    if (!formData.residentName) {
      newErrors.residentName = "Resident name is required";
    }

    if (!formData.houseSize) {
      newErrors.houseSize = "House size is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      setIsSubmitting(true);

      try {
        await createHouse(formData);
        setShowSuccess(true);

        setFormData({
          houseNumber: "",
          residentName: "",
          houseSize: "",
          phone: "",
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          setErrors((prev) => ({
            ...prev,
            submit: "Failed to register house. Please try again.",
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            submit: "Failed to register house. Please try again.",
          }));
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          House Registration
        </h1>
      </div>

      {showSuccess && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 flex items-start">
          <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
          <div>
            <p className="font-medium text-green-800">
              Registration successful!
            </p>
            <p className="text-green-700 mt-1">
              House has been registered successfully.
            </p>
          </div>
          <button
            className="ml-auto text-green-500 hover:text-green-700"
            onClick={() => setShowSuccess(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {(errors as any).submit && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-red-700">{(errors as any).submit}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900">
            House Information
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Enter details for registering a new house
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* House Number */}
            <div>
              <label
                htmlFor="houseNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                House Number <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="houseNumber"
                  name="houseNumber"
                  value={formData.houseNumber}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 rounded-md text-sm ${
                    errors.houseNumber
                      ? "border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="e.g., H-101"
                />
              </div>
              {errors.houseNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.houseNumber}
                </p>
              )}
            </div>

            {/* Resident Name */}
            <div>
              <label
                htmlFor="residentName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Resident Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="residentName"
                name="residentName"
                value={formData.residentName}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border rounded-md text-sm ${
                  errors.residentName
                    ? "border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                placeholder="e.g., John Doe"
              />
              {errors.residentName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.residentName}
                </p>
              )}
            </div>

            {/* House Size */}
            <div>
              <label
                htmlFor="houseSize"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                House Size <span className="text-red-500">*</span>
              </label>
              <select
                id="houseSize"
                name="houseSize"
                value={formData.houseSize}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border rounded-md text-sm ${
                  errors.houseSize
                    ? "border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
              >
                <option value="">Select Size</option>
                <option value="5 Marla">5 Marla</option>
                <option value="7 Marla">7 Marla</option>
                <option value="10 Marla">10 Marla</option>
                <option value="1 Kanal">1 Kanal</option>
                <option value="2 Kanal">2 Kanal</option>
              </select>
              {errors.houseSize && (
                <p className="mt-1 text-sm text-red-600">{errors.houseSize}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., +1 123-456-7890"
              />
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end space-x-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => {
                setFormData({
                  houseNumber: "",
                  residentName: "",
                  houseSize: "",
                  phone: "",
                });
                setErrors({});
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
            >
              {isSubmitting ? "Registering..." : "Register House"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HouseRegistration;
