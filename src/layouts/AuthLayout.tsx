import AuthContent from '@/components/auth-content';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthContent>{children}</AuthContent>;
}
