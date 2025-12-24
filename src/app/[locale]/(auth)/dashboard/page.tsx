/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:35
 * Last Updated: 2025-12-24T10:00:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

'use client';

import {
  ArrowRight,
  Bell,
  Calendar,
  FileText,
  Plus,
  Settings,
  TrendingUp,
  Users,
} from 'lucide-react';

import { useTranslations } from 'next-intl';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardSection } from '@/features/dashboard/DashboardSection';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { useUser } from '@/hooks/useAuth';

const DashboardIndexPage = () => {
  const t = useTranslations('DashboardIndex');
  const { user } = useUser();

  const stats = [
    {
      title: t('stats.total_users'),
      value: '2,345',
      change: '+12%',
      icon: Users,
      description: t('stats.users_description'),
    },
    {
      title: t('stats.documents'),
      value: '156',
      change: '+8%',
      icon: FileText,
      description: t('stats.documents_description'),
    },
    {
      title: t('stats.revenue'),
      value: '$12,345',
      change: '+23%',
      icon: TrendingUp,
      description: t('stats.revenue_description'),
    },
    {
      title: t('stats.projects'),
      value: '24',
      change: '+4%',
      icon: Settings,
      description: t('stats.projects_description'),
    },
  ];

  const recentActivities = [
    {
      id: 1,
      title: t('activities.user_registered'),
      description: t('activities.user_registered_desc'),
      time: '2 minutes ago',
      type: 'user',
    },
    {
      id: 2,
      title: t('activities.project_completed'),
      description: t('activities.project_completed_desc'),
      time: '1 hour ago',
      type: 'project',
    },
    {
      id: 3,
      title: t('activities.payment_received'),
      description: t('activities.payment_received_desc'),
      time: '3 hours ago',
      type: 'payment',
    },
    {
      id: 4,
      title: t('activities.document_uploaded'),
      description: t('activities.document_uploaded_desc'),
      time: '5 hours ago',
      type: 'document',
    },
  ];

  const quickActions = [
    {
      title: t('actions.create_project'),
      description: t('actions.create_project_desc'),
      icon: Plus,
      action: () => {
        // Placeholder: Project creation feature to be implemented
        console.warn('Project creation feature coming soon!');
      },
    },
    {
      title: t('actions.invite_users'),
      description: t('actions.invite_users_desc'),
      icon: Users,
      action: () => {
        // Placeholder: User invitation feature to be implemented
        console.warn('User invitation feature coming soon!');
      },
    },
    {
      title: t('actions.view_reports'),
      description: t('actions.view_reports_desc'),
      icon: TrendingUp,
      action: () => {
        // Placeholder: Reports navigation to be implemented
        console.warn('Reports feature coming soon!');
      },
    },
    {
      title: t('actions.schedule_meeting'),
      description: t('actions.schedule_meeting_desc'),
      icon: Calendar,
      action: () => {
        // Placeholder: Meeting scheduler feature to be implemented
        console.warn('Meeting scheduler feature coming soon!');
      },
    },
  ];

  return (
    <>
      <TitleBar
        title={t('title_bar')}
        description={t('title_bar_description')}
      />

      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? 'User'} />
            <AvatarFallback className="text-lg">
              {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">
              {t('welcome_back', { name: user?.name ?? 'User' })}
            </h1>
            <p className="text-muted-foreground">
              {t('welcome_description')}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map(stat => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {stat.change}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <DashboardSection
          title={t('quick_actions')}
          description={t('quick_actions_description')}
        >
          <div className="grid gap-3">
            {quickActions.map(action => (
              <Button
                key={action.title}
                variant="outline"
                className="justify-start h-auto p-4"
                onClick={action.action}
              >
                <div className="flex items-center gap-3">
                  <action.icon className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </div>
              </Button>
            ))}
          </div>
        </DashboardSection>

        {/* Recent Activity */}
        <DashboardSection
          title={t('recent_activity')}
          description={t('recent_activity_description')}
        >
          <div className="space-y-4">
            {recentActivities.map(activity => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    {activity.type === 'user' && <Users className="h-4 w-4" />}
                    {activity.type === 'project' && <Settings className="h-4 w-4" />}
                    {activity.type === 'payment' && <TrendingUp className="h-4 w-4" />}
                    {activity.type === 'document' && <FileText className="h-4 w-4" />}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <Button variant="ghost" className="w-full">
              {t('view_all_activity')}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </DashboardSection>
      </div>

      {/* Notifications Section */}
      <DashboardSection
        title={t('notifications')}
        description={t('notifications_description')}
      >
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
            <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                {t('system_maintenance')}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {t('system_maintenance_desc')}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                2 hours ago
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                {t('monthly_report')}
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                {t('monthly_report_desc')}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                1 day ago
              </p>
            </div>
          </div>
        </div>
      </DashboardSection>
    </>
  );
};

export default DashboardIndexPage;
