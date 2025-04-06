import { config } from 'dotenv';
import { resolve } from 'path';
// Get the current directory name using import.meta.url
config({ path: resolve(__dirname, '../.env') });
