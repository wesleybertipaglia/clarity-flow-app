import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import { useCompany } from '@/hooks/use-company';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Sun, Moon } from 'lucide-react';

const companyFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Company name must be at least 2 characters.',
    })
    .max(30, {
      message: 'Company name must not be longer than 30 characters.',
    }),
  description: z.string().max(160).min(4),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

export default function SettingsPage() {
  const { company, currentUser } = useAuth();
  const { updateCompany } = useCompany();
  const { theme, setTheme } = useTheme();

  const isDarkMode = theme === 'dark';

  const companyForm = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: company?.name || '',
      description: company?.description || '',
    },
    mode: 'onChange',
  });

  function onCompanySubmit(data: CompanyFormValues) {
    const result = updateCompany(data);
    if (result.success) {
      toast.success('Company information updated successfully.');
    } else {
      toast.error(`Failed to update company: ${result.error}`);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium font-headline">Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your profile and account settings.
        </p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium">Name</label>
              <p className="text-sm text-muted-foreground mt-1">
                {currentUser?.name || 'Not set'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="text-sm text-muted-foreground mt-1">
                {currentUser?.email || 'Not set'}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Profile updates are currently disabled.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent>
          {currentUser?.role === 'Owner' ? (
            <Form {...companyForm}>
              <form
                onSubmit={companyForm.handleSubmit(onCompanySubmit)}
                className="space-y-8"
              >
                <FormField
                  control={companyForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your company name" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the name that will be displayed throughout the
                        app.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={companyForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us a little bit about your company"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A brief description of your business.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Update company</Button>
              </form>
            </Form>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium">Company Name</label>
                <p className="text-sm text-muted-foreground mt-1">
                  {company?.name || 'Not set'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">
                  Company Description
                </label>
                <p className="text-sm text-muted-foreground mt-1">
                  {company?.description || 'Not set'}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Only the company owner can edit this information.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle>System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium">Theme</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Toggle between light and dark mode.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {isDarkMode ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                  <Label htmlFor="theme-toggle" className="text-sm font-medium">
                    {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                  </Label>
                </div>
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={(checked) =>
                    setTheme(checked ? 'dark' : 'light')
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
