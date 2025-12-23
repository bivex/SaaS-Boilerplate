import { auth } from '@/libs/auth';
import { toNextJsHandler } from 'better-auth/next-js';

const { POST } = toNextJsHandler(auth);

export { POST };
