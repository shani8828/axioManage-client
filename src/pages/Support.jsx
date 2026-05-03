import { useState } from "react";
import { Heart, ShieldCheck, CreditCard, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Support() {
  const { user } = useAuth();
  const [amount, setAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState("");
  const [supporterName, setSupporterName] = useState(user?.name || "");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    const finalAmount = customAmount ? Number(customAmount) : amount;
    if (!finalAmount || finalAmount < 1) return;

    setLoading(true);
    setStatus(null);

    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      alert("Razorpay SDK failed to load. Please check your connection.");
      setLoading(false);
      return;
    }

    try {
      const { key } = await api.get("/payment/key");
      const order = await api.post("/payment/create-order", { amount: finalAmount });

      const options = {
        key: key,
        amount: order.amount,
        currency: order.currency,
        name: "Axio-Manage",
        description: "Support Donation",
        image: "https://res.cloudinary.com/dcwwptwzt/image/upload/v1771886440/Logo-bgless_va94cp.png",
        order_id: order.id,
        handler: async function (response) {
          try {
            const result = await api.post("/payment/verify", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              name: supporterName || user?.name || "Anonymous",
              amount: finalAmount
            });
            if (result.message === "Payment verified successfully") {
              setStatus("success");
              setCustomAmount("");
            } else {
              setStatus("error");
            }
          } catch (err) {
            setStatus("error");
          }
        },
        prefill: {
          name: supporterName || user?.name || "Generous Supporter",
          email: user?.email || "",
          contact: phone || undefined,
        },
        theme: {
          color: "#111111",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response){
        setStatus("error");
      });
      paymentObject.open();
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 py-20 max-w-4xl mx-auto">
      <section className="mx-auto mb-16 w-full text-center space-y-7">
        <div className="inline-flex items-center gap-2 border-2 border-[#111111] bg-[#ff99c8] px-4 py-1.5 text-sm font-bold text-[#111111] uppercase tracking-widest shadow-[4px_4px_0px_0px_#111]">
          <Heart className="h-4 w-4 stroke-[2px]" />
          Support Our Work
        </div>

        <h1 className="text-4xl md:text-5xl font-display font-bold text-[#111111] uppercase tracking-widest leading-tight">
          Fuel the momentum behind <br />
          <span className="text-[#666666]">Axio-Manage</span>
        </h1>

        <p className="mx-auto max-w-xl text-lg text-[#666666] font-medium">
          If Axio-Manage helps you stay organized, focused, and consistent, consider supporting our development. Your contribution keeps this workspace ad-free and continuously improving.
        </p>

        <div className="pt-4 flex justify-center">
          <Link
            to="/supporters"
            className="inline-flex items-center gap-2 border-2 border-[#111111] bg-[#fcf5bf] px-6 py-3 text-sm font-bold text-[#111111] uppercase tracking-widest hover:bg-[#111111] hover:text-[#fcf5bf] transition-colors shadow-[4px_4px_0px_0px_#111]"
          >
            <Users className="h-5 w-5 stroke-[2px]" />
            View Hall of Fame
            <ArrowRight className="h-4 w-4 stroke-[2px]" />
          </Link>
        </div>
      </section>

      {status === "success" && (
        <div className="mb-12 border-2 border-[#111111] bg-[#d0f4e0] p-6 text-center shadow-[6px_6px_0px_0px_#111] transition-all">
          <h3 className="text-xl font-bold uppercase tracking-widest text-[#111111] flex items-center justify-center gap-2">
            <ShieldCheck className="h-6 w-6 stroke-[2px]" />
            Thank you for your support!
          </h3>
          <p className="mt-2 text-sm font-bold uppercase tracking-widest text-[#666666]">
            Your payment was successfully verified. You've been added to our Hall of Fame.
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="mb-12 border-2 border-[#111111] bg-[#ff99c8] p-6 text-center shadow-[6px_6px_0px_0px_#111] transition-all">
          <h3 className="text-xl font-bold uppercase tracking-widest text-[#111111]">
            Payment Failed or Cancelled
          </h3>
          <p className="mt-2 text-sm font-bold uppercase tracking-widest text-[#111111]">
            Something went wrong during the transaction. Please try again.
          </p>
        </div>
      )}

      <div className="mx-auto max-w-xl border-2 border-[#111111] bg-white p-8 md:p-10 shadow-[8px_8px_0px_0px_#111]">
        <h2 className="mb-8 text-2xl font-display font-bold text-[#111111] uppercase tracking-widest text-center">
          Make a Donation
        </h2>

        <form onSubmit={handlePayment} className="space-y-8">
          <div className="space-y-4">
            <label className="block text-sm font-bold uppercase tracking-widest text-[#111111]">
              Select Amount (INR)
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[100, 500, 1000].map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => {
                    setAmount(preset);
                    setCustomAmount("");
                  }}
                  className={`border-2 py-3 text-lg font-bold uppercase tracking-widest transition-all ${
                    amount === preset && !customAmount
                      ? "border-[#111111] bg-[#fcf5bf] text-[#111111] shadow-[4px_4px_0px_0px_#111]"
                      : "border-[#666666]/30 bg-white text-[#666666] hover:border-[#111111] hover:text-[#111111]"
                  }`}
                >
                  ₹{preset}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold uppercase tracking-widest text-[#111111]">
              Or Enter Custom Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-[#666666]">
                ₹
              </span>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setAmount(0);
                }}
                placeholder="0"
                min="1"
                className="w-full border-2 border-[#111111] bg-white p-4 pl-10 text-lg font-bold text-[#111111] outline-none focus:bg-[#a8defa]/10 focus:shadow-[4px_4px_0px_0px_#111] transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold uppercase tracking-widest text-[#111111]">
              Your Name (For Hall of Fame)
            </label>
            <input
              type="text"
              required
              value={supporterName}
              onChange={(e) => setSupporterName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full border-2 border-[#111111] bg-white p-4 text-sm font-bold text-[#111111] outline-none focus:bg-[#d0f4e0]/10 focus:shadow-[4px_4px_0px_0px_#111] transition-all uppercase tracking-widest"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold uppercase tracking-widest text-[#111111]">
              Phone Number (For Payment Receipt)
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9876543210"
              className="w-full border-2 border-[#111111] bg-white p-4 text-sm font-bold text-[#111111] outline-none focus:bg-[#fcf5bf]/10 focus:shadow-[4px_4px_0px_0px_#111] transition-all uppercase tracking-widest"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 border-2 border-[#111111] bg-[#a8defa] px-8 py-4 font-bold text-[#111111] uppercase tracking-widest hover:bg-[#111111] hover:text-white transition-colors text-sm shadow-[4px_4px_0px_0px_#111] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              "Processing..."
            ) : (
              <>
                <CreditCard className="h-5 w-5 stroke-[2px]" />
                Pay ₹{customAmount || amount}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
