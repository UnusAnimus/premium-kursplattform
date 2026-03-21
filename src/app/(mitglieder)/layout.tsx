import MemberLayoutClient from './MemberLayoutClient';

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return <MemberLayoutClient>{children}</MemberLayoutClient>;
}

