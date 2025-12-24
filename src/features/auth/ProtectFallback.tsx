/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:35
 * Last Updated: 2025-12-24T01:03:44
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { useTranslations } from 'next-intl';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const ProtectFallback = (props: { trigger: React.ReactNode }) => {
  const t = useTranslations('ProtectFallback');

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{props.trigger}</TooltipTrigger>
        <TooltipContent align="center">
          <p>{t('not_enough_permission')}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
