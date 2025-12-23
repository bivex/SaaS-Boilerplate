/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T18:00:00
 * Last Updated: 2025-12-23T18:14:27
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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

const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Имя должно содержать минимум 2 символа.',
  }),
  email: z.string().email({
    message: 'Пожалуйста, введите корректный email адрес.',
  }),
  subject: z.string().min(5, {
    message: 'Тема должна содержать минимум 5 символов.',
  }),
  message: z.string().min(10, {
    message: 'Сообщение должно содержать минимум 10 символов.',
  }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactForm() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  function onSubmit(values: ContactFormValues) {
    // Здесь можно добавить логику отправки формы
    // Имитация отправки формы - в реальном приложении здесь будет API вызов
    console.warn('Contact form submitted:', values);

    // Имитация отправки формы - в реальном приложении показать toast уведомление
    console.warn('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.');

    // Сброс формы после успешной отправки
    form.reset();
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Свяжитесь с нами</CardTitle>
        <CardDescription>
          Заполните форму ниже, и мы ответим вам в течение 24 часов.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ваше имя" {...field} />
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
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тема *</FormLabel>
                  <FormControl>
                    <Input placeholder="О чем ваше сообщение?" {...field} />
                  </FormControl>
                  <FormDescription>
                    Укажите тему вашего обращения для более быстрого ответа.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Сообщение *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Расскажите подробнее о вашем вопросе или предложении..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Опишите ваш вопрос или предложение как можно подробнее.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Отправка...' : 'Отправить сообщение'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
