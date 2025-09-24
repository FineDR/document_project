/* eslint-disable @typescript-eslint/no-explicit-any */
// components/payments/PayToExportModal.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '../formElements/Button';

type Props = {
  cvId: string;
  onClose: () => void;
  onPaid: () => void; // called when payment confirmed
};

export default function PayToExportModal({ cvId, onClose, onPaid }: Props) {
  const [phone, setPhone] = useState('');
  const [provider, setProvider] = useState<'selcom' | 'flutterwave'>('selcom');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'pending' | 'paid' | 'failed'>('idle');

  // Polling effect based on orderId
  useEffect(() => {
    if (!orderId) return;

    const interval = setInterval(async () => {
      try {
        const { data } = await axios.get(`/api/orders/${orderId}/status`);
        if (data.status === 'paid') {
          clearInterval(interval);
          setStatus('paid');
          onPaid();
        } else if (data.status === 'failed') {
          clearInterval(interval);
          setStatus('failed');
        }
      } catch (err) {
        console.error('Error polling payment status:', err);
        clearInterval(interval);
        setStatus('failed');
      }
    }, 3000);

    // Cleanup on unmount or orderId change
    return () => clearInterval(interval);
  }, [orderId, onPaid]);

  const handlePay = async () => {
    if (!phone) return alert('Please enter your phone number');

    setStatus('pending');

    try {
      // 1) Create order
      const order = await axios.post('/api/orders/export', { cvId });
      setOrderId(order.data.id); // triggers polling useEffect

      // 2) Initiate payment
      await axios.post('/api/payments/initiate', {
        orderId: order.data.id,
        phone,
        provider,
      });
    } catch (err) {
      console.error('Payment initiation failed:', err);
      setStatus('failed');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
        <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={onClose}>✕</button>
        <h3 className="text-xl font-semibold mb-4">Pay to Download (TZS 3,000)</h3>

        <div className="space-y-3">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="M-Pesa/TigoPesa/Airtel Money number"
            className="border p-2 rounded w-full"
          />
          <select
            className="border rounded p-2 w-full"
            value={provider}
            onChange={(e) => setProvider(e.target.value as 'selcom' | 'flutterwave')}
          >
            <option value="selcom">Selcom</option>
            <option value="flutterwave">Flutterwave</option>
          </select>
        </div>

        <div className="mt-5 flex gap-3">
          <Button
            label={status === 'pending' ? 'Processing…' : 'Pay & Export'}
            onClick={handlePay}
            disabled={status === 'pending'}
          />
          <Button
            label="Cancel"
            onClick={onClose}
            className="bg-gray-200 text-gray-700"
          />
        </div>

        {status === 'pending' && (
          <p className="mt-3 text-sm text-gray-600">
            Complete payment on your phone. Waiting for confirmation…
          </p>
        )}
        {status === 'failed' && (
          <p className="mt-3 text-sm text-red-600">
            Payment failed. Try again.
          </p>
        )}
      </div>
    </div>
  );
}
