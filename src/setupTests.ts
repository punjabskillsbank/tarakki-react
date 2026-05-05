import '@testing-library/jest-dom';
// @ts-ignore
import { TextEncoder, TextDecoder } from 'util';

// @ts-ignore
global.TextEncoder = TextEncoder;
// @ts-ignore
global.TextDecoder = TextDecoder;
