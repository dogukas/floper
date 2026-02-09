"use client";

import { useLayoutEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import {
  Package, BarChart3, Users, TrendingUp, ArrowRight, CheckCircle2,
  Shield, Zap, Globe, Award, Clock, ChevronRight
} from "lucide-react";
import Image from "next/image";

// Lazy load heavy 3D component
const WaveBackground = dynamic(() => import("@/components/canvas/WaveBackground"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-gradient-to-br from-slate-950 to-slate-900 -z-10" />,
});

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.from(heroRef.current, {
        y: -100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      });

      // Stats counter animation
      gsap.from(".stat-card", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        delay: 0.3,
        ease: "power2.out",
      });

      // Features stagger animation
      gsap.from(".feature-card", {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        delay: 0.6,
        ease: "power3.out",
      });

      // Benefits animation
      gsap.from(".benefit-item", {
        x: -50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        delay: 0.9,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { value: "10K+", label: "Stok Ürünü" },
    { value: "50+", label: "Kullanıcı" },
    { value: "99.9%", label: "Uptime" },
    { value: "24/7", label: "Destek" },
  ];

  const features = [
    {
      icon: <Package className="w-8 h-8" />,
      title: "Stok Yönetimi",
      description: "Detaylı stok takibi, sayım ve raporlama",
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Satış Analizi",
      description: "Gelişmiş analitik ve tahminleme araçları",
      color: "from-purple-500/20 to-pink-500/20",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Personel Yönetimi",
      description: "Performans takibi ve KPI raporları",
      color: "from-green-500/20 to-emerald-500/20",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "İş Zekası",
      description: "Real-time dashboard ve görselleştirme",
      color: "from-orange-500/20 to-yellow-500/20",
    },
  ];

  const benefits = [
    { icon: <Zap className="w-5 h-5" />, text: "Hızlı ve Performanslı Sistem" },
    { icon: <Shield className="w-5 h-5" />, text: "Güvenli Veri Saklama" },
    { icon: <Globe className="w-5 h-5" />, text: "Her Yerden Erişim" },
    { icon: <Clock className="w-5 h-5" />, text: "Real-time Veri Senkronizasyonu" },
    { icon: <Award className="w-5 h-5" />, text: "Profesyonel Raporlama" },
  ];

  return (
    <div ref={containerRef} className="relative overflow-x-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <WaveBackground />

      {/* Logo & Navigation */}
      <header className="absolute top-0 left-0 right-0 z-20 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 shadow-lg">
              <Image src="/icon.png" alt="Flope" width={32} height={32} />
            </div>
            <div className="text-white">
              <div className="font-bold text-xl tracking-tight">Flope ERP</div>
              <div className="text-xs text-slate-400 tracking-wider">Enterprise Solutions</div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard")}
            className="bg-white/5 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm hidden md:flex"
          >
            Giriş Yap
            <ChevronRight className="ml-1 w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="relative z-10 w-full max-w-7xl">
          <div ref={heroRef} className="text-center space-y-8 pt-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 backdrop-blur-sm">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-300 font-medium">Kurumsal Çözümler</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight">
              Modern ERP
              <span className="block mt-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                Yönetim Sistemi
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
              İşletmenizi dijitalleştirin. Stok, satış ve personel yönetimini tek platformda takip edin.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button
                size="lg"
                onClick={() => router.push("/dashboard")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 border-0 h-12 px-8 text-base"
              >
                Dashboard'a Git
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/stock-counting")}
                className="bg-white/5 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm h-12 px-8 text-base"
              >
                Stok Sayım
              </Button>
            </div>
          </div>

          {/* Stats Section */}
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-20">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="stat-card text-center p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-6 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Güçlü Özellikler
            </h2>
            <p className="text-slate-400 text-lg">
              İşletmenizi bir üst seviyeye taşıyacak araçlar
            </p>
          </div>

          <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card group relative p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity`} />

                <div className="relative space-y-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-20 px-6 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Neden Flope ERP?
                </h2>
                <p className="text-slate-300 text-lg mb-8">
                  Modern teknoloji ile kurumsal çözümler sunuyoruz
                </p>

                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="benefit-item flex items-center gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/5 hover:border-white/10 transition-colors"
                    >
                      <div className="text-blue-400">
                        {benefit.icon}
                      </div>
                      <span className="text-white font-medium">
                        {benefit.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-md border border-white/10 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-32 h-32 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center">
                      <Image src="/icon.png" alt="Flope" width={80} height={80} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Flope ERP
                    </h3>
                    <p className="text-slate-400">
                      Gelecek nesil yönetim sistemi
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-white/5 z-10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-sm text-slate-500 space-y-2">
            <p className="font-medium">© 2026 Doğukan Tevfik Sağıroğlu</p>
            <p>Full Stack Developer / DevOps Engineer</p>
            <div className="flex items-center justify-center gap-4 mt-4 text-slate-600">
              <span>Flope ERP v1.0.0</span>
              <span>•</span>
              <span>Enterprise Solutions</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
