import Link from 'next/link'
import Image from 'next/image'
import logo from '../../public/assets/logo.svg'
import { SignedIn } from '@clerk/nextjs'
import {SignOutButton} from '@clerk/nextjs'
import { OrganizationSwitcher } from '@clerk/nextjs'
import {dark} from '@clerk/themes'
function TopBar() {

    return (
        <nav className="topbar">
            <Link href="/" className='flex items-center gap-4'>
                <Image height={28} width={28} src={logo} alt='logo'/>
                <p className='text-heading3-bold text-light-1 max-xs:hidden'>Whisper</p>
            </Link>
            <div className='flex items-center gap-1'>
                <div className='block md:hidden'>
                    <SignedIn>
                        <SignOutButton>
                            <div className='flex cursor-pointer'>
                                <Image 
                                src="/assets/logout.svg"
                                alt="logout"
                                width={24}
                                height={24}
                                />
                            </div>
                        </SignOutButton>
                    </SignedIn>
                </div>

                <OrganizationSwitcher
                appearance={{
                    baseTheme:dark,
                    elements:{
                        organizationSwitcherTrigger:"py-2 px-4"
                    }
                }}/>
            </div>
        </nav>
    )
}

export default TopBar