import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { FaKickstarterK } from "react-icons/fa";
import { FaXTwitter, FaYoutube } from "react-icons/fa6";

export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className='py-6 mt-16 border-t border-[#381835] bg-black text-white'>
			<div className='container mx-auto'>
				<div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
					{/* About */}
					<div>
						<h3 className='mb-3 text-lg font-bold text-white'>Bswrxsti</h3>
						<p className='text-sm text-white/80'>
							Join Bswrxsti&apos;s community for exciting gambling streams,
							giveaways, and more. Use affiliate code{" "}
							<span className='font-semibold text-[#D2758F]'>bswrxsti</span> on
							Roobet.
						</p>
					</div>

					{/* Links */}
					<div>
						<h3 className='mb-3 text-lg font-bold text-white'>Links</h3>
						<div className='grid grid-cols-2 gap-2'>
							<Link
								to='/'
								className='text-sm text-white/70 transition-colors hover:text-[#D2758F]'
							>
								Home
							</Link>
							<Link
								to='/leaderboard'
								className='text-sm text-white/70 transition-colors hover:text-[#D2758F]'
							>
								Leaderboard
							</Link>
							<Link
								to='/terms'
								className='text-sm text-white/70 transition-colors hover:text-[#D2758F]'
							>
								Terms & Conditions
							</Link>
							<Link
								to='/privacy'
								className='text-sm text-white/70 transition-colors hover:text-[#D2758F]'
							>
								Privacy Policy
							</Link>
						</div>
					</div>

					{/* Social & Affiliates */}
					<div>
						<h3 className='mb-3 text-lg font-bold text-white'>Connect</h3>
						<div className='flex flex-wrap gap-3'>
							<a
								href='https://kick.com/bswrxsti'
								target='_blank'
								rel='noreferrer'
								className='flex items-center justify-center transition-colors bg-[#381835] rounded-full w-9 h-9 hover:bg-[#D2758F] text-white'
							>
								<FaKickstarterK className='w-5 h-5' />
							</a>
							<a
								href='https://x.com/Bswrxsti'
								target='_blank'
								rel='noreferrer'
								className='flex items-center justify-center transition-colors bg-[#381835] rounded-full w-9 h-9 hover:bg-[#D2758F] text-white'
							>
								<FaXTwitter className='w-5 h-5' />
							</a>
							<a
								href='https://www.youtube.com/@RoobetBrandon-Bswrxsti'
								target='_blank'
								rel='noreferrer'
								className='flex items-center justify-center transition-colors bg-[#381835] rounded-full w-9 h-9 hover:bg-[#D2758F] text-white'
							>
								<FaYoutube className='w-5 h-5' />
							</a>
							<a
								href='https://roobet.com/?ref=bswrxsti'
								target='_blank'
								rel='noreferrer'
								className='flex items-center justify-center transition-colors bg-[#381835] rounded-full w-9 h-9 hover:bg-[#D2758F] p-1'
							>
								<img
									src='https://i.ibb.co/4w1vNNHT/65c0f428cc0de4676934f8d5-logob.png'
									alt='Roobet'
									className='object-contain w-full h-full'
								/>
							</a>
						</div>
					</div>

					{/* Gambling Warning */}
					<div className='md:pl-6 border-l border-[#381835]'>
						<h4 className='text-lg font-bold text-[#D2758F] mb-2'>
							BEWARE GAMBLING
						</h4>
						<p className='text-sm text-white/80 leading-relaxed'>
							We are not responsible for illegal gambling activities.
							<br />
							Play responsibly — gambling involves financial risks.
							<br />
							Ensure compliance with your local laws.
							<br />
							Seek help if you experience gambling issues.
						</p>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className='pt-4 mt-8 text-sm text-center text-white/70 border-t border-[#381835]'>
					<p className='flex flex-wrap items-center justify-center gap-1 text-sm'>
						© {currentYear} Bswrxsti. Made with
						<Heart className='w-3 h-3 mx-1 text-[#D2758F]' />
						for the community by{" "}
						<a
							href='https://www.linkedin.com/in/skander-kefi/'
							target='_blank'
							rel='noreferrer'
							className='font-medium text-white hover:text-[#D2758F]'
						>
							Skander
						</a>
					</p>
				</div>
			</div>
		</footer>
	);
}
