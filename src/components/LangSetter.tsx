/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-24T06:40:00
 * Last Updated: 2025-12-24T06:40:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

'use client';

import { useEffect } from 'react';

type LangSetterProps = {
  locale: string;
};

export const LangSetter = ({ locale }: LangSetterProps) => {
  useEffect(() => {
    // Set the lang attribute on the document element for accessibility
    document.documentElement.lang = locale;
  }, [locale]);

  return null; // This component doesn't render anything
};
