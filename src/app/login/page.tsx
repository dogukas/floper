"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import WaveBackground from "@/components/canvas/WaveBackground";

export default function LoginPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(cardRef.current, {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                delay: 0.5
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden" ref={containerRef}>
            <WaveBackground />

            <div ref={cardRef} className="z-10 w-full max-w-md px-8 opacity-100">
                <Card className="backdrop-blur-md bg-white/10 border-white/20 text-white shadow-2xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">Giriş Yap</CardTitle>
                        <CardDescription className="text-center text-gray-300">
                            Devam etmek için hesabınıza giriş yapın
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
                            <Input id="email" type="email" placeholder="m@example.com" className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-white/40" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Şifre</label>
                            <Input id="password" type="password" className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-white/40" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full bg-white text-black hover:bg-white/90">Giriş Yap</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
