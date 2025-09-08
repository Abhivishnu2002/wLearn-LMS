"use client";

import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GithubIcon, Loader, Loader2, Send } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { error } from "console";
import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm(){
    const router = useRouter()
    const [githubPending, startGithubTransition] = useTransition();
    const [emailPending, startEmailTransition] = useTransition();
    const [email, setEmail] = useState("");

    async function signInWithGithub() {
        startGithubTransition(async ()=>{
        await authClient.signIn.social({
            provider: 'github',
            callbackURL: "/",
            fetchOptions: {
                onSuccess: ()=>{
                    toast.success('Signed in with Github, you will be redirected...');
                },
                onError: (error)=>{
                    toast.error("Internal server error");
                }
            }
        })
        })
    }
    function singInWithEmail(){
        startEmailTransition( async ()=>{
            await authClient.emailOtp.sendVerificationOtp({
                email: email,
                type: "sign-in",
                fetchOptions: {
                    onSuccess: ()=> {
                        toast.success("Email sent");
                        router.push(`/verify-request?email=${email}`)
                    },
                    onError: ()=>{
                        toast.error("Error sending email");
                    }
                }
            })
        })
    }
    return(
        <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Welcome back!</CardTitle>
                            <CardDescription>Login with your Github Email Account</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <Button disabled={githubPending} onClick={signInWithGithub} className="w-full" variant={"outline"}>
                            {githubPending ? (
                                <>
                                <Loader className="size-4 animate-spin"/>
                                <span>Loading...</span>
                                </>
                            ): ( 
                                <>
                                <GithubIcon className="size-4"/>
                                Sign in with Github
                                </>
                            )}
                        </Button>
        
                        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 afterflex after:items-center after:border-t after:border-border">
                            <span className="relative z-10 bg-card px-2 text-muted-foreground">or continue with</span>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input value={email} onChange={(e)=> setEmail(e.target.value)} type="email" placeholder="your@example.com" required/>
                            </div>
                        <Button onClick={singInWithEmail} disabled={emailPending}>{emailPending ? (
                            <>
                            <Loader2 className="size-4 animate-spin" />
                            <span>Loading...</span>
                            </>
                        ) : (
                           <>
                           <Send className="size-4" />
                           <span>Continue with email</span>
                           </> 
                        )
                        }</Button>
                        </div>
                    </CardContent>
                </Card>
    )
}