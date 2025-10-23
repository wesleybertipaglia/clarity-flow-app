import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Zap, Users, Bot, ArrowRight, Waves } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';

const features = [
  {
    icon: <Users className="h-8 w-8 text-orange-500" />,
    title: 'Multi-Company Support',
    description:
      'Create your own business or join existing ones. Manage multiple organizations seamlessly.',
  },
  {
    icon: <Zap className="h-8 w-8 text-orange-500" />,
    title: 'Role-Based Access',
    description:
      'Secure your data with granular permissions for Owners, Managers, and Employees across departments.',
  },
  {
    icon: <Bot className="h-8 w-8 text-orange-500" />,
    title: 'AI-Powered Assistant',
    description:
      'Use natural language to perform actions like scheduling meetings or managing team members.',
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-orange-500" />,
    title: 'Task & Project Tracking',
    description:
      'Organize, assign, and monitor tasks to keep your projects on schedule and teams aligned.',
  },
];

const howItWorks = [
  {
    step: 1,
    title: 'Create or Join a Business',
    description:
      'Start your own company or join an existing one. Set up your profile in minutes with no credit card required.',
  },
  {
    step: 2,
    title: 'Build Your Team',
    description:
      'Add employees, assign roles and departments. Collaborate seamlessly across your organization.',
  },
  {
    step: 3,
    title: 'Manage & Grow',
    description:
      'Handle clients, appointments, tasks, and more with our AI-powered tools designed for modern businesses.',
  },
];

export default function Home() {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 group hover:scale-105 transition-transform duration-300"
          >
            <Waves className="h-6 w-6 text-orange-500" />
            <span className="font-bold font-headline group-hover:text-orange-500 transition-colors duration-300">
              ClarityFlow
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a
              href="#features"
              className="text-muted-foreground hover:text-orange-500 transition-colors duration-300 relative group"
            >
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a
              href="#how-it-works"
              className="text-muted-foreground hover:text-orange-500 transition-colors duration-300 relative group"
            >
              How It Works
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="hover:bg-orange-500/10 hover:text-orange-500 transition-all duration-300"
              onClick={() => loginWithRedirect()}
            >
              Sign In
            </Button>
            <Button
              className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-orange-500 text-white hover:bg-orange-400"
              onClick={() => loginWithRedirect()}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-orange-500/5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.15)_1px,transparent_0)] bg-[length:20px_20px] opacity-20"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center relative">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tighter bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
                Streamline Your Business with{' '}
                <span className="text-orange-500 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-300 bg-clip-text">
                  ClarityFlow
                </span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                An intelligent, all-in-one platform to manage your clients,
                tasks, and team. Leverage the power of AI to boost productivity
                and focus on what truly matters.
              </p>
              <div className="mt-8 flex justify-center flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  asChild
                  className="group shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-500"
                  onClick={() => loginWithRedirect()}
                >
                  <span className="flex items-center gap-2">
                    Start Your Free Trial
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="backdrop-blur-sm bg-background/50 border-border/50 hover:bg-background/80 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <a href="#features">Learn More</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="bg-gradient-to-b from-secondary to-background py-20 md:py-28"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <Badge variant="outline" className="mb-4">
                Features
              </Badge>
              <h2 className="text-3xl md:text-4xl font-headline font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Powerful Features, Effortless Control
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                ClarityFlow is packed with tools designed to make your business
                operations seamless and efficient.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={feature.title}
                  className="group text-center shadow-lg hover:shadow-2xl transition-all duration-500 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/20 hover:-translate-y-2 hover:rotate-1 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="items-center pb-4">
                    <div className="p-3 rounded-full bg-gradient-to-br from-orange-500/10 to-orange-400/5 text-orange-500 group-hover:from-orange-500/20 group-hover:to-orange-400/10 transition-all duration-300 mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110">
                      {feature.icon}
                    </div>
                    <CardTitle className="font-headline text-lg group-hover:text-orange-500 transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="py-20 md:py-28 bg-gradient-to-r from-background via-orange-500/5 to-background"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <Badge variant="outline" className="mb-4">
                How It Works
              </Badge>
              <h2 className="text-3xl md:text-4xl font-headline font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Get Started in 3 Simple Steps
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Launching your ClarityFlow workspace is quick and easy.
              </p>
            </div>
            <div className="relative">
              <div className="relative grid md:grid-cols-3 gap-12">
                {howItWorks.map((item) => (
                  <div key={item.step} className="relative text-center group">
                    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-md p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                      <div className="text-4xl font-bold text-orange-500 mb-4">
                        {item.step}
                      </div>
                      <h3 className="text-xl font-headline font-semibold mb-3">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="bg-orange-500 border border-orange-400 text-white rounded-md p-10 md:p-16 text-center shadow-2xl hover:shadow-3xl transition-all duration-500">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4 text-white">
                  Ready to Transform Your Business?
                </h2>
                <p className="text-lg text-white opacity-90 leading-relaxed mb-8">
                  Join hundreds of businesses streamlining their workflow with
                  ClarityFlow. Start your free trial today and experience the
                  future of business management.
                </p>
                <div className="flex justify-center">
                  <Button
                    size="lg"
                    variant="secondary"
                    asChild
                    className="group shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white text-gray-900 hover:bg-gray-50"
                    onClick={() => loginWithRedirect()}
                  >
                    <span className="flex items-center gap-2">
                      Get Started for Free
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gradient-to-b from-secondary to-secondary/50 border-t border-border/50 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} ClarityFlow. All rights
              reserved. Built with ❤️ for modern businesses.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
