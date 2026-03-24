import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowDown } from "lucide-react";
import { FaKickstarterK, FaXTwitter, FaYoutube, FaDiscord } from "react-icons/fa6";
import GraphicalBackground from "@/components/GraphicalBackground";
import { useRef } from "react";

function HomePage() {
	const liveRef = useRef<HTMLDivElement>(null);

	const handleScrollClick = () => {
		liveRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<div className='relative flex flex-col min-h-screen text-white'>
			<GraphicalBackground />

			<Navbar />

			<main className='relative z-10 flex-grow'>
				<section className='max-w-5xl min-h-[calc(100vh-84px)] px-6 py-14 mx-auto text-center flex flex-col items-center justify-center'>
					<h1 className='text-5xl font-black leading-tight text-white uppercase sm:text-6xl md:text-7xl drop-shadow-[0_0_20px_rgba(255,255,255,0.22)]'>
						Welcome To Bswrxsti
						<br />
						Official Website
					</h1>

					<div className='w-40 h-px mx-auto mt-8 bg-gradient-to-r from-transparent via-[#D2758F]/60 to-transparent' />

					<p className='max-w-3xl mx-auto mt-8 text-base tracking-wide uppercase text-white/70 sm:text-xl'>
						Sign up under code <span className='font-bold text-white'>bswrxsti</span> and
						enjoy the rewards
					</p>

					<div className='flex flex-col items-center justify-center gap-4 mt-10 sm:flex-row'>
						<Button
							variant='outline'
							className='min-w-[210px] h-14 border-2 border-[#D2758F]/60 bg-black/45 text-white hover:bg-[#381835]/50'
							asChild
						>
							<Link to='/leaderboards'>Leaderboard</Link>
						</Button>
						<Button
							className='min-w-[210px] h-14 bg-[#D2758F] hover:bg-[#381835] text-white'
							asChild
						>
							<Link to='/signup' className='flex items-center gap-2'>
								Sign Up <ArrowRight className='w-4 h-4' />
							</Link>
						</Button>
					</div>

					<div className='cursor-pointer mt-14' onClick={handleScrollClick}>
						<p className='text-xs tracking-[0.25em] uppercase text-white/50'>
							Scroll To Explore
						</p>
						<ArrowDown className='w-6 h-6 mx-auto mt-3 text-[#D2758F]/90 animate-bounce' />
					</div>
				</section>

				<section ref={liveRef} className='max-w-6xl px-6 mx-auto py-14'>
					<h2 className='text-4xl font-bold text-center text-white uppercase sm:text-5xl'>
						Watch bswrxsti Live
					</h2>
					<p className='mt-4 text-lg text-center text-white/65'>
						Watch bswrxsti live and catch exclusive giveaways during streams
					</p>

					<div className='mt-10 overflow-hidden border shadow-2xl rounded-3xl bg-black/55 border-[#D2758F]/35 p-3'>
						<div className='overflow-hidden border rounded-2xl border-[#D2758F]/40 aspect-video'>
							<iframe
								src='https://player.kick.com/bswrxsti'
								frameBorder='0'
								allowFullScreen
								title='bswrxsti Live Stream'
								className='w-full h-full'
							/>
						</div>
					</div>
				</section>

				<section className='max-w-6xl px-6 py-16 mx-auto'>
					<h2 className='text-4xl font-bold text-center text-white uppercase sm:text-5xl'>					Join Discord
				</h2>
				<p className='mt-4 text-lg text-center text-white/65'>
					Connect with our community and get exclusive updates
				</p>

				<div className='max-w-2xl mx-auto mt-10'>
					<a
						href='https://discord.com/invite/Tt2U3fvsMY'
						target='_blank'
						rel='noreferrer'
						className='block p-8 transition-all border rounded-3xl bg-black/55 border-[#D2758F]/35 hover:border-[#D2758F] hover:-translate-y-1'
					>
						<div className='flex items-center justify-center w-16 h-16 mx-auto border rounded-2xl border-[#D2758F]/50 bg-[#381835]/30'>
							<FaDiscord className='text-white w-8 h-8' />
						</div>
						<h3 className='mt-5 text-2xl font-bold text-center text-white'>Bswrxsti Discord</h3>
						<p className='mt-2 text-center text-white/65'>Join our community server for giveaways and exclusive content</p>
						<div className='mt-5 text-center'>
							<Button className='bg-[#D2758F] hover:bg-[#381835] text-white'>Join Server</Button>
						</div>
					</a>
				</div>
			</section>

			<section className='max-w-6xl px-6 py-16 mx-auto'>
				<h2 className='text-4xl font-bold text-center text-white uppercase sm:text-5xl'>						Socials
					</h2>
					<div className='w-24 h-px mx-auto mt-6 bg-gradient-to-r from-transparent via-[#D2758F]/60 to-transparent' />

					<div className='grid grid-cols-1 gap-6 mt-10 sm:grid-cols-2 lg:grid-cols-4'>
						<a
							href='https://kick.com/bswrxsti'
							target='_blank'
							rel='noreferrer'
							className='p-6 transition-all border rounded-3xl bg-black/55 border-[#D2758F]/35 hover:border-[#D2758F] hover:-translate-y-1'
						>
							<div className='flex items-center justify-center w-14 h-14 border rounded-2xl border-[#D2758F]/50 bg-[#381835]/30'>
								<FaKickstarterK className='text-white w-7 h-7' />
							</div>
							<h3 className='mt-5 text-2xl font-bold text-white'>Kick</h3>
							<p className='mt-2 text-white/65'>Watch live streams and exclusive content</p>
						</a>

						<a
							href='https://x.com/Bswrxsti'
							target='_blank'
							rel='noreferrer'
							className='p-6 transition-all border rounded-3xl bg-black/55 border-[#D2758F]/35 hover:border-[#D2758F] hover:-translate-y-1'
						>
							<div className='flex items-center justify-center w-14 h-14 border rounded-2xl border-[#D2758F]/50 bg-[#381835]/30'>
								<FaXTwitter className='text-white w-7 h-7' />
							</div>
							<h3 className='mt-5 text-2xl font-bold text-white'>X (Twitter)</h3>
							<p className='mt-2 text-white/65'>Follow for latest updates</p>
						</a>

						<a
							href='https://www.youtube.com/@RoobetBrandon-Bswrxsti'
							target='_blank'
							rel='noreferrer'
							className='p-6 transition-all border rounded-3xl bg-black/55 border-[#D2758F]/35 hover:border-[#D2758F] hover:-translate-y-1'
						>
							<div className='flex items-center justify-center w-14 h-14 border rounded-2xl border-[#D2758F]/50 bg-[#381835]/30'>
								<FaYoutube className='text-white w-7 h-7' />
							</div>
							<h3 className='mt-5 text-2xl font-bold text-white'>YouTube</h3>
							<p className='mt-2 text-white/65'>Watch highlights and casino content</p>
						</a>

						<a
							href='https://roobet.com/?ref=bswrxsti'
							target='_blank'
							rel='noreferrer'
							className='p-6 transition-all border rounded-3xl bg-black/55 border-[#D2758F]/35 hover:border-[#D2758F] hover:-translate-y-1'
						>
							<div className='flex items-center justify-center w-14 h-14 border rounded-2xl border-[#D2758F]/50 bg-[#381835]/30 p-2'>
								<img
									src='https://i.ibb.co/4w1vNNHT/65c0f428cc0de4676934f8d5-logob.png'
									alt='Roobet'
									className='object-contain w-full h-full'
								/>
							</div>
							<h3 className='mt-5 text-2xl font-bold text-white'>Roobet</h3>
							<p className='mt-2 text-white/65'>Sign up under code bswrxsti</p>
						</a>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}

export default HomePage;
