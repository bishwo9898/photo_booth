'use client';

import { useEffect, useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

interface PaymentFormProps {
  clientSecret: string;
  amount: number;
  packageName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PaymentForm({
  clientSecret,
  amount,
  packageName,
  onSuccess,
  onCancel,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/?payment=success&package=${packageName}`,
      },
    });

    if (error) {
      setErrorMessage(error.message || 'An error occurred');
      setIsLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <div className="rounded-2xl border border-[#e6d9c8] bg-white p-6">
      <div className="mb-4">
        <p className="text-sm font-semibold text-[#1b1915]">
          20% Retainer Payment
        </p>
        <p className="mt-1 text-xs text-[#8b7a66]">
          {packageName} Collection
        </p>
        <p className="mt-2 text-lg font-bold text-[#1b1915]">
          ${(amount / 100).toFixed(2)}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <PaymentElement />

        {errorMessage && (
          <div className="rounded-lg bg-red-50 p-3">
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 rounded-full border border-[#dac9b0] px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#5c5247] transition hover:bg-[#f8f3ed] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!stripe || isLoading}
            className="flex-1 rounded-full bg-[#1b1915] px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#f8f3ed] transition hover:bg-[#2b2620] disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </form>
    </div>
  );
}
