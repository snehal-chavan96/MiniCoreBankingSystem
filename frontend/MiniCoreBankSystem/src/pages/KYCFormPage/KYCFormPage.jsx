import React, { useState } from 'react';
import { FileText, Upload, CheckCircle, Info } from 'lucide-react';

// Toast component
const Toast = ({ message, type, onClose }) => {
    React.useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    
    return (
        <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-sm`}>
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{message}</span>
                <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
                    ×
                </button>
            </div>
        </div>
    );
};

const KYCForm = () => {
    const [userId, setUserId] = useState('');
    const [aadharNumber, setAadharNumber] = useState('');
    const [panNumber, setPanNumber] = useState('');
    const [documentFile, setDocumentFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState('');
    const [showGuide, setShowGuide] = useState(false);
    const [, setToast] = useState(null);

    // Validation states
    const [isAadharValid, setIsAadharValid] = useState(true);
    const [isPanValid, setIsPanValid] = useState(true);
    const [isUserIdValid, setIsUserIdValid] = useState(true);

    const showToast = (message, type) => {
        setToast({ message, type });
    };

    // Regex patterns
    const aadharRegex = /^\d{4}\s\d{4}\s\d{4}$/; // XXXX XXXX XXXX format

    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/; // ABCDE1234F format

    const handleUserIdChange = (e) => {
        const value = e.target.value;
        setUserId(value);
        setIsUserIdValid(value.trim() !== '' && !isNaN(Number(value)));
    };

    const handleAadharChange = (e) => {
        const value = e.target.value;
        const formattedValue = value.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim();
        setAadharNumber(formattedValue);
        setIsAadharValid(aadharRegex.test(formattedValue));
    };

    const handlePanChange = (e) => {
        const value = e.target.value.toUpperCase();
        setPanNumber(value);
        setIsPanValid(panRegex.test(value));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showToast("File size exceeds 5MB limit.", "error");
                setDocumentFile(null);
                setFileName('');
                return;
            }
            const acceptedTypes = ['image/png', 'image/jpeg', 'application/pdf'];
            if (!acceptedTypes.includes(file.type)) {
                showToast("Only PNG, JPG, JPEG, PDF files are allowed.", "error");
                setDocumentFile(null);
                setFileName('');
                return;
            }

            setDocumentFile(file);
            setFileName(file.name);
            showToast(`File selected: ${file.name}`, "success");
        } else {
            setDocumentFile(null);
            setFileName('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const isFormValid =
            isUserIdValid &&
            isAadharValid &&
            isPanValid &&
            userId.trim() !== '' &&
            documentFile !== null;

        if (!isFormValid) {
            showToast("Please correct the errors in the form and upload a document.", "error");
            setIsLoading(false);
            return;
        }

        // Create a FormData object
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('aadharNumber', aadharNumber.replace(/\s/g, '')); // Remove spaces for backend
        formData.append('panNumber', panNumber);
        formData.append('documentFile', documentFile); // Append the actual file object

        try {
            showToast('Processing KYC...', 'info');
            
            // Simulate API call - replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Clear form fields on successful submission
            setUserId('');
            setAadharNumber('');
            setPanNumber('');
            setDocumentFile(null);
            setFileName('');
            setIsAadharValid(true);
            setIsPanValid(true);
            setIsUserIdValid(true);
            
            showToast('KYC successfully completed!', 'success');
        } catch (err) {
            showToast(`Failed to process KYC. Please try again:  ${err}`);
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass = (isValid) =>
        `w-full px-4 py-3 border rounded-lg focus:ring-2 transition duration-200 ${
            isValid
                ? 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                : 'border-red-500 focus:ring-red-500 focus:border-red-500'
        }`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full space-y-8">
                {/* Main Form */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.01]">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-8 text-center">
                        <h1 className="text-3xl font-extrabold text-white mb-2 tracking-wide">
                            KYC Verification
                        </h1>
                        <p className="text-indigo-100 text-opacity-90 text-lg">
                            Securely complete your identity verification process
                        </p>
                    </div>

                    <div className="p-8 sm:p-10">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="userId" className="block text-sm font-semibold text-gray-800 mb-2">
                                    User ID
                                </label>
                                <input
                                    type="text"
                                    id="userId"
                                    className={inputClass(isUserIdValid)}
                                    value={userId}
                                    onChange={handleUserIdChange}
                                    required
                                    placeholder="e.g., 12345"
                                    disabled={isLoading}
                                />
                                {!isUserIdValid && userId.trim() !== '' && (
                                    <p className="mt-1 text-sm text-red-600">Please enter a valid numeric User ID.</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="aadharNumber" className="block text-sm font-semibold text-gray-800 mb-2">
                                        Aadhar Number
                                    </label>
                                    <input
                                        type="text"
                                        id="aadharNumber"
                                        className={inputClass(isAadharValid)}
                                        value={aadharNumber}
                                        onChange={handleAadharChange}
                                        required
                                        placeholder="XXXX XXXX XXXX"
                                        maxLength="14"
                                        disabled={isLoading}
                                    />
                                    {!isAadharValid && aadharNumber.trim() !== '' && (
                                        <p className="mt-1 text-sm text-red-600">Invalid Aadhar Number format.</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="panNumber" className="block text-sm font-semibold text-gray-800 mb-2">
                                        PAN Number
                                    </label>
                                    <input
                                        type="text"
                                        id="panNumber"
                                        className={inputClass(isPanValid)}
                                        value={panNumber}
                                        onChange={handlePanChange}
                                        required
                                        placeholder="ABCDE1234F"
                                        maxLength="10"
                                        disabled={isLoading}
                                    />
                                    {!isPanValid && panNumber.trim() !== '' && (
                                        <p className="mt-1 text-sm text-red-600">Invalid PAN Number format.</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="block text-sm font-semibold text-gray-800">
                                        Upload Document
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowGuide(!showGuide)}
                                        className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                                    >
                                        <Info size={16} className="mr-1" />
                                        Document Guide
                                    </button>
                                </div>

                                {/* Collapsible Guide */}
                                {showGuide && (
                                    <div className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                                        <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                                            <FileText size={18} className="mr-2 text-indigo-600" />
                                            PDF Document Structure
                                        </h3>
                                        <div className="space-y-2 text-sm text-gray-700">
                                            <div className="flex items-start">
                                                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</div>
                                                <div>
                                                    <span className="font-medium">First Page:</span> Clear image of your Aadhar Card
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</div>
                                                <div>
                                                    <span className="font-medium">Second Page:</span> Clear image of your PAN Card
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg border-gray-300 hover:border-indigo-400 transition duration-200 ease-in-out cursor-pointer group">
                                    <div className="space-y-1 text-center">
                                        <Upload className="mx-auto h-12 w-12 text-gray-400 group-hover:text-indigo-600 transition-colors duration-200" />
                                        <div className="flex text-sm text-gray-600">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                            >
                                                <span>Upload a file</span>
                                                <input
                                                    id="file-upload"
                                                    name="file-upload"
                                                    type="file"
                                                    className="sr-only"
                                                    onChange={handleFileChange}
                                                    accept=".png,.jpg,.jpeg,.pdf"
                                                    disabled={isLoading}
                                                />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, JPEG, PDF up to 5MB</p>
                                        
                                        {fileName && (
                                            <div className="mt-3 flex items-center justify-center bg-green-50 rounded-lg p-3">
                                                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                                                <span className="text-sm text-green-800 font-medium">{fileName}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {!documentFile && (
                                    <p className="mt-2 text-sm text-red-600">Please upload a document to proceed.</p>
                                )}
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading || !isAadharValid || !isPanValid || !isUserIdValid || !documentFile}
                                    className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:-translate-y-0.5 ${
                                        (isLoading || !isAadharValid || !isPanValid || !isUserIdValid || !documentFile) 
                                            ? 'opacity-60 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Submitting...
                                        </>
                                    ) : 'Submit KYC'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Quick Tips */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                        Steps to upload pdf file
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                            <h4 className="font-medium text-gray-800 mb-1">Clear Images</h4>
                            <p className="text-gray-600">Ensure documents are clearly visible and legible</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <h4 className="font-medium text-gray-800 mb-1">Correct Format</h4>
                            <p className="text-gray-600">Follow the PDF structure: Aadhar first, PAN second</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Upload className="h-6 w-6 text-purple-600" />
                            </div>
                            <h4 className="font-medium text-gray-800 mb-1">Size Limit</h4>
                            <p className="text-gray-600">Keep your document under 5MB for faster processing</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KYCForm;