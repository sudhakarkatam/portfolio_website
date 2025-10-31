import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { portfolioData } from '@/data/portfolioData';
import { toast } from 'sonner';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Web3Forms configuration - get access key from environment variables
      const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

      // Check if Web3Forms is configured
      if (!accessKey) {
        toast.error('Email service not configured', {
          description: 'Please contact the site administrator.',
        });
        setIsSubmitting(false);
        return;
      }

      // Send email using Web3Forms API
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `New Message from ${data.name} - Portfolio Contact Form`,
          from_name: data.name,
          from_email: data.email,
          message: `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Show success message
        toast.success('Message sent successfully!', {
          description: 'I\'ll get back to you soon.',
        });
        
        // Reset form
        form.reset();
      } else {
        throw new Error(result.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Web3Forms Error:', error);
      toast.error('Failed to send message', {
        description: error instanceof Error ? error.message : 'Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div className="bg-card border border-border rounded-xl p-6 shadow-lg space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-accent mb-2">Send a Message</h3>
          <p className="text-sm text-muted-foreground">
            Fill out the form below and I'll get back to you soon.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      className="bg-input border-border focus:ring-accent"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      className="bg-input border-border focus:ring-accent"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell me about your project..."
                      className="bg-input border-border focus:ring-accent min-h-[120px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium py-6 text-base shadow-md hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </motion.div>
  );
};

