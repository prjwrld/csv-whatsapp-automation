
import React, { useState, useCallback, useMemo } from 'react';
import type { CSVRow } from './types';

// --- SVG Icon Components ---

const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12.75h18" transform="translate(0, 8)" />
  </svg>
);

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const WhatsappIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 448 512">
        <path fill="currentColor" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.8 0-67.6-9.5-97.8-26.7l-7.1-4.2-73.3 19.3 19.3-71.1-4.5-7.4c-18.3-30.7-28-65.4-28-101.3 0-95.7 78.8-173.5 176.1-173.5 46.5 0 89.9 18.1 123.1 51.3 33.2 33.2 51.3 76.6 51.3 123.1 0 95.7-78.8 173.5-176.1 173.5zm93-164.4c-11.4-5.7-67.1-33.1-77.5-36.9-10.4-3.8-18.1 3.8-22 9.2-3.9 5.4-29.5 36.9-36.2 43.5-6.7 6.7-13.4 7.5-24.8 2.5-11.4-5.1-48.2-17.7-91.8-56.9-34-30.2-57.5-67.1-64.2-78.5-6.7-11.4-0.7-17.5 4.8-23.2 5-5.2 11.4-13.4 17-20.1 5.7-6.7 7.5-11.4 11.4-19.1 3.9-7.5 1.9-14.2-1.9-19.9-3.8-5.7-18.1-43.5-24.8-59.3-6.5-15.8-13.2-13.5-18.1-13.5-4.9 0-10.4 0-15.8 0-5.4 0-14.2 1.9-21.9 9.2-7.7 7.2-29.5 28.9-29.5 70.1 0 41.2 30.2 81.3 34.4 86.8 4.2 5.4 59.3 94.3 144.3 129.2 20.2 8.4 36.3 13.4 48.8 17 22.9 7.5 43.5 6.7 59.3 4.2 18.1-2.9 57.5-23.5 65.6-46.4 8.1-23.5 8.1-43.5 5.7-46.4-2.4-3.9-9.2-6.7-19.9-11.4z" />
    </svg>
);


// --- Reusable UI Components ---

interface StepCardProps {
  step: number;
  title: string;
  isComplete: boolean;
  isActive: boolean;
  children: React.ReactNode;
}

const StepCard: React.FC<StepCardProps> = ({ step, title, isComplete, isActive, children }) => {
  const activeClasses = isActive ? 'border-indigo-500 ring-4 ring-indigo-500/30' : 'border-gray-700';
  const completeClasses = isComplete ? 'border-green-500' : '';

  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm border ${activeClasses} ${completeClasses} rounded-2xl shadow-lg transition-all duration-300 w-full`}>
      <div className="p-5 border-b border-gray-700 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${isComplete ? 'bg-green-500' : isActive ? 'bg-indigo-500' : 'bg-gray-600'}`}>
            {isComplete ? <CheckCircleIcon className="w-6 h-6" /> : step}
          </div>
          <h2 className="text-xl font-semibold text-white">{title}</h2>
        </div>
      </div>
      {isActive && <div className="p-6">{children}</div>}
    </div>
  );
};

// --- Child Components defined outside App to prevent re-creation ---

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  fileName: string | null;
}
const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, fileName }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <label
        htmlFor="dropzone-file"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-900/50 hover:bg-gray-800/60 transition-colors duration-300 ${isDragging ? 'border-indigo-500' : ''}`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <UploadIcon className="w-10 h-10 mb-4 text-gray-400" />
          <p className="mb-2 text-sm text-gray-400">
            <span className="font-semibold text-indigo-400">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">CSV files only</p>
          {fileName && <p className="mt-4 text-sm font-medium text-green-400">Uploaded: {fileName}</p>}
        </div>
        <input id="dropzone-file" type="file" accept=".csv" className="hidden" onChange={handleChange}/>
      </label>
    </div>
  );
};


interface ColumnSelectorProps {
  headers: string[];
  data: CSVRow[];
  selectedColumn: string | null;
  onColumnSelect: (header: string) => void;
}
const ColumnSelector: React.FC<ColumnSelectorProps> = ({ headers, data, selectedColumn, onColumnSelect }) => {
  return (
    <div>
      <label htmlFor="column-select" className="block mb-2 text-sm font-medium text-gray-300">Select the column containing phone numbers:</label>
      <select
        id="column-select"
        value={selectedColumn || ''}
        onChange={(e) => onColumnSelect(e.target.value)}
        className="bg-gray-900 border border-gray-600 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
      >
        <option value="" disabled>Choose a column</option>
        {headers.map(header => <option key={header} value={header}>{header}</option>)}
      </select>
      {data.length > 0 && (
        <div className="mt-4 max-h-64 overflow-auto rounded-lg border border-gray-700">
          <table className="w-full text-sm text-left text-gray-400">
            <thead className="text-xs text-gray-300 uppercase bg-gray-700/50 sticky top-0">
              <tr>
                {headers.map(header => (
                  <th key={header} scope="col" className="px-6 py-3">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 10).map((row, rowIndex) => (
                <tr key={rowIndex} className="bg-gray-800/50 border-b border-gray-700 hover:bg-gray-700/50">
                  {headers.map(header => (
                    <td key={`${rowIndex}-${header}`} className="px-6 py-4 truncate max-w-xs">{row[header]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {data.length > 10 && <p className="text-center text-xs text-gray-500 p-2 bg-gray-800/50">Showing first 10 of {data.length} rows</p>}
        </div>
      )}
    </div>
  );
};


interface MessageSenderProps {
    phoneNumbers: string[];
    message: string;
    onMessageChange: (message: string) => void;
}
const MessageSender: React.FC<MessageSenderProps> = ({ phoneNumbers, message, onMessageChange }) => {
    const cleanAndFormatNumber = (num: string) => num.replace(/\D/g, '');

    const handleSendAll = () => {
        if (!message || phoneNumbers.length === 0) return;

        const confirmSend = window.confirm(
            `This will attempt to open ${phoneNumbers.length} WhatsApp tabs. Your browser might block some of them.\n\nPlease check for a pop-up blocker notification in your address bar and "Allow pop-ups" for this site.\n\nDo you want to continue?`
        );

        if (confirmSend) {
            let openedCount = 0;
            const totalNumbers = phoneNumbers.length;
            
            phoneNumbers.forEach(number => {
                const formattedNumber = cleanAndFormatNumber(number);
                if (formattedNumber) {
                    const whatsappLink = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;
                    // window.open returns null if the pop-up is blocked.
                    const newWindow = window.open(whatsappLink, '_blank');
                    if (newWindow) {
                        openedCount++;
                    }
                }
            });

            if (openedCount < totalNumbers) {
                // Use a short timeout to ensure the alert doesn't interfere with the final window.open call.
                setTimeout(() => {
                    alert(
                        `Opened ${openedCount} of ${totalNumbers} chats.\n\nYour browser's pop-up blocker may have prevented some tabs from opening. Please look for a notification in your address bar and choose to "Always allow pop-ups" from this site for this feature to work correctly.`
                    );
                }, 500);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-end mb-2">
                 <label htmlFor="message" className="block text-sm font-medium text-gray-300">Compose your message:</label>
                 <button
                    onClick={handleSendAll}
                    disabled={!message || phoneNumbers.length === 0}
                    aria-label={`Send message to all ${phoneNumbers.length} contacts`}
                    className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-center text-white rounded-lg transition-colors ${
                        message && phoneNumbers.length > 0
                            ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500/50'
                            : 'bg-gray-600 cursor-not-allowed'
                    }`}
                >
                    <WhatsappIcon className="w-4 h-4" />
                    Send to All ({phoneNumbers.length})
                </button>
            </div>
            <textarea
                id="message"
                rows={4}
                value={message}
                onChange={(e) => onMessageChange(e.target.value)}
                className="block p-2.5 w-full text-sm text-gray-300 bg-gray-900 rounded-lg border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Write your message here..."
            ></textarea>
            <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-2">Contacts to Message ({phoneNumbers.length})</h3>
                <div className="max-h-80 overflow-y-auto pr-2 space-y-2">
                    {phoneNumbers.map((number, index) => {
                        const formattedNumber = cleanAndFormatNumber(number);
                        const whatsappLink = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;
                        return (
                            <div key={index} className="flex items-center justify-between bg-gray-900/70 p-3 rounded-lg">
                                <p className="text-gray-300 font-mono">{number}</p>
                                <a
                                    href={message && formattedNumber ? whatsappLink : '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => (!message || !formattedNumber) && e.preventDefault()}
                                    className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-center text-white rounded-lg transition-colors ${message && formattedNumber ? 'bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-500/50' : 'bg-gray-600 cursor-not-allowed'}`}
                                >
                                    <WhatsappIcon className="w-4 h-4" />
                                    Send
                                </a>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};


// --- Main App Component ---

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const parseCSV = useCallback((text: string) => {
    try {
        const lines = text.trim().split(/\r\n|\n/);
        if (lines.length < 2) {
          throw new Error("CSV must have a header row and at least one data row.");
        }
        const headers = lines[0].split(',').map(h => h.trim());
        const data = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          // Allow for empty last column if line ends with comma
          if (values.length !== headers.length && values.length !== headers.length -1) {
              return null;
          }
          const row: CSVRow = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          return row;
        }).filter((row): row is CSVRow => row !== null && Object.values(row).some(val => val !== ''));
      
        if (data.length === 0) {
            throw new Error("No valid data rows found in the CSV file.");
        }
        
        setCsvHeaders(headers);
        setCsvData(data);
        setCurrentStep(2);
        setError(null);
    } catch(e: any) {
        setError(`Failed to parse CSV: ${e.message}`);
        resetState();
    }
  }, []);


  const handleFileUpload = useCallback((uploadedFile: File) => {
    if (uploadedFile.type !== 'text/csv') {
      setError('Invalid file type. Please upload a .csv file.');
      return;
    }
    setFile(uploadedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseCSV(text);
    };
    reader.onerror = () => {
        setError("Error reading the file.");
        resetState();
    }
    reader.readAsText(uploadedFile);
  }, [parseCSV]);

  const handleColumnSelect = useCallback((header: string) => {
    setSelectedColumn(header);
    const numbers = csvData.map(row => row[header]).filter(Boolean);
    setPhoneNumbers(numbers);
    setCurrentStep(3);
  }, [csvData]);

  const resetState = () => {
      setCurrentStep(1);
      setFile(null);
      setCsvData([]);
      setCsvHeaders([]);
      setSelectedColumn(null);
      setPhoneNumbers([]);
      setMessage('');
      // Keep error for display
  }

  const backgroundStyle = useMemo(() => ({
    background: "radial-gradient(circle, rgba(31, 41, 55, 0.9) 0%, rgba(17, 24, 39, 1) 80%)",
  }), []);

  return (
    <div style={backgroundStyle} className="min-h-screen text-white p-4 sm:p-8 font-sans antialiased">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-2">
            <WhatsappIcon className="w-10 h-10 text-green-400" />
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-teal-300 to-indigo-400">
              WhatsApp CSV Messenger
            </h1>
          </div>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Automate your messaging workflow. Upload a CSV, pick your contacts, and start chatting.
          </p>
        </header>
        
        {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative mb-6" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
                <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
                    <svg className="fill-current h-6 w-6 text-red-400" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                </span>
            </div>
        )}

        <main className="space-y-6">
          <StepCard step={1} title="Upload CSV File" isComplete={currentStep > 1} isActive={currentStep === 1}>
            <FileUpload onFileUpload={handleFileUpload} fileName={file?.name || null} />
          </StepCard>

          <StepCard step={2} title="Select Column & Preview" isComplete={currentStep > 2} isActive={currentStep === 2}>
            <ColumnSelector headers={csvHeaders} data={csvData} selectedColumn={selectedColumn} onColumnSelect={handleColumnSelect} />
          </StepCard>
          
          <StepCard step={3} title="Compose & Send Messages" isComplete={false} isActive={currentStep === 3}>
            <MessageSender phoneNumbers={phoneNumbers} message={message} onMessageChange={setMessage} />
          </StepCard>
        </main>

        <footer className="text-center mt-12 text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} WhatsApp CSV Messenger. Built for efficiency.</p>
        </footer>
      </div>
    </div>
  );
}
