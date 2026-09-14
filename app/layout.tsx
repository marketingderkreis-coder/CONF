import './globals.css'; import {Sidebar} from '@/components/sidebar'; import {Topbar} from '@/components/topbar';
export const metadata={title:'DER KREIS Marketing Hub',description:'Centraal marketingticketsysteem'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="nl"><body><Sidebar/><div className="lg:pl-[248px]"><Topbar/><main className="mx-auto max-w-[1600px] p-4 lg:p-7">{children}</main></div></body></html>}
