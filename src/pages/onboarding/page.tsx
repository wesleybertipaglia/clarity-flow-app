import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/hooks/use-auth';
import { useCompany } from '@/hooks/use-company';
import { getCompanyService } from '@/lib/services';
import { ROLES, DEPARTMENTS, type Company } from '@/lib/types';
import { Building2, Users } from 'lucide-react';

const createBusinessSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Company name must be at least 2 characters.',
    })
    .max(30, {
      message: 'Company name must not be longer than 30 characters.',
    }),
  description: z.string().max(160).optional(),
});

const joinBusinessSchema = z.object({
  companyId: z.string().min(1, {
    message: 'Please select a company.',
  }),
  role: z.enum(ROLES),
  department: z.enum(DEPARTMENTS),
});

type CreateBusinessFormValues = z.infer<typeof createBusinessSchema>;
type JoinBusinessFormValues = z.infer<typeof joinBusinessSchema>;

export default function OnboardingPage() {
  const [activeTab, setActiveTab] = useState('create');
  const [companies, setCompanies] = useState<Company[]>([]);
  const { updateUserData } = useAuth();
  const { createCompany } = useCompany();
  const companyService = useMemo(() => getCompanyService(), []);
  const navigate = useNavigate();

  useEffect(() => {
    setCompanies(companyService.getAll());
  }, [companyService]);

  const createBusinessForm = useForm<CreateBusinessFormValues>({
    resolver: zodResolver(createBusinessSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const joinBusinessForm = useForm<JoinBusinessFormValues>({
    resolver: zodResolver(joinBusinessSchema),
    defaultValues: {
      companyId: '',
      role: 'Employee',
      department: 'General',
    },
  });

  const onCreateBusiness = async (data: CreateBusinessFormValues) => {
    try {
      const result = createCompany({
        name: data.name,
        description: data.description ?? '',
      });

      if (result.success) {
        updateUserData({
          companyId: result.data?.id,
          role: 'Owner',
          department: 'General',
        });

        toast.success('Business created successfully!');
        navigate('/dashboard');
      }
    } catch {
      toast.error('Failed to create business. Please try again.');
    }
  };

  const onJoinBusiness = async (data: JoinBusinessFormValues) => {
    try {
      const company = companyService.get(data.companyId);

      if (!company) {
        toast.error('Company not found. Please select a valid company.');
        return;
      }

      updateUserData({
        companyId: data.companyId,
        role: data.role,
        department: data.department,
      });

      toast.success('Successfully joined business!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error joining business:', error);
      toast.error('Failed to join business. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome to ClarityFlow
          </h1>
          <p className="text-muted-foreground mt-2">
            Let's get you set up. Choose how you'd like to get started.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Create Business
            </TabsTrigger>
            <TabsTrigger value="join" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Join Business
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Create Your Business</CardTitle>
                <CardDescription>
                  Set up your own company and start managing your business
                  operations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...createBusinessForm}>
                  <form
                    onSubmit={createBusinessForm.handleSubmit(onCreateBusiness)}
                    className="space-y-6"
                  >
                    <FormField
                      control={createBusinessForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your business name"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            This will be the name of your company.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createBusinessForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about your business"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            A brief description of what your business does.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">
                      Create Business
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="join" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Join a Business</CardTitle>
                <CardDescription>
                  Select a company and your role to join an existing business.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...joinBusinessForm}>
                  <form
                    onSubmit={joinBusinessForm.handleSubmit(onJoinBusiness)}
                    className="space-y-6"
                  >
                    <FormField
                      control={joinBusinessForm.control}
                      name="companyId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a company" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {companies.map((company) => (
                                <SelectItem key={company.id} value={company.id}>
                                  {company.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Choose the company you want to join.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={joinBusinessForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select your role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {ROLES.filter((role) => role !== 'Owner').map(
                                (role) => (
                                  <SelectItem key={role} value={role}>
                                    {role}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Your role in the company.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={joinBusinessForm.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select your department" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {DEPARTMENTS.map((department) => (
                                <SelectItem key={department} value={department}>
                                  {department}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Your department in the company.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">
                      Join Business
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
