import '@angular/compiler';
import { expect, afterEach } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { getTestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';

expect.extend(matchers as any);
getTestBed().initTestEnvironment(
    BrowserTestingModule,
    platformBrowserTesting()
);