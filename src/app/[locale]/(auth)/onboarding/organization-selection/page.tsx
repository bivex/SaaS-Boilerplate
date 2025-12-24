/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:35
 * Last Updated: 2025-12-23T19:01:02
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Building2, Users, ArrowRight, CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

type FormMode = 'selection' | 'create' | 'join';
type FormData = {
  name: string;
  description: string;
  code: string;
};

const OrganizationSelectionPage = () => {
  const t = useTranslations('OrganizationSelection');
  const router = useRouter();

  const [mode, setMode] = useState<FormMode>('selection');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    code: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleCreateOrganization = async () => {
    if (!formData.name.trim()) {
      setError(t('errors.name_required'));
      return;
    }

    if (formData.name.trim().length < 2) {
      setError(t('errors.name_too_short'));
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // TODO: Implement actual organization creation API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      setSuccess(t('success.org_created'));
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (_err) {
      setError(t('errors.create_failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinOrganization = async () => {
    if (!formData.code.trim()) {
      setError(t('errors.code_required'));
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // TODO: Implement actual organization joining API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      // For demo purposes, accept any code that starts with 'ORG-'
      if (!formData.code.startsWith('ORG-')) {
        throw new Error('Invalid code');
      }

      setSuccess(t('success.org_joined'));
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (_err) {
      setError(t('errors.invalid_code'));
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', code: '' });
    setError('');
    setSuccess('');
    setMode('selection');
  };

  if (mode === 'selection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
              <p className="text-lg text-muted-foreground mt-2">{t('subtitle')}</p>
            </div>
          </div>

          {/* Options */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Create Organization */}
            <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl">{t('create_org.title')}</CardTitle>
                <CardDescription className="text-base">
                  {t('create_org.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => setMode('create')}
                >
                  {t('create_org.button')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Join Organization */}
            <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-xl">{t('join_org.title')}</CardTitle>
                <CardDescription className="text-base">
                  {t('join_org.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  className="w-full"
                  variant="outline"
                  size="lg"
                  onClick={() => setMode('join')}
                >
                  {t('join_org.button')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Demo Note */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Demo: Use invitation code "ORG-DEMO123" to test joining an organization
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <Dialog open={true} onOpenChange={() => resetForm()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {mode === 'create' ? t('create_form.title') : t('join_form.title')}
            </DialogTitle>
            <DialogDescription>
              {mode === 'create' ? t('create_form.description') : t('join_form.description')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {mode === 'create' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="org-name">{t('create_form.name_label')}</Label>
                  <Input
                    id="org-name"
                    placeholder={t('create_form.name_placeholder')}
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-description">{t('create_form.description_label')}</Label>
                  <Textarea
                    id="org-description"
                    placeholder={t('create_form.description_placeholder')}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    disabled={isLoading}
                    rows={3}
                  />
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="invitation-code">{t('join_form.code_label')}</Label>
                <Input
                  id="invitation-code"
                  placeholder={t('join_form.code_placeholder')}
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  disabled={isLoading}
                />
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={resetForm}
                disabled={isLoading}
                className="flex-1"
              >
                {mode === 'create' ? t('create_form.cancel_button') : t('join_form.cancel_button')}
              </Button>
              <Button
                onClick={mode === 'create' ? handleCreateOrganization : handleJoinOrganization}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? '...' : (mode === 'create' ? t('create_form.create_button') : t('join_form.join_button'))}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizationSelectionPage;
