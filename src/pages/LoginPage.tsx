import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import GraphicalBackground from "@/components/GraphicalBackground";

function LoginPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const { login, isLoading } = useAuthStore();
	const { toast } = useToast();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!username || !password) return;

		try {
			const success = await login(username, password);

			if (success) {
				toast({
					title: "Logged In",
					description: `Welcome back, ${username}!`,
				});
				navigate("/");
			}
		} catch (error: any) {
			toast({
				title: "Login Failed",
				description: error.message || "Invalid username or password.",
				variant: "destructive",
			});
		}
	};

	return (
		<div className='relative flex flex-col min-h-screen  text-[#0E0D1D]'>
			{/* Background Canvas */}
			<div className='fixed inset-0 -z-10'>
				<GraphicalBackground />
			</div>

			<Navbar />

			<main className='container relative z-10 flex items-center justify-center flex-grow py-12'>
				<Card className='w-full max-w-md bg-[#FEFDDE] border border-[#FEFDDE] text-[#0E0D1D] shadow-md rounded-xl'>
					<CardHeader className='space-y-1'>
						<div className='flex items-center justify-center gap-2 mb-2'>
							<LogIn className='w-6 h-6 text-[#0E0D1D]' />
							<CardTitle className='text-2xl text-[#0E0D1D]'>Login</CardTitle>
						</div>
						<CardDescription className='text-center text-[#0E0D1D]'>
							Enter your Kick username and password to access your account
						</CardDescription>
					</CardHeader>

					<form onSubmit={handleSubmit}>
						<CardContent className='space-y-4'>
							<div className='space-y-2'>
								<Label htmlFor='username' className='text-[#0E0D1D]'>
									Kick Username
								</Label>
								<Input
									id='username'
									placeholder='Enter your username'
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									required
									className='bg-[#FEFDDE] border border-[#FEFDDE] text-[#0E0D1D] placeholder:text-[#999999]'
								/>
							</div>

							<div className='space-y-2'>
								<div className='flex items-center justify-between'>
									<Label htmlFor='password' className='text-[#0E0D1D]'>
										Password
									</Label>
									<Link
										to='/forgot-password'
										className='text-xs text-[#0E0D1D] hover:underline'
									>
										Forgot password?
									</Link>
								</div>
								<Input
									id='password'
									type='password'
									placeholder='Enter your password'
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									className='bg-[#FEFDDE] border border-[#FEFDDE] text-[#0E0D1D] placeholder:text-[#999999]'
								/>
							</div>
						</CardContent>

						<CardFooter className='flex flex-col space-y-4'>
							<Button
								type='submit'
								className='w-full bg-[#0E0D1D] hover:bg-[#222222] text-[#FEFDDE]'
								disabled={isLoading}
							>
								{isLoading ? "Signing In..." : "Sign In"}
							</Button>

							<div className='text-sm text-center text-[#0E0D1D]'>
								Don't have an account?{" "}
								<Link
									to='/signup'
									className='text-[#0E0D1D] font-semibold hover:underline'
								>
									Sign Up
								</Link>
							</div>
						</CardFooter>
					</form>
				</Card>
			</main>

			<Footer />
		</div>
	);
}

export default LoginPage;
