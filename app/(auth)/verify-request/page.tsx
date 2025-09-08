"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function VerifyRequest() {
    const [otp, setOtp] = useState("");
    const [emailPending, startTransition] = useTransition();
    const params = useSearchParams();
    const email = params.get("email");
    const router = useRouter();
    const isOtpCompleted = otp.length === 6;

    function verifyOtp(){
        startTransition( async ()=>{
            await authClient.signIn.emailOtp({
                email: email,
                otp: otp,
                fetchOptions: {
                    onSuccess: ()=>{
                        toast.success('Email verified')
                        router.push('/');
                    },
                    onError: ()=>{
                        toast.error('Error verifying Email/OTP')
                    }
                }
            })
        })
    }
    return (
        <Card className="w-full mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-xl">Please check your Email</CardTitle>
                <CardDescription>We have send a verification email code to your email address, Please open the email and paste the code below</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-0">
                    <InputOTP value={otp} maxLength={6} className="gap-2" onChange={(value)=>setOtp(value)}>
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                    <p className="text-sm text-muted-foreground mt-3">Enter the 6-digitt code sent to your email</p>
                </div>
                <Button className="w-full" onClick={verifyOtp} disabled={emailPending || !isOtpCompleted}>
                    {emailPending ? (
                        <>
                        <Loader2 className="size-4 animate-spin"/>
                        <span>Loading...</span>
                        </>
                    ):(
                       "Verify account" 
                    )
                    }
                </Button>
            </CardContent>
        </Card>
    )
}