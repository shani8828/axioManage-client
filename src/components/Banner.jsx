import { ShieldCheck, ArrowRight } from "lucide-react";

const Banner = ({ name }) => {
    return (
        <section className="mx-auto mb-24 w-full border-2 border-[#111111] bg-[#fcf5bf] p-8 md:p-12 shadow-[8px_8px_0px_0px_#111] transition-all hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_0px_#111]">
            <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Icon/Logo Area */}
                <div className="flex h-24 w-24 shrink-0 items-center justify-center border-2 border-[#111111] bg-white shadow-[4px_4px_0px_0px_#111]">
                    <img 
                        src="https://res.cloudinary.com/dcwwptwzt/image/upload/v1771886440/Logo-bgless_va94cp.png" 
                        alt="Ayodhya Serenity Logo" 
                        className="h-14 w-14 object-contain" 
                    />
                </div>
                
                {/* Content Area */}
                <div className="space-y-5 flex-1 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 border-2 border-[#111111] bg-white px-3 py-1.5 text-xs font-bold text-[#111111] uppercase tracking-widest shadow-[2px_2px_0px_0px_#111]">
                        <ShieldCheck className="h-4 w-4 stroke-[2px]" />
                        Badge of Trust
                    </div>

                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-[#111111] uppercase tracking-widest leading-tight">
                        Managed by <br className="hidden md:block" />
                        <span className="text-[#666666]">Ayodhya Serenity</span>
                    </h2>
                    
                    <p className="max-w-2xl text-[#111111] text-sm md:text-base font-bold uppercase tracking-widest leading-relaxed opacity-80">
                        {name} is built with the reliability and trust of the Ayodhya Serenity team. 
                        We ensure a secure, verified, and refined digital experience for our users.
                    </p>
                    
                    <div className="pt-2 flex justify-center md:justify-start">
                        <a
                            href="https://ayodhyaserenity.vercel.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 border-2 border-[#111111] bg-white px-6 py-3 text-sm font-bold text-[#111111] uppercase tracking-widest hover:bg-[#111111] hover:text-white transition-colors shadow-[4px_4px_0px_0px_#111]"
                        >
                            Visit Ayodhya Serenity
                            <ArrowRight className="h-4 w-4 stroke-[2px]" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;