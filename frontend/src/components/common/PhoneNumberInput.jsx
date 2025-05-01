import { useState } from "react";

const countryCodes = [
  { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸" },
  { code: "IN", name: "India", dialCode: "+91", flag: "🇮🇳" },
  { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
  { code: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦" },
  { code: "AU", name: "Australia", dialCode: "+61", flag: "🇦🇺" },
  { code: "DE", name: "Germany", dialCode: "+49", flag: "🇩🇪" },
  { code: "FR", name: "France", dialCode: "+33", flag: "🇫🇷" },
  { code: "BR", name: "Brazil", dialCode: "+55", flag: "🇧🇷" },
  { code: "JP", name: "Japan", dialCode: "+81", flag: "🇯🇵" },
  { code: "CN", name: "China", dialCode: "+86", flag: "🇨🇳" },
  { code: "RU", name: "Russia", dialCode: "+7", flag: "🇷🇺" },
  { code: "ZA", name: "South Africa", dialCode: "+27", flag: "🇿🇦" },
];

const PhoneNumberInput = ({ value, onChange, defaultCountry = "IN" }) => {
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(
    countryCodes.find(country => country.code === defaultCountry) || countryCodes[0]
  );

  const handlePhoneNumberChange = (e) => {
    const phoneNumber = e.target.value.replace(/\D/g, '');
    onChange(`${selectedCountry.dialCode}${phoneNumber}`);
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setShowCountryDropdown(false);
    const phoneWithoutCode = value.replace(/^\+\d+/, '');
    onChange(`${country.dialCode}${phoneWithoutCode}`);
  };

  const displayNumber = value.replace(new RegExp(`^\\${selectedCountry.dialCode}`), '');

  return (
    <div className="relative">
      <label className="block text-white text-sm mb-1">Phone Number*</label>
      <div className="flex">
        <button
          type="button"
          className="flex items-center px-3 border border-white border-opacity-30 bg-transparent text-white rounded-l"
          onClick={() => setShowCountryDropdown(!showCountryDropdown)}
        >
          <span className="mr-2">{selectedCountry.flag}</span>
          <span>{selectedCountry.dialCode}</span>
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <input
          type="tel"
          className="flex-1 p-2 border-t border-b border-r border-white border-opacity-30 bg-transparent text-white placeholder-gray-200 rounded-r"
          placeholder="9999999999"
          value={displayNumber}
          onChange={handlePhoneNumberChange}
          required
        />
      </div>

      {showCountryDropdown && (
        <div className="absolute z-10 mt-1 w-64 max-h-60 overflow-auto bg-gray-800 rounded-md shadow-lg border border-gray-700">
          <div className="py-1">
            {countryCodes.map((country) => (
              <button
                key={country.code}
                type="button"
                className={`flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-700 ${
                  selectedCountry.code === country.code ? 'bg-gray-700' : ''
                }`}
                onClick={() => handleCountrySelect(country)}
              >
                <span className="mr-2">{country.flag}</span>
                <span className="mr-2">{country.dialCode}</span>
                <span>{country.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneNumberInput;