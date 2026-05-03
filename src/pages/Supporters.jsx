import { useState, useEffect } from "react";
import { Users, Award, ShieldCheck } from "lucide-react";
import api from "../utils/api";

export default function Supporters() {
  const [supporters, setSupporters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupporters = async () => {
      try {
        const data = await api.get("/payment/supporters");
        setSupporters(data);
      } catch (error) {
        console.error("Error fetching supporters:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSupporters();
  }, []);

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 py-20 max-w-5xl mx-auto">
      <section className="mx-auto mb-16 w-full text-center space-y-7">
        <div className="inline-flex items-center gap-2 border-2 border-[#111111] bg-[#fcf5bf] px-4 py-1.5 text-sm font-bold text-[#111111] uppercase tracking-widest shadow-[4px_4px_0px_0px_#111]">
          <Award className="h-4 w-4 stroke-[2px]" />
          Hall of Fame
        </div>

        <h1 className="text-4xl md:text-5xl font-display font-bold text-[#111111] uppercase tracking-widest leading-tight">
          Our generous <br />
          <span className="text-[#666666]">Supporters</span>
        </h1>

        <p className="mx-auto max-w-xl text-lg text-[#666666] font-medium">
          A heartfelt thank you to everyone who has contributed to keeping Axio-Manage running. Your support means the world to us.
        </p>
      </section>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#111111] border-t-transparent"></div>
        </div>
      ) : supporters.length === 0 ? (
        <div className="mx-auto max-w-lg border-2 border-[#111111] bg-[#a8defa] p-10 text-center shadow-[8px_8px_0px_0px_#111]">
          <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-[#111111] stroke-[1.5px]" />
          <h3 className="text-xl font-bold uppercase tracking-widest text-[#111111]">No supporters yet</h3>
          <p className="mt-2 text-sm font-bold text-[#111111]">Be the first to join our Hall of Fame!</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {supporters.map((supporter, index) => {
            // Pick a repeating pastel color based on index
            const colors = ["bg-[#a8defa]", "bg-[#d0f4e0]", "bg-[#fcf5bf]", "bg-[#e8c0fc]", "bg-[#ff99c8]"];
            const colorClass = colors[index % colors.length];

            return (
              <div
                key={supporter._id || index}
                className={`group border-2 border-[#111111] ${colorClass} p-6 shadow-[6px_6px_0px_0px_#111] transition-all hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0px_0px_#111]`}
              >
                <div className="flex items-center justify-between mb-4 border-b-2 border-[#111111]/10 pb-4">
                  <div className="flex h-10 w-10 items-center justify-center border-2 border-[#111111] bg-white text-lg font-bold text-[#111111]">
                    #{index + 1}
                  </div>
                  <div className="text-sm font-bold text-[#111111] uppercase tracking-widest bg-white border-2 border-[#111111] px-3 py-1 shadow-[2px_2px_0px_0px_#111]">
                    ₹{supporter.amount}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-[#111111] uppercase tracking-widest break-words">
                    {supporter.name}
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#111111]/70">
                    {new Date(supporter.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
