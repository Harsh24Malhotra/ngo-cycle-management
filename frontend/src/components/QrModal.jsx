import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Download, ExternalLink } from 'lucide-react';

export default function QrModal({ cycle, onClose }) {
  const [qrUrl, setQrUrl] = useState('');

  // We point the link to your local frontend public route
  const publicViewUrl = `http://localhost:5173/cycle/${cycle.uuid}`;

  useEffect(() => {
    if (cycle?.uuid) {
      QRCode.toDataURL(publicViewUrl, { width: 300, margin: 2 }, (err, url) => {
        if (err) console.error(err);
        else setQrUrl(url);
      });
    }
  }, [cycle, publicViewUrl]);

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `QR-${cycle.cycleId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-100 shadow-xl text-center relative">
        <button onClick={onClose} className="absolute right-4 top-4 p-1.5 hover:bg-slate-100 rounded-full transition text-slate-400 hover:text-slate-600">
          <X className="h-5 w-5" />
        </button>

        <h3 className="text-lg font-bold text-slate-800 mb-1">Asset Passport QR</h3>
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-4">{cycle.cycleId}</p>

        <div className="bg-slate-50 p-4 rounded-2xl inline-block border border-slate-100/80 mb-4">
          {qrUrl ? <img src={qrUrl} alt="Asset Blueprint QR" className="w-56 h-56" /> : <div className="w-56 h-56 flex items-center justify-center text-slate-400 text-sm">Generating Matrix...</div>}
        </div>

        <div className="space-y-2">
          <a 
            href={publicViewUrl} 
            target="_blank" 
            rel="noreferrer"
            className="w-full flex items-center justify-center space-x-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2.5 rounded-xl text-sm font-bold transition"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Simulate Scan (Open in Browser)</span>
          </a>

          <button 
            onClick={downloadQR}
            className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-900 text-white py-2.5 rounded-xl text-sm font-semibold transition shadow-sm"
          >
            <Download className="h-4 w-4" />
            <span>Download PNG Matrix</span>
          </button>
        </div>
      </div>
    </div>
  );
}

