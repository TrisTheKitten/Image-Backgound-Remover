'use client';

import { useState, ChangeEvent, DragEvent, useRef, useCallback } from 'react';
import { UploadCloud, Image as ImageIcon, WandSparkles, Download, X, CheckCircle, Loader2, Palette, Trash2, Sparkles } from 'lucide-react';

const colors = [
  { name: 'Transparent', value: 'transparent' },
  { name: 'White', value: 'bg-white' },
  { name: 'Black', value: 'bg-gray-950' },
  { name: 'Sky Blue', value: 'bg-sky-200' },
  { name: 'Mint Green', value: 'bg-emerald-200' },
  { name: 'Lavender', value: 'bg-violet-200' },
];

const CheckerboardBackground = () => (
    <div className="absolute inset-0 bg-gray-600 bg-[linear-gradient(45deg,_rgba(255,255,255,0.1)_25%,_transparent_25%,_transparent_75%,_rgba(255,255,255,0.1)_75%),_linear-gradient(45deg,_rgba(255,255,255,0.1)_25%,_transparent_25%,_transparent_75%,_rgba(255,255,255,0.1)_75%)] bg-[size:20px_20px] bg-[position:0_0,_10px_10px] opacity-30"></div>
);

export default function BackgroundRemoverEnhancedPage() {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string | null>(null);
  const [processedPreviewUrl, setProcessedPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isProcessed, setIsProcessed] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [selectedBgColor, setSelectedBgColor] = useState<string>('transparent');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = useCallback(() => {
      setOriginalImage(null);
      setOriginalPreviewUrl(null);
      setProcessedPreviewUrl(null);
      setIsProcessed(false);
      setIsProcessing(false);
      setError(null);
      setSelectedBgColor('transparent');
      if(fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const handleFileChange = useCallback((file: File | null) => {
    resetState();
    if (file && file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024) { // Max 10MB
      setOriginalImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file && file.size > 10 * 1024 * 1024) {
        setError('File is too large (max 10MB).');
    } else if (file) {
        setError('Invalid file type. Please use PNG, JPG, or WEBP.');
    } else {
        setError(null);
    }
  }, [resetState]);

  const onFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files ? e.target.files[0] : null);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!originalImage) setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (!originalImage) {
        handleFileChange(e.dataTransfer.files ? e.dataTransfer.files[0] : null);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const simulateProcessing = async () => {
    if (!originalImage || isProcessing) return;
    
    setIsProcessing(true);
    setError(null);
    setProcessedPreviewUrl(null);

    try {
      const formData = new FormData();
      formData.append('image', originalImage);

      const response = await fetch('http://localhost:5000/remove-background', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${await response.text()}`);
      }

      const blob = await response.blob();
      const processedImageUrl = URL.createObjectURL(blob);
      setProcessedPreviewUrl(processedImageUrl);
      setIsProcessing(false);
      setIsProcessed(true);
    } catch (err) {
      console.error('Error removing background:', err);
      setError(`Failed to process image: ${err instanceof Error ? err.message : String(err)}`);
      setIsProcessing(false);
    }
  };
  
  const getBgClass = (colorValue: string) => {
    if (colorValue === 'transparent') {
      return 'bg-transparent'; 
    }
    return colorValue;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-300 flex flex-col font-sans p-4 md:p-8 selection:bg-sky-700 selection:text-white">
      <header className="mb-6 md:mb-10 flex justify-between items-center">
        <div className='flex items-center gap-3'>
             <Sparkles size={32} className="text-sky-500"/>
             <h1 className="text-2xl md:text-4xl font-bold text-gray-100 tracking-tight">Remove BG for FREE</h1>
        </div>
      </header>

      <main className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
        
        {/* Upload & Preview Area */}
        <div className="lg:col-span-2 bg-gray-900 rounded-2xl p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center shadow-xl border border-gray-800 min-h-[400px] md:min-h-[500px] lg:min-h-[600px]">
          
          {!originalPreviewUrl && (
             <div 
                className={`relative w-full h-full flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-all duration-300 p-8 text-center cursor-pointer select-none ${isDragging ? 'border-sky-600 bg-gray-800 scale-[1.02]' : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'}`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={triggerFileInput}
             >
                <div className={`absolute inset-2 rounded-lg border border-dashed transition-colors duration-300 ${isDragging ? 'border-sky-700' : 'border-gray-700/50'}`}></div>
                <UploadCloud size={50} className={`mb-5 transition-colors duration-300 ${isDragging ? 'text-sky-500' : 'text-gray-600'}`} />
                <p className="text-lg md:text-xl font-medium mb-2 text-gray-200">Drag & Drop Image</p>
                <p className="text-gray-500 mb-6 text-sm">or click to upload (PNG, JPG, WEBP up to 10MB)</p>
                <input ref={fileInputRef} type="file" accept="image/png, image/jpeg, image/webp" onChange={onFileSelect} className="hidden" />
             </div>
          )}

          {originalPreviewUrl && (
            <div className='w-full h-full flex flex-col items-center justify-center relative'>
                 <div className={`relative w-full max-w-3xl aspect-video rounded-lg overflow-hidden shadow-inner border border-gray-700 ${getBgClass(selectedBgColor)}`}>
                    {selectedBgColor === 'transparent' && <CheckerboardBackground />}
                    
                    {isProcessing && (
                        <div className='absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 backdrop-blur-sm transition-opacity duration-300'>
                            <Loader2 size={40} className='animate-spin text-sky-400 mb-3'/>
                            <p className='text-base font-medium text-gray-300'>Magically removing background...</p>
                        </div>
                    )}
                    
                    {/* Processed Image (Foreground) */}
                    {processedPreviewUrl && isProcessed && (
                         <img src={processedPreviewUrl} alt="Processed Preview" className="absolute inset-0 w-full h-full object-contain z-10 transition-opacity duration-500 ease-in-out" />
                    )}
                    
                    {/* Original Image (Background/Placeholder) */}
                     <img src={originalPreviewUrl} alt="Original Preview" className={`absolute inset-0 w-full h-full object-contain z-0 transition-opacity duration-500 ease-in-out ${isProcessed ? 'opacity-20 blur-md' : 'opacity-100'}`} />
                 </div>
                 
                 {isProcessed && (
                    <p className='mt-4 text-sm text-emerald-400 flex items-center gap-1.5'><CheckCircle size={15}/> Background removed!</p>
                 )}
                 {!isProcessed && !isProcessing && (
                     <p className='mt-4 text-sm text-gray-500 flex items-center gap-1.5'><ImageIcon size={15}/> Original image loaded.</p>
                 )}
            </div>
          )}
          
          {error && (
            <div className="mt-4 w-full max-w-3xl bg-red-900/60 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm flex items-center gap-3 shadow-md">
                <X size={18}/> {error}
            </div>
          )}
        </div>

        {/* Controls Sidebar */}
        <aside className="lg:col-span-1 bg-gray-900 rounded-2xl p-5 md:p-6 flex flex-col gap-6 shadow-xl border border-gray-800 lg:min-h-[600px]">
          <div className='flex justify-between items-center border-b border-gray-800 pb-4'>
             <h2 className="text-xl font-semibold text-gray-100">Image Tools</h2>
             {originalImage && (
                 <button onClick={resetState} title="Remove Image" className='p-1.5 text-gray-500 hover:text-red-500 hover:bg-gray-800 rounded-md transition-colors'>
                    <Trash2 size={18}/>
                 </button>
             )}
          </div>
          
          <button 
            onClick={simulateProcessing}
            disabled={!originalImage || isProcessing || isProcessed}
            className="w-full flex items-center justify-center gap-2.5 px-5 py-3 bg-sky-600 hover:bg-sky-700 rounded-lg text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-sky-900/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:bg-sky-600 transform hover:-translate-y-0.5 active:translate-y-0 disabled:transform-none text-base"
          >
            {isProcessing ? <Loader2 size={20} className='animate-spin'/> : <WandSparkles size={20} />}
            {isProcessing ? 'Processing...' : (isProcessed ? 'Processed' : 'Remove Background')}
          </button>

          {isProcessed && (
            <div className='space-y-4 border-t border-gray-800 pt-5 animate-fade-in'>
                <h3 className='text-base font-medium text-gray-300 flex items-center gap-2'><Palette size={18}/> Background</h3>
                <div className='grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-3'>
                    {colors.map(color => (
                        <button 
                            key={color.name}
                            title={color.name}
                            onClick={() => setSelectedBgColor(color.value)}
                            className={`relative h-12 rounded-lg border-2 transition-all duration-150 flex items-center justify-center overflow-hidden ${selectedBgColor === color.value ? 'border-sky-500 ring-2 ring-sky-600 ring-offset-2 ring-offset-gray-900' : 'border-gray-700 hover:border-gray-600'} ${getBgClass(color.value)}`}
                        >
                           {color.value === 'transparent' && <CheckerboardBackground />}
                           {selectedBgColor === color.value && <CheckCircle size={16} className='absolute text-sky-800 z-10 mix-blend-difference invert'/>} 
                        </button>
                    ))}
                </div>
            </div>
          )}

          <div className='mt-auto border-t border-gray-800 pt-5 space-y-3'>
              <button 
                onClick={() => {
                  if (processedPreviewUrl) {
                    // Create a temporary anchor element to trigger download
                    const downloadLink = document.createElement('a');
                    downloadLink.href = processedPreviewUrl;
                    downloadLink.download = `nobg_${originalImage?.name || 'image'}.png`;
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                  }
                }} 
                disabled={!isProcessed || isProcessing}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-emerald-900/50 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:bg-emerald-600 transform hover:-translate-y-0.5 active:translate-y-0 disabled:transform-none text-base"
              >
                <Download size={20} /> Download HD
              </button>
              <p className='text-xs text-center text-gray-500 px-2'>Download your background-free image in high resolution.</p>
          </div>

        </aside>
      </main>
      <style jsx global>{`
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}
