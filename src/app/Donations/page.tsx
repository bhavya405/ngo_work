// "use client";

// import { Button } from "@/components/ui/button";
// import { supabase } from "@/app/utils/supabase/client";
// import { Database } from "@/app/utils/supabase/database.types";
// import { useEffect, useState, useRef, useCallback, useMemo } from "react";
// import StripePaymentModal from "@/components/stripe_payment_box/box";

// type Donations = Database["public"]["Tables"]["donations"]["Row"];

// type Payment = {
//   id: number;
//   name?: string | null;
//   amount: number;
//   created_at?: string | null;
//   scheduled_at?: string | null;
// };

// type DonationMap = Map<number, Donations>;
// type PaymentMap = Map<number, Payment>;

// export default function DonationsPage() {
//   const [donationsMap, setDonationsMap] = useState<DonationMap>(new Map());
//   const [paymentsMadeMap, setPaymentsMadeMap] = useState<PaymentMap>(new Map());
//   const [futurePaymentsMap, setFuturePaymentsMap] = useState<PaymentMap>(new Map());

//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchStateRef = useRef({ donations: false, paymentsMade: false, futurePayments: false });

//   // --- Memoized Sorting ---
//   const sortedDonations = useMemo(() => {
//     return Array.from(donationsMap.values())
//       .sort((a, b) => Number(new Date(b.created_at || 0)) - Number(new Date(a.created_at || 0)));
//   }, [donationsMap]);

//   const sortedPaymentsMade = useMemo(() => {
//     return Array.from(paymentsMadeMap.values())
//       .sort((a, b) => Number(new Date(b.created_at || 0)) - Number(new Date(a.created_at || 0)));
//   }, [paymentsMadeMap]);

//   const sortedFuturePayments = useMemo(() => {
//     return Array.from(futurePaymentsMap.values())
//       .sort((a, b) => Number(new Date(a.scheduled_at || 0)) - Number(new Date(b.scheduled_at || 0)));
//   }, [futurePaymentsMap]);

//   const stats = useMemo(() => ({
//     paymentsMadeCount: paymentsMadeMap.size,
//     futurePaymentsCount: futurePaymentsMap.size,
//     donationsCount: donationsMap.size,
//   }), [paymentsMadeMap.size, futurePaymentsMap.size, donationsMap.size]);

//   // --- Data Fetching ---
//   const fetchDonations = useCallback(async () => {
//     if (fetchStateRef.current.donations) return;
//     fetchStateRef.current.donations = true;
//     try {
//       const res = await fetch("/api/donations");
//       if (!res.ok) throw new Error(`Failed to fetch donations: ${res.status}`);
//       const data = await res.json();
//       setDonationsMap(new Map(data.map((d: Donations) => [d.id, d])));
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load initial donations.");
//     }
//   }, []);

//   const fetchPayments = useCallback(async () => {
//     if (fetchStateRef.current.paymentsMade && fetchStateRef.current.futurePayments) return;
//     try {
//       const [madeRes, futureRes] = await Promise.all([
//         fetch("/api/payments-made"),
//         fetch("/api/future-payments"),
//       ]);

//       if (madeRes.ok) {
//         const madeData = await madeRes.json();
//         setPaymentsMadeMap(new Map(madeData.map((p: Payment) => [p.id, p])));
//         fetchStateRef.current.paymentsMade = true;
//       }
//       if (futureRes.ok) {
//         const futureData = await futureRes.json();
//         setFuturePaymentsMap(new Map(futureData.map((p: Payment) => [p.id, p])));
//         fetchStateRef.current.futurePayments = true;
//       }
//     } catch (err) {
//       console.error("Payments fetch error:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     Promise.all([fetchDonations(), fetchPayments()]);
//   }, [fetchDonations, fetchPayments]);

//   // --- Real-time Subscription ---
//   useEffect(() => {
//     const channel = supabase
//       .channel("realtime-donations")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "donations" },
//         (payload) => {
//           console.log("Realtime update received:", payload);
//           setDonationsMap((prev) => {
//             const updated = new Map(prev);
//             if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
//               const record = payload.new as Donations;
//               updated.set(record.id, record);
//             } else if (payload.eventType === "DELETE") {
//               updated.delete(payload.old.id);
//             }
//             return updated;
//           });
//         }
//       )
//       .subscribe((status) => {
//         console.log("Realtime Status:", status);
//       });

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, []);

//   // --- Logic Fix: Insert to DB so Realtime triggers ---
//   const handleModalSuccess = useCallback(async (payload: {
//     name: string | null;
//     amount: number;
//   }) => {
//     try {
//       setError(null);
      
//       // 1. Insert into Supabase - This is the "Broadcast" trigger
//       const { error: dbError } = await supabase
//         .from("donations")
//         .insert([{
//           name: payload.name || "Anonymous",
//           amount: payload.amount,
//         }]);

//       if (dbError) throw dbError;

//       // 2. Close modal - Realtime useEffect will handle the UI update
//       setShowPaymentModal(false);
//       console.log("Donation saved to DB. Realtime will update the list.");
//     } catch (err) {
//       const message = err instanceof Error ? err.message : "Failed to save donation";
//       setError(message);
//     }
//   }, []);

//   const handleOpenPayment = () => setShowPaymentModal(true);
//   const handleClosePayment = () => setShowPaymentModal(false);

//   return (
//     <>
//       <main className="min-h-screen bg-white p-4 md:p-8">
//         <div className="mx-auto max-w-5xl">
//           <header className="mb-6 flex items-center justify-between">
//             <h1 className="text-xl md:text-2xl font-semibold text-black">Donations Dashboard</h1>
//             {error ? (
//               <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded flex items-center gap-2">
//                 {error}
//                 <button onClick={() => setError(null)}>✕</button>
//               </div>
//             ) : (
//               <p className="text-sm text-black/70">
//                 {stats.paymentsMadeCount} payments · {stats.futurePaymentsCount} scheduled · {stats.donationsCount} donations
//               </p>
//             )}
//           </header>

//           {isLoading ? (
//             <div className="flex flex-col items-center justify-center py-12">
//               <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-emerald-600" />
//               <p className="mt-2 text-sm text-black/60">Syncing data...</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
//               {/* Left Column: History */}
//               <section className="space-y-4">
//                 <h2 className="text-lg font-medium text-black">Payments Made</h2>
//                 <ul className="space-y-3 max-h-[40vh] overflow-auto pr-2 border-r border-gray-100">
//                   {sortedPaymentsMade.length === 0 ? (
//                     <li className="text-sm text-black/40 italic">No payments yet.</li>
//                   ) : (
//                     sortedPaymentsMade.map((p) => <DonationListItem key={`made-${p.id}`} item={p} />)
//                   )}
//                 </ul>
//               </section>

//               {/* Middle Column: Scheduled */}
//               <section className="space-y-4">
//                 <h2 className="text-lg font-medium text-black">Future Payments</h2>
//                 <ul className="space-y-3 max-h-[40vh] overflow-auto pr-2 border-r border-gray-100">
//                   {sortedFuturePayments.length === 0 ? (
//                     <li className="text-sm text-black/40 italic">No scheduled payments.</li>
//                   ) : (
//                     sortedFuturePayments.map((p) => <DonationListItem key={`future-${p.id}`} item={p} isFuture />)
//                   )}
//                 </ul>
//               </section>

//               {/* Right Column: Real-time Donations */}
//               <section className="space-y-4">
//                 <h2 className="text-lg font-medium text-black">Real-time Donations</h2>
//                 <ul className="space-y-4 max-h-[40vh] overflow-auto bg-gray-50/50 p-4 rounded-xl ring-1 ring-black/5">
//                   {sortedDonations.length === 0 ? (
//                     <li className="text-sm text-black/40 italic text-center py-4">Waiting for first donation...</li>
//                   ) : (
//                     sortedDonations.map((donation) => <DonationCard key={`real-${donation.id}`} donation={donation} />)
//                   )}
//                 </ul>

//                 <div className="pt-2">
//                   <Button onClick={handleOpenPayment} className="w-full h-12 text-md font-semibold bg-emerald-600 hover:bg-emerald-700">
//                     Donate Now
//                   </Button>
//                 </div>
//               </section>
//             </div>
//           )}
//         </div>
//       </main>

//       <StripePaymentModal
//         open={showPaymentModal}
//         onClose={handleClosePayment}
//         initialAmount={10}
//         onSuccess={handleModalSuccess}
//       />
//     </>
//   );
// }

// // --- Sub-Components ---

// function DonationListItem({ item, isFuture = false }: { item: Payment; isFuture?: boolean }) {
//   const dateStr = isFuture ? item.scheduled_at : item.created_at;
//   return (
//     <li className="flex items-center justify-between gap-4 p-1">
//       <div className="min-w-0">
//         <div className="text-sm text-black/95 font-medium truncate">{item.name ?? "Anonymous"}</div>
//         <div className="text-[10px] text-black/50 uppercase tracking-tight">
//           {dateStr ? new Date(dateStr).toLocaleDateString() : "No Date"}
//         </div>
//       </div>
//       <div className="text-sm font-bold text-black">${Number(item.amount).toFixed(2)}</div>
//     </li>
//   );
// }

// function DonationCard({ donation }: { donation: Donations }) {
//   return (
//     <li className="flex items-center justify-between gap-4 animate-in fade-in slide-in-from-right-2 duration-500">
//       <div className="flex items-center gap-3">
//         <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200">
//           <span className="font-bold text-sm">$</span>
//         </div>
//         <div className="min-w-0">
//           <div className="text-sm font-semibold text-black/90 truncate">{donation.name ?? "Anonymous"}</div>
//           <div className="text-[11px] text-black/50 italic">just now</div>
//         </div>
//       </div>
//       <div className="text-md font-black text-emerald-600">
//         +${Number(donation.amount).toFixed(2)}
//       </div>
//     </li>
//   );
// }

"use client";

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { motion } from 'motion/react';
import { 
  School, Globe, Heart, CloudDownload, Edit3, 
  GraduationCap, Settings, ArrowRight, TrendingUp, BookOpen, Users 
} from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Project Imports
import { supabase } from "@/app/utils/supabase/client";
import { Database } from "@/app/utils/supabase/database.types";
import { cn } from "@/lib/utils";

// --- Types ---
type Donations = Database["public"]["Tables"]["donations"]["Row"];
type Payment = {
  id: number;
  name?: string | null;
  amount: number;
  created_at?: string | null;
  scheduled_at?: string | null;
};
type DonationMap = Map<number, Donations>;
type PaymentMap = Map<number, Payment>;

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// --- Sub-Component: The Integrated Donation Form ---
function DonationForm({ onPaymentSuccess }: { onPaymentSuccess: (payload: { name: string; amount: number }) => Promise<void> }) {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState(100);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDonate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!stripe || !elements) return;
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    setLoading(true);

    try {
      // 1. Create Payment Intent via your API
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, email, name }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to create payment intent');

      // 2. Confirm Card Payment
      const result = await stripe.confirmCardPayment(data.client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: { name, email },
        },
      });

      if (result.error) throw new Error(result.error.message);
      
      // 3. Trigger Supabase Insert (This triggers the Real-time update)
      await onPaymentSuccess({ name: name || "Anonymous", amount });
      
      // Reset Form
      setName('');
      setEmail('');
      cardElement.clear();
      alert('Thank you for your luminous support!');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Donation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleDonate} className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[25, 50, 100, 250].map((amt) => (
          <button
            key={amt}
            type="button"
            onClick={() => setAmount(amt)}
            className={cn(
              "py-3 rounded-xl transition-all border-2 font-bold",
              amount === amt 
                ? "bg-emerald-600 text-white border-emerald-600 shadow-md scale-105" 
                : "bg-slate-50 border-slate-100 hover:border-emerald-200"
            )}
          >
            ${amt}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-emerald-500"
          placeholder="Full Name"
          required
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-emerald-500"
          placeholder="Email Address"
          type="email"
          required
        />
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
      </div>

      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Confirm $${amount} Donation`}
      </button>
    </form>
  );
}

// --- Main Page Component ---
export default function DonationsPage() {
  const [donationsMap, setDonationsMap] = useState<DonationMap>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStateRef = useRef({ donations: false });

  // --- Real-time Data Logic ---
  const sortedDonations = useMemo(() => {
    return Array.from(donationsMap.values())
      .sort((a, b) => Number(new Date(b.created_at || 0)) - Number(new Date(a.created_at || 0)));
  }, [donationsMap]);

  const totalRaised = useMemo(() => {
    return Array.from(donationsMap.values()).reduce((sum, d) => sum + (d.amount || 0), 0);
  }, [donationsMap]);

  const fetchDonations = useCallback(async () => {
    if (fetchStateRef.current.donations) return;
    fetchStateRef.current.donations = true;
    try {
      const res = await fetch("/api/donations");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setDonationsMap(new Map(data.map((d: Donations) => [d.id, d])));
    } catch (err) {
      setError("Syncing error.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDonations();
    const channel = supabase.channel("realtime-donations")
      .on("postgres_changes", { event: "*", schema: "public", table: "donations" }, (payload) => {
        setDonationsMap((prev) => {
          const updated = new Map(prev);
          if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
            updated.set((payload.new as Donations).id, payload.new as Donations);
          } else if (payload.eventType === "DELETE") {
            updated.delete(payload.old.id);
          }
          return updated;
        });
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchDonations]);

  const handlePaymentSuccess = async (payload: { name: string; amount: number }) => {
    const { error: dbError } = await supabase
      .from("donations")
      .insert([{ name: payload.name, amount: payload.amount }]);
    if (dbError) throw dbError;
  };

  return (
    <Elements stripe={stripePromise}>
      <main className="min-h-screen bg-white pb-20 pt-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Hero Section */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-7">
              <span className="text-emerald-600 font-bold tracking-widest text-xs uppercase mb-4 block">Building Futures Together</span>
              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-[1.1] mb-6 tracking-tight">
                Illuminate the Path <br/>for Future Leaders.
              </h1>
              <p className="text-lg text-slate-600 max-w-xl leading-relaxed mb-8">
                Your contribution directly supports open-access educational materials and scholarships. At Luminous Academy, we believe knowledge should have no boundaries.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-3 py-3 px-5 rounded-xl bg-slate-100 font-semibold text-sm">
                  <School className="text-emerald-600" size={20} /> 12,400+ Students
                </div>
                <div className="flex items-center gap-3 py-3 px-5 rounded-xl bg-slate-100 font-semibold text-sm">
                  <Globe className="text-blue-500" size={20} /> 85 Countries
                </div>
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="lg:col-span-5 relative h-[500px] rounded-[2rem] overflow-hidden shadow-2xl">
              <img src="https://picsum.photos/seed/donors/800/1000" className="w-full h-full object-cover" alt="Impact" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase">Active Project</span>
                </div>
                <h3 className="text-2xl font-bold">The STEM Open-Library Fund</h3>
              </div>
            </motion.div>
          </section>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 space-y-8">
              {/* Progress Card */}
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Current Funding Goal</h2>
                    <p className="text-slate-500 text-sm">Phase 1: Digital Infrastructure</p>
                  </div>
                  <div className="text-right">
                    <span className="text-4xl font-bold text-emerald-600">${totalRaised.toLocaleString()}</span>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Raised of $100,000</span>
                  </div>
                </div>
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${Math.min((totalRaised / 100000) * 100, 100)}%` }} 
                    className="h-full bg-emerald-500" 
                  />
                </div>
              </div>

              {/* Form Card */}
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <h2 className="text-2xl font-bold mb-2">Donate Now</h2>
                <p className="text-slate-500 mb-8">Choose an amount to support our educational mission.</p>
                <DonationForm onPaymentSuccess={handlePaymentSuccess} />
              </div>
            </div>

            {/* Recent Donors Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-slate-50 rounded-[2rem] border border-slate-100 p-8 h-full">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold">Recent Impact</h2>
                  <div className="flex h-3 w-3 bg-emerald-500 rounded-full animate-ping" />
                </div>
                
                <div className="space-y-6">
                  {isLoading ? (
                    <p className="text-slate-400 text-sm italic">Loading history...</p>
                  ) : sortedDonations.length === 0 ? (
                    <p className="text-slate-400 text-sm italic">Be the first to donate!</p>
                  ) : (
                    sortedDonations.slice(0, 6).map((donation) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        key={donation.id} 
                        className="flex items-center gap-4"
                      >
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                          {donation.name?.charAt(0) || "A"}
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <span className="font-bold text-sm text-slate-800">{donation.name || "Anonymous"}</span>
                            <span className="text-emerald-600 font-bold text-sm">${donation.amount}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold">Just now</span>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </Elements>
  );
}